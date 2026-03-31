# Regulatory Compliance & Outreach Engine

This project is a full-stack **MERN** (MongoDB, Express, React, Node.js) application designed to automate the monitoring of legal requirements and streamline stakeholder communication. It was built by **Adrian Rivas**, a recent graduate of **Stanford University's Symbolic Systems** program.

The engine was inspired by the real-world logistical challenges of managing international assets, specifically residential properties in **Santiago, Chile**, while being based in the **Chicago area**. In such scenarios, staying ahead of shifting regulatory landscapes is critical to avoiding violations and ensuring operational transparency.

---

## 🚀 Features

* **Automated Outreach Logic**: A backend engine that scans for upcoming deadlines and automatically triggers notifications.
* **Audit-Ready Logging**: Utilizes **Mongoose** middleware to maintain an immutable history of compliance status changes.
* **Flexible Schema Architecture**: A document-oriented data model that allows for the addition of new regulatory categories without database migrations.
* **Secure Credential Management**: Implementation of industry-standard environment variables to protect sensitive database access.

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
    ```bash
    node server.js
    ```
    The server will run locally at `http://localhost:3000`.

---

## 📖 Usage

* **GET `/`**: Confirms the server is live.
* **GET `/status`**: Returns a JSON summary of the current database log count and engine health.
* **POST `/logs`** *(Internal)*: Used by the engine to record new compliance events or outreach triggers.

---

## 👨‍💻 Author

**Adrian Rivas**
* **Location**: Chicago, IL
* **Affiliation**: Stanford University, Symbolic Systems
* **Focus**: Scalable backend architecture and automated systems.

---

## 📜 License

This project is developed for portfolio and educational purposes. All rights reserved.