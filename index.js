const MongoClient = require("mongodb").MongoClient
const assert = require("assert").strict
const dboper = require("./operations")

const url = "mongodb://localhost:27017/"
const dbname = "nucampsite"

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    // will throw error, terminate application, and log error if err is not null
    assert.strictEqual(err, null)

    console.log("Connected correctly to server")

    const db = client.db(dbname)

    db.dropCollection("campsites", (err, result) => {
        assert.strictEqual(err, null)
        console.log("Dropped Collection", result)

        dboper.insertDocument(
            db,
            { name: "Breadcrumb Trail Campground", description: "Test" },
            "campsites",
            (result) => {
                console.log("Insert Document:", result.ops)
                dboper.findDocuments(db, "campsites", (docs) => {
                    console.log("Found documents:", docs)
                    dboper.updateDocument(
                        db,
                        { name: "Breadcrumb Trail Campground" },
                        { description: "Updated test description" },
                        "campsites",
                        (result) => {
                            console.log(
                                "Updated document count:",
                                result.result.nModified
                            )
                            dboper.findDocuments(db, "campsites", (docs) => {
                                console.log("Found documents:", docs)

                                dboper.removeDocument(
                                    db,
                                    { name: "Breadcrumb Trail Campground" },
                                    "campsites",
                                    (result) => {
                                        console.log(
                                            "Deleted document count:",
                                            result.deletedCount
                                        )
                                        client.close()
                                    }
                                )
                            })
                        }
                    )
                })
            }
        )
    })
})
