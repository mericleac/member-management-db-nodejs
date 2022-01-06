var db = require("../database.js")


exports.getUsers = (req, res) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows);
      });
};

exports.createUser = (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email
    };
    const sql = 'INSERT INTO user (name, email) VALUES (?,?)';
    const params = [data.name, data.email];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            id: this.lastID,
            ...data
        });
      });
};

exports.getUser = (req, res) => {
    const sql = "select * from user where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(row);
      });
};

exports.updateUser = (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email
    };
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email)
           WHERE id = ?`,
        [data.name, data.email, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message});
                return;
            }
            res.json({
                id: req.params.id,
                ...data
            });
      });
};

exports.deleteUser = (req, res) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message});
                return;
            }
            res.status(204).json({});
      });
};
