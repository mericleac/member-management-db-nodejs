// Global base path
global.__basedir = __dirname;

// Create express app
const express = require("express");
const bodyParser = require('body-parser');
const { queryParser } = require('express-query-parser');
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const app = express();

// create file parser
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

// create application parsers
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(
    queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true
    })
)

const corsOptions = {
    origin: "http://localhost:8081"
};
  
app.use(cors(corsOptions));

// Controllers
var memberController = require("./controllers/members");

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT));
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"});
});

// Insert here other API endpoints
app.get("/api/members", memberController.getMembers);
app.post("/api/members", memberController.createMember);
app.get("/api/members/export", memberController.exportMembers);
app.post("/api/members/import", upload.single('file'), memberController.importMembers);
app.get("/api/members/:id", memberController.getMember);
app.put("/api/members/:id", memberController.updateMember);
app.delete("/api/members/:id", memberController.deleteMember);

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
