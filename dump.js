const db = require("./database");

const date = new Date();
const fileName = `backup${date.toISOString()}`;
db.run(`.output ./dumps/${fileName}.dump`)
db.run(`.dump`);
