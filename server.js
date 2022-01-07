// Create express app
var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");

var app = express();

// create application parsers
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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
app.get("/api/members/:id", memberController.getMember);
app.put("/api/members/:id", memberController.updateMember);
app.delete("/api/members/:id", memberController.deleteMember);

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
