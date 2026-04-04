# Fiber Guardian - Product Requirements Document (PRD)

## 1. Product Vision & Scope
Fiber Guardian is a robust compliance middleware engineered for the debt collection industry to prevent potentially catastrophic FDCPA (Fair Debt Collection Practices Act) violations. As debt collection increasingly relies on autonomous AI outreach (text/voice calls), Fiber Guardian acts as an essential, un-bypassable gatekeeper. It implements a dual-layer validation system combining a fast deterministic local check (for temporal and state-specific constraints) with a sophisticated probabilistic AI analysis powered by a local Llama 3.1 model. The MVP effectively analyzes transcripts for harassment or threats before they reach the debtor, mitigating regulatory exposure and providing actionable audit trails.

## 2. User Personas & Core Journeys

**Persona: Compliance Officer (e.g., Sarah)**
- **Role:** Ensure all automated outreach adheres to state laws, local timezones, and FDCPA standards. Needs to quickly audit rejected attempts without diving into complex technical logs. Must rely on a digestable, legally sound 'Reasoning Artifact'.
- **Core Journey (Dashboard View):**
  1. Sarah logs into the Fiber Guardian dashboard (future React frontend).
  2. She accesses a real-time ledger of `OutreachAttempts` managed by the Node.js backend.
  3. She clicks on a specifically flagged/blocked attempt.
  4. The dashboard displays the text/voice transcript that was intended for the debtor along with their location/timezone context.
  5. The dashboard presents the **Reasoning Artifact**, breaking down exactly *why* the message was blocked (e.g., "Timezone Violation: 10 PM Local Time" vs. "Harassment Detected") allowing Sarah to report or iterate on the primary agent's prompt with high confidence.

## 3. System Architecture Workflow
The system natively integrates with your existing `models/`, `controllers/`, `routes/` structure to process requests:

1. **Step 1: Interception (The Request)**
   An upstream AI debt collection agent sends a `POST` request to the Fiber Guardian API route (e.g., `/api/v1/outreach/validate`) containing the `debtorId` and the proposed `transcript`.
2. **Step 2: Context Gathering (Node.js Controller)**
   The `OutreachController` intercepts the request and queries MongoDB to fetch both the `DebtorProfile` and the `RegulatoryRules` mapped to that debtor's specific US state.
3. **Step 3: The Deterministic Gates (Node.js Logic)**
   - **Timezone Verification:** The controller uses a precise date library like **Luxon** to fetch the exact, second-level precision current local time of the debtor (e.g., "What time is it *right now* in `America/Los_Angeles`?"). It compares this strictly to the allowed hours (e.g., calling at 8:59:59 PM is legal; at 9:00:00 PM it is a violation).
   - **Frequency Cap (Regulation F "7-in-7"):** The controller queries the `OutreachAttempt` collection to count PASSED attempts over the past 7 rolling days. If the count is >= the `frequencyCap`, the request is blocked.
   *If either deterministic check fails, the request is immediately logged and rejected—bypassing heavy AI computation.*
4. **Step 4: The Probabilistic Gate (Local Llama 3.1)**
   If the deterministic checks pass smoothly, the controller dispatches the `transcript` and a structured, constrained prompt to the local Ollama instance (running on the RTX 3060).
   - *Performance Consideration:* In a production environment, this should utilize a message queue (like **BullMQ**) for asynchronous processing, so the primary debt-collection agent doesn't hang while waiting 2–5 seconds for local GPU inference.
5. **Step 5: Audit Logging (MongoDB Models)**
   Once the Ollama API responds, an `OutreachAttempt` document is instantaneously created via Mongoose, securely logging the transcript, status (Pass/Fail), and the AI's "Reasoning Artifact".
6. **Step 6: Gatekeeper Response**
   The application resolves the initial API request returning the final decision to the upstream agent (`SEND` or `BLOCK`).

## 4. Zero-Trust MongoDB Validation
Fiber Guardian enforces strict zero-trust hygiene before executing any database reads or writes via Mongoose. This ensures regulatory audits are entirely deterministic and sound:
- **Connection Ready-State Checks:** All diagnostic or compliance routes proactively verify `mongoose.connection.readyState`. If the primary database goes offline, requests fail safely with detailed `503 Service Unavailable` metadata rather than failing gracefully or timing out, ensuring the AI model is never queried loosely.
- **Explicit Type Enforcement:** IDs from clients are sanitized through `mongoose.isValidObjectId()` and explicit casting rather than risky Regex checks.
- **Idempotent Updates:** Data masking and archiving use targeted filters (`$ne`) to separate missing data from logically archived data, enforcing predictable, transparent workflows.

## 5. Database Schemas (MongoDB)
Schemas align directly with your current Mongoose `models/` directory, operating within the `fiber_guardian_db` database:

**Model: `DebtorProfile` (Collection: `accounts`)**
```javascript
{
  _id: ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  state: { type: String, required: true, minlength: 2, maxlength: 2 }, // e.g., 'NY', 'CA'
  timezone: { type: String, required: true }, // e.g., 'America/New_York'
  phone: { type: String, required: true, select: false }, // PII protected field, omitted by default
  createdAt: { type: Date, default: Date.now }
}
```

**Model: `RegulatoryRule` (Collection: `rules`)**
```javascript
{
  _id: ObjectId,
  state: { type: String, required: true, unique: true },
  allowedHours: {
    start: { type: String, required: true }, // "08:00" in 24h format
    end: { type: String, required: true }    // "21:00" in 24h format
  },
  frequencyCap: { type: Number, default: 7 }, // The Regulation F "7-in-7" rule limit
  specialConstraints: { type: [String], default: [] }
}
```

**Model: `OutreachAttempt` (Collection: `interactions`)**
```javascript
{
  _id: ObjectId,
  debtorId: { type: ObjectId, ref: 'DebtorProfile', required: true },
  transcript: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['PASSED', 'BLOCKED_TIME', 'BLOCKED_FREQUENCY', 'BLOCKED_CONTENT', 'ERROR'], 
    required: true 
  },
  aiReasoning: { type: String }, // Granular text reasoning returned from Llama 3.1
  isArchived: { type: Boolean, default: false }, // Soft-delete flag
  timestamp: { type: Date, default: Date.now }
}
```

## 5. API Specifications

**Endpoint: `POST /api/v1/outreach/validate`**
- **Description:** Evaluates a proposed message against deterministic and probabilistic compliance checks.
- **Request Body:**
  ```json
  {
    "debtorId": "65e23f1a23b4c5d6e7f8g9h0",
    "transcript": "Pay your debt immediately or we will involve local law enforcement.",
    "channel": "SMS"
  }
  ```
- **Response (200 OK - Blocked Example):**
  ```json
  {
    "action": "BLOCK",
    "reasonCode": "BLOCKED_CONTENT",
    "details": {
      "reasoning": "Blocked: Harassment. The phrase 'involve local law enforcement' falsely implies criminal proceedings for a civil debt.",
      "timestamp": "2026-04-02T23:11:53Z"
    }
  }
  ```

**Endpoint: `GET /api/v1/attempts`**
- **Description:** Fetches logged attempts explicitly for populating the Compliance Dashboard.
- **Query Params:** `status` (optional focus filter), `limit` (default 50), `page` (pagination logic).

## 6. AI Prompt Engineering Strategy

**System Prompt Sent to Local Llama 3.1 (via Node.js):**

```text
You are a highly capable legal analysis engine specializing in the Fair Debt Collection Practices Act (FDCPA).
Your crucial task is to deeply analyze the following proposed outreach transcript from an automated debt collector to a consumer.

RULES:
1. You must immediately reject and flag any content that implies violence, uses profane language, falsely threatens arrest or legal action, or attempts to intentionally annoy the consumer.
2. Determine if the overall tone is informative, polite, and strictly compliant with standard disclosure practices.

Provide your output EXACTLY as a JSON object complying with the following schema, and NO other markdown or text. You MUST operate in strict JSON Mode:
{
  "isCompliant": <boolean>,
  "violationCategory": <string | null> (e.g., "HARASSMENT", "FALSE_THREAT", "ABUSE", "NONE"),
  "reasoningArtifact": <string> (A clear explanation citing the exact specific phrase that caused the violation. Example: "Blocked: Harassment. The phrase 'involve local law enforcement' falsely implies criminal proceedings for a civil debt.")
}

TRANSCRIPT TO ANALYZE:
"{{transcript}}"
```

## 7. Data Seeding Requirements
To properly test timezone logic (deterministic) combined with local model integration, the application will be seeded with an array of ~50 varying state profiles. 

**JSON Blueprint Snippet (Generating Mock Boundaries):**
```json
[
  {
    "firstName": "John",
    "lastName": "Doe",
    "state": "NY",
    "timezone": "America/New_York",
    "phone": "+12125550101"
  },
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "state": "CA",
    "timezone": "America/Los_Angeles",
    "phone": "+13105550102"
  },
  {
    "firstName": "Robert",
    "lastName": "Johnson",
    "state": "TX",
    "timezone": "America/Chicago",
    "phone": "+15125550103"
  },
  {
    "firstName": "Maria",
    "lastName": "Garcia",
    "state": "FL",
    "timezone": "America/New_York",
    "phone": "+13055550104"
  },
  {
    "firstName": "David",
    "lastName": "Miller",
    "state": "NV",
    "timezone": "America/Los_Angeles",
    "phone": "+17025550105"
  }
]
```
