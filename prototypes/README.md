# 🧪 Prototypes & Early Experiments

This directory contains the foundational scripts created during the initial research and development phase of the Regulatory Compliance & Outreach Engine. 

These standalone scripts were used to test database connectivity, learn the schema logic, and validate queries before the project was refactored into a scalable MVC (Model-View-Controller) architecture using Express.js.

## 📂 File Directory

* **`test.js`**: My first successful connection to the MongoDB Atlas cluster. Verified network access by executing a diagnostic ping and a simple document insertion into a sandbox collection.
* **`find_movie.js`**: An exploration into MongoDB's query syntax and projection logic. It searches the standard `sample_mflix` dataset to retrieve a specific record without returning unnecessary metadata.
* **`app.js`**: A prototype for full CRUD operations. It demonstrates the ability to query the main compliance logs and safely delete test data, serving as the blueprint for the eventual `logController.js` logic.
