/**
 * Outreach Controller
 * This file contains the logic for handling requests related to compliance outreach attempts,
 * including fetching attempts, validating new attempts, and archiving them.
 */

const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const OutreachAttempt = require('../models/OutreachAttempt');
const DebtorProfile = require('../models/DebtorProfile');
const RegulatoryRule = require('../models/RegulatoryRule');

/**
 * @desc    Get all outreach attempts or filter them by status
 * @route   GET /api/v1/attempts
 * @access  Public
 */
exports.getAttempts = async (req, res) => {
    try {
        // Zero-Trust: Strictly validate all incoming query keys to prevent parameter pollution or bypassing
        const allowedQueryParams = ['status', 'limit', 'page'];
        const queryKeys = Object.keys(req.query);
        
        for (const key of queryKeys) {
            if (!allowedQueryParams.includes(key)) {
                return res.status(400).json({ 
                    error: `Validation Error: Unauthorized query parameter '${key}' detected. Allowed parameters are: ${allowedQueryParams.join(', ')}.` 
                });
            }
        }

        const filter = {};

        // Exclude soft-deleted components explicitly
        filter.isArchived = { $ne: true };

        // Prevent NoSQL injection and restrict to valid enums
        if (req.query.status) {
            if (typeof req.query.status !== 'string') {
                return res.status(400).json({ error: 'Validation Error: Status query parameter must be a strictly formatted string.' });
            }

            const validStatuses = ['PASSED', 'BLOCKED_TIME', 'BLOCKED_FREQUENCY', 'BLOCKED_CONTENT', 'ERROR'];
            const statusFilter = req.query.status.toUpperCase();

            if (!validStatuses.includes(statusFilter)) {
                return res.status(400).json({
                    error: `Validation Error: Unrecognized status filter. Valid options are: ${validStatuses.join(', ')}`
                });
            }

            filter.status = statusFilter;
        }

        // Enforce reasonable limits and sort chronologically
        const attempts = await OutreachAttempt.find(filter)
            .collation({ locale: 'en', strength: 2 })
            .sort({ timestamp: -1 })
            .limit(100);

        //  Return query metadata alongside data payload
        res.status(200).json({
            count: attempts.length,
            filtersApplied: filter,
            data: attempts
        });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

/**
 * @desc    Validate a proposed outreach message and log the attempt
 * @route   POST /api/v1/outreach/validate
 * @access  Public
 */
exports.validateOutreach = async (req, res) => {
    try {
        const { debtorId, transcript, status, aiReasoning } = req.body;

        // Ensure precision by enforcing required fields
        if (!debtorId || !transcript) {
            return res.status(400).json({
                error: 'Validation Error: debtorId and transcript are required.'
            });
        }
        
        // Security: Validate debtorId format to prevent BSON casting errors
        if (!mongoose.isValidObjectId(debtorId)) {
            return res.status(400).json({ error: "Validation Error: Invalid Debtor ID format." });
        }

        // 1. Fetch Context
        const debtorProfile = await DebtorProfile.findById(debtorId);
        if (!debtorProfile) {
            return res.status(404).json({ error: "Not Found: Debtor profile does not exist." });
        }

        // 2. Fetch Regulatory Rules mapped to the debtor's state
        const regulatoryRule = await RegulatoryRule.findOne({ state: debtorProfile.state });
        
        // Fallback to Federal Standard if state rules don't exist
        const allowedHours = regulatoryRule?.allowedHours || { start: "08:00", end: "21:00" };

        // 3. Deterministic Time Gate (Luxon)
        const localTime = DateTime.now().setZone(debtorProfile.timezone);
        if (!localTime.isValid) {
            return res.status(400).json({ error: "Validation Error: Invalid timezone configuration on debtor profile." });
        }

        const currentHourMin = localTime.toFormat('HH:mm');
        
        // Initialize final mock statuses
        let finalStatus = status;
        let finalReasoning = aiReasoning || null;
        
        // Check if outside boundaries strictly. Using HH:mm string comparison is reliable due to leading zeros.
        if (currentHourMin < allowedHours.start || currentHourMin > allowedHours.end) {
            finalStatus = 'BLOCKED_TIME';
            finalReasoning = `Blocked: Timezone Violation. Local time for debtor is ${localTime.toFormat('h:mm a')}. FDCPA regulates outreach strictly between ${allowedHours.start} and ${allowedHours.end} local time.`;
        } else {
            // Improve precision by strictly validating status enum if not already fast-failed by timegate
            const validStatuses = ['PASSED', 'BLOCKED_TIME', 'BLOCKED_FREQUENCY', 'BLOCKED_CONTENT', 'ERROR'];
            finalStatus = validStatuses.includes(status) ? status : 'ERROR';
        }

        // Secure DB transaction: Prevent mass assignment by destructing only expected properties
        const newAttempt = new OutreachAttempt({
            debtorId,
            transcript,
            status: finalStatus,
            aiReasoning: finalReasoning
        });

        const savedAttempt = await newAttempt.save();

        // Increase transparency with detailed, specific response data mapping PRD outcomes
        const actionDecision = savedAttempt.status === 'PASSED' ? 'SEND' : 'BLOCK';

        res.status(200).json({
            action: actionDecision,
            reasonCode: savedAttempt.status,
            details: {
                debtorId: savedAttempt.debtorId,
                reasoning: savedAttempt.aiReasoning || 'N/A',
                timestamp: savedAttempt.timestamp,
                savedLogId: savedAttempt._id
            }
        });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

/**
 * @desc    Soft delete (archive) an outreach attempt
 * @route   DELETE /api/v1/attempts/:id
 * @access  Public
 */
exports.archiveAttempt = async (req, res) => {
    try {
        const attemptId = req.params.id;

        // Security: Validate attemptId format to prevent BSON casting errors and parameter injections
        if (!mongoose.isValidObjectId(attemptId)) {
            return res.status(400).json({ error: "Validation Error: Invalid Attempt ID format." });
        }

        // Precision: Only update if the document exists AND is not already archived
        const updatedAttempt = await OutreachAttempt.findOneAndUpdate(
            { _id: attemptId, isArchived: { $ne: true } },
            { isArchived: true },
            { new: true }
        );

        if (!updatedAttempt) {
            // Transparency: Distinguish clearly between missing and already-archived records
            const exists = await OutreachAttempt.findById(attemptId);
            if (exists && exists.isArchived) {
                return res.status(409).json({ error: "Conflict: Outreach attempt is already archived." });
            }
            return res.status(404).json({ error: "Not Found: Outreach attempt does not exist." });
        }

        // Transparency: Provide predictable status shape matching system norms
        res.status(200).json({
            action: "ARCHIVE",
            status: "PASSED",
            details: {
                message: "Outreach attempt archived successfully.",
                archivedId: updatedAttempt._id
            }
        });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
