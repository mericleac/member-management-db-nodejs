const db = require("../database.js");
const fs = require('fs');
const { Parser } = require('json2csv');
const csv = require('fast-csv');

const fields = [
    'first_name',
    'last_name',
    'email',
    'phone_number',
    'street_address',
    'city',
    'state',
    'zip',
    'county',
    'notes',
    'membership_end_date',
    'renewal',
    'qb_date',
    'invoice_num',
    'receipt_num',
    'type',
    'renewal',
    'amount',
    'newsletter'
];

const headerToFieldMapping = {
    'Membership End Date': 'membership_end_date',
    'QB Date': 'qb_date',
    'Receipt #': 'receipt_num',
    'Last Name': 'last_name',
    'Street': 'street_address',
    'State': 'state',
    'County': 'county',
    'Email': 'email',
    'notes': 'notes',
    'Renew or New': 'renewal',
    'Invoice #': 'invoice_num',
    'Type': 'type',
    'First Name': 'first_name',
    'City': 'city',
    'Zip': 'zip',
    'Phone#': 'phone_number',
    'Amount': 'amount',
    'Notes': 'notes'
};

exports.getMembers = (req, res) => {
    const sql = 'select * from member';
    db.all(sql, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows);
      });
};

exports.createMember = (req, res) => {
    const fieldString = fields.join(',');
    const varArray = [];
    varArray.length = fields.length;
    varArray.fill('?');
    const varString = varArray.join(',');
    const sql = `INSERT INTO member (${fieldString}) VALUES (${varString})`;
    const params = fields.map((field) => req.body[field]);
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            id: this.lastID,
            ...req.body
        });
      });
};

exports.getMember = (req, res) => {
    const sql = "select * from member where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error": err.message});
          return;
        }
        res.json(row);
      });
};

exports.updateMember = (req, res) => {
    const fieldArray = fields.map((field) => `${field} = COALESCE(?,${field})`);
    const fieldString = fieldArray.join(', ');
    const sql = `UPDATE member set  ${fieldString} WHERE id = ?`;
    const params = fields.map((field) => req.body[field]);
    params.push(req.params.id);
    db.run(
        sql,
        params,
        (err, result) => {
            if (err){
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                id: req.params.id,
                ...req.body
            });
      });
};

exports.deleteMember = (req, res) => {
    db.run(
        'DELETE FROM member WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": err.message});
                return;
            }
            res.status(204).json({});
      });
};

exports.exportMembers = (req, res) => {
    let ids = req.query.ids;
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    const sql = `select * from member where id IN (${ids.join(',')})`;
    db.all(sql, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(rows);
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
      });
};

exports.importMembers = (req, res) => {
    const filePath = `${__basedir}/uploads/${req.file.filename}`;
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            const headers = csvData.shift();
            const fieldString = headers.map(header => headerToFieldMapping[header.trim()]).join(', ');
            const varArray = [];
            varArray.length = headers.length;
            varArray.fill('?');
            const memberPlaceholders = csvData.map(() => `(${varArray.join(', ')})`).join(', ');
            const flatMembers = [];
            csvData.forEach((arr) => { arr.forEach((item) => { flatMembers.push(item) }) });
            const sql = `INSERT INTO member (${fieldString}) VALUES ${memberPlaceholders}`;
            db.run(sql, flatMembers, (err, result) => {
                if (err){
                    res.status(400).json({"error": err.message});
                    return;
                }
                const sql = 'select * from member';
                db.all(sql, (err, rows) => {
                    if (err) {
                        res.status(400).json({"error": err.message});
                        return;
                    }
                    res.json(rows);
                });
            });
        });
    fs.unlinkSync(filePath);
    stream.pipe(csvStream);
};
