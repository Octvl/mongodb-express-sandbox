# Regulatory Compliance & Outreach Engine

This project is a full-stack **MERN** (MongoDB, Express, React, Node.js) application designed to automate the monitoring of legal requirements and streamline stakeholder communication. It was built by **Adrian Rivas**, a recent graduate of **Stanford University's Symbolic Systems** program.

The engine was inspired by the real-world logistical challenges of managing international assets, specifically residential properties in **Santiago, Chile**, while being based in the **Chicago area**. In such scenarios, staying ahead of shifting regulatory landscapes is critical to avoiding violations and ensuring operational transparency.

---

## 🚀 Features

* **Automated Outreach Logic**: A backend engine that scans for upcoming deadlines and automatically triggers notifications.
* **Audit-Ready Logging**: Utilizes **Mongoose** middleware to maintain an immutable history of compliance status changes.
* **Flexible Schema Architecture**: A document-oriented data model that allows for the addition of new regulatory categories without database migrations.
---

## 🛠️ Tech Stack

* **Database**: MongoDB Atlas (Cloud NoSQL)
* **ODM**: Mongoose
* **Backend**: Node.js & Express.js
* **Frontend**: React (Planned/MERN)
* **Development Environment**: Google Antigravity

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/regulatory-compliance-engine.git
    cd regulatory-compliance-engine
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```text
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/compliance_db
    ```
    *Note: Ensure `.env` is listed in your `.gitignore` to prevent leaking credentials.*

4.  **Start the server:**
    For production or standard running:
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

The engine is built around a RESTful API architecture. You can test these endpoints using the provided `api_tests.http` file via the VSCode REST Client extension.

### System Endpoints
* **GET `/`**: Redirects to the system info.
* **GET `/api/system/`**: Confirms the server is live with a welcome message.
* **GET `/api/system/status`**: Returns a JSON summary of the current database log count and engine health.

### Log Management Endpoints
* **GET `/api/logs`**: Retrieves all active compliance logs.
* **GET `/api/logs?status=Failed`**: Retrieves logs filtered by specific status.
* **POST `/api/logs`**: Records directly into the database.
* **DELETE `/api/logs/:id`**: Performs a "Soft Delete" (archives the log while preserving the audit trail).

---

## 🧪 Architecture & Evolution

This repository includes a `prototypes/` directory. These scripts (like `find_movie.js`) represent the initial research phase where I explored MongoDB's query logic before architecting the full Regulatory Compliance & Outreach Engine. I’ve included them to document the transition from standalone scripts to a production-grade MBC (Model-View-Controller) API. This structure provides better scalability, security, and maintainability compared to the original standalone scripts.

---

## 👨‍💻 Author

**Adrian Rivas**
* **Location**: Chicago, IL
* **Affiliation**: Stanford University, Symbolic Systems
* **Focus**: Scalable backend architecture and automated systems.

---

## 📜 License

This project is developed for portfolio and educational purposes. All rights reserved.