const mongodb = require('mongodb');

const connection_url = 'mongodb://localhost:27017'

module.exports.LoadCollection = function(collectionName, database) {
    return new Promise( async (resolve, reject) => {
        const client = await mongodb.MongoClient.connect(connection_url, {
            useNewUrlParser: true
        });
        if (database != null) {
            const db = client.db(database);
            const collection = db.collection(collectionName);
            resolve(collection);
            return;
        }
  
        const db = client.db('cft-roadmap');
        const collection = db.collection(collectionName);
        resolve(collection);
    });
}