# 🧪 Prototypes & Diagnostics

This directory contains standalone diagnostic scripts and foundational experiments used during the development of the **Fiber Guardian** middleware layer.

These scripts are critical for directly validating database connectivity, schema alignments, and exploring logic safely isolated from the main Express.js application and the local AI (Llama 3.1) pipeline. Keeping these isolated allows us to quickly verify that the underlying MongoDB Atlas infrastructure is sound before routing live traffic through the production endpoints.

## 📂 File Directory

* **`test_models.js`**: A diagnostic utility used to verify that the core Fiber Guardian Mongoose models (`DebtorProfile`, `RegulatoryRule`, `OutreachAttempt`) are actively communicating and correctly mapped to their respective collections (`accounts`, `rules`, `interactions`). Run this whenever schemas or `.env` connections change.

## 🚀 Running Diagnostics

To execute any of these standalone diagnostic tools, ensure you run them from the **root directory** of the project so they correctly interface with your `.env` variables:

```bash
node prototypes/test_models.js
```
