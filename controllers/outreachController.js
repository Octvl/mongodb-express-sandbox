/**
 * Outreach Controller
 * This file contains the logic for handling requests related to compliance outreach attempts,
 * including fetching attempts, validating new attempts, and archiving them.
 */

const OutreachAttempt = require('../models/OutreachAttempt');

/**
 * @desc    Get all outreach attempts or filter them by status
 * @route   GET /api/v1/attempts
 * @access  Public
 */
exports.getAttempts = async (req, res) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};

        // Exclude soft-deleted components
        filter.isArchived = { $ne: true };

        const attempts = await OutreachAttempt.find(filter).collation({ locale: 'en', strength: 2 });
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Validate a proposed outreach message and log the attempt
 * @route   POST /api/v1/outreach/validate
 * @access  Public
 */
exports.validateOutreach = async (req, res) => {
    try {
        // Here we log the attempt based on request body
        const newAttempt = new OutreachAttempt({
            ...req.body,
            status: req.body.status || 'ERROR' // Handle default if not provided
        });
        const savedAttempt = await newAttempt.save();
        
        // Mock response to mostly match PRD, but returning saved log as well
        res.status(200).json({
            action: savedAttempt.status === 'PASSED' ? 'SEND' : 'BLOCK',
            reasonCode: savedAttempt.status,
            details: {
                reasoning: savedAttempt.aiReasoning,
                timestamp: savedAttempt.timestamp,
                savedLogId: savedAttempt._id
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

        const updatedAttempt = await OutreachAttempt.findByIdAndUpdate(
            attemptId,
            { isArchived: true },
            { returnDocument: 'after' } 
        );

        if (!updatedAttempt) {
            return res.status(404).json({ error: "Outreach attempt not found" });
        }

        res.json({ message: "Outreach attempt archived successfully", attempt: updatedAttempt });
    } catch (error) {
        res.status(500).json({ error: "Failed to archive attempt. Check ID format." });
    }
};
