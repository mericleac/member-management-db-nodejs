var db = require("../database.js")

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
    'type'
]

exports.getMembers = (req, res) => {
    var sql = "select * from member"
    var params = []
    db.all(sql, params, (err, rows) => {
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
          res.status(400).json({"error":err.message});
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
                res.status(400).json({"error": res.message});
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
                res.status(400).json({"error": res.message});
                return;
            }
            res.status(204).json({});
      });
};
