const client = require('./db');

async function runTest() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Sandbox: Connection is rock solid!");

        const database = client.db("sandbox_db");
        const collection = database.collection("learning_logs");
        const result = await collection.insertOne({
            task: "Testing my new modular structure",
            date: new Date()
        });

        console.log(`🚀 Success! Document inserted with ID: ${result.insertedId}`);
    } catch (error) {
        console.error("❌ Sandbox Error:", error);
    } finally {
        await client.close();
    }
}

runTest();