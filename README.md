# Fiber Guardian

Fiber Guardian is a robust compliance middleware engineered for the debt collection industry to prevent potentially catastrophic FDCPA (Fair Debt Collection Practices Act) violations. As debt collection increasingly relies on autonomous AI outreach (text/voice calls), Fiber Guardian acts as an essential, un-bypassable gatekeeper. 

It implements a dual-layer validation system combining a fast deterministic local check (for temporal and state-specific constraints) with a sophisticated probabilistic AI analysis powered by a local Llama 3.1 model. 

Built by **Adrian Rivas**, a recent graduate of **Stanford University's Symbolic Systems** program.

---

## 🚀 Features

* **Dual-Layer Validation**: Intercepts AI collection messages before they are sent and evaluates them legally.
* **Zero-Trust Mongoose Validation**: Enforces strict schema constraints, ObjectID parameter hygiene, and precise Database connection ready-state checks before interacting with the persistent layer.
* **Deterministic Gates**: Eliminates easy violations by enforcing local timezone verifications and frequency capping (e.g., Regulation F's "7-in-7" rule).
* **Probabilistic AI Analysis**: Analyzes transcript intent for harassment, abusive language, or false legal threats using local GPU inference (Llama 3.1).
* **Audit-Ready Logging**: Transparently logs the exact "Reasoning Artifact" for each `OutreachAttempt` (both passes and blocked violations) natively into MongoDB.

---

## 🛠️ Tech Stack

* **Database**: MongoDB Atlas (Cloud NoSQL) managed via Mongoose ODM for rigid zero-trust security.
* **Backend**: Node.js & Express.js
* **AI Model Pipeline**: Local Llama 3.1 (Ollama integration mapped via standard REST interface)
* **Development Environment**: Google Antigravity

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/octvl/fiber-guardian.git
    cd fiber-guardian
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```text
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fiber_guardian_db
    ```
    *Note: Ensure `.env` is listed in your `.gitignore` to prevent leaking credentials.*

4.  **Start the server:**
    For production running:
    ```bash
    npm start
    ```
    For development with auto-reloading (via nodemon):
    ```bash
    npm run dev
    ```
    The server will run locally at `http://localhost:3000`.

---

## 📖 API Usage

The engine provides RESTful compliance gates. 

### System Endpoints
* **GET `/`**: Redirects to the system info.
* **GET `/api/system/status`**: Returns an operational health check and current `OutreachAttempt` document counts in the ledger.

### Compliance Validation Endpoints
* **POST `/api/v1/outreach/validate`**: Primary gatekeeper. Accepts an outreach prompt and returns a `SEND` or `BLOCK` decision along with its legal reasoning logic.
* **GET `/api/v1/attempts`**: Retrieves the log of historical `OutreachAttempt` data for the dashboard ledger.
* **DELETE `/api/v1/attempts/:id`**: Performs a "Soft Delete" (archives) an existing outreach attempt from the ledger view.

---

## 🧪 Architecture & Evolution

This repository includes a `prototypes/` directory. Diagnostic scripts like `test_models.js` and `find_movie.js` are used for rapid validation during database migrations to ensure the Mongoose configurations (mapping models to collections such as `accounts`, `rules`, and `interactions`) function perfectly before traffic flows to the main application routers.

---

## 👨‍💻 Author

**Adrian Rivas**
* **Location**: Chicago, IL
* **Affiliation**: Stanford University, Symbolic Systems
* **Focus**: Scalable backend architecture and automated compliance systems.

---

## 📜 License

This project is developed for portfolio and educational purposes. All rights reserved.