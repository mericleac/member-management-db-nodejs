var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    }else{
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE member (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name text,
                last_name text,
                email text,
                phone_number text,
                street_address text,
                city text,
                state text,
                zip text,
                county text,
                notes text,
                membership_end_date date,
                qb_date date,
                invoice_num text,
                receipt_num text,
                type text,
                amount real,
                newsletter boolean,
                renewal text
            )`,
            (err) => {}
        );
    }
});


module.exports = db;
