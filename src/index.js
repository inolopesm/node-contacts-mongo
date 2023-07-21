const { MongoClient, ObjectId } = require("mongodb");

const mongoUrl = "mongodb://localhost/contacts";

const main = async () => {
  const command = process.argv[2];

  if (command === "help") {
    console.log("=== CONTACTS CRUD ===")
    console.log("");
    console.log("Commands:");
    console.log("- create");
    console.log("- read");
    console.log("- update");
    console.log("- delete");
    console.log("");
    console.log("Examples:");
    console.log("- node src create matheus 550012341234");
    console.log("- node src read");
  }

  if (command === "create") {
    const name = process.argv[3];
    const phoneNumber = process.argv[4];

    const client = new MongoClient(mongoUrl);
    await client.connect();

    try {
      await client.db().collection("Contact").insertOne({ name, phoneNumber });
    } finally {
      await client.close();
    }
  }

  if (command === "read") {
    const client = new MongoClient(mongoUrl);
    await client.connect();

    try {
      const rows = await client.db().collection("Contact").find().toArray();
      console.table(rows);
    } finally {
      await client.close();
    }
  }

  if (command === "update") {
    const _id = new ObjectId(process.argv[3]);
    const name = process.argv[4];
    const phoneNumber = process.argv[5];

    const client = new MongoClient(mongoUrl);
    await client.connect();
    const session = client.startSession();

    try {
      // work only on a replica set member or mongos
      // await session.withTransaction(async () => {
        await client
          .db()
          .collection("Contact")
          .updateOne({ _id }, { $set: { name, phoneNumber } }, { session });
      // });
    } finally {
      await client.close();
    }
  }
};

main();
