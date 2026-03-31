const client = require('./db');

async function findMovie() {
    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const movies = db.collection('movies');
        
        const query = { year: 1994 };
        const movie = await movies.findOne(query, { projection: { _id: 0, title: 1 } });

        if (movie) {
            console.log(`🎬 Found a movie from 1994: ${movie.title}`);
        } else {
            console.log(`❌ No movie found from 1994`);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

findMovie();
