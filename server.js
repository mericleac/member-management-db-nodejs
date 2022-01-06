// Create express app
var express = require("express");
var bodyParser = require('body-parser')

var app = express();

// create application parsers
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Controllers
var userController = require("./controlers/users");

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
app.get("/api/users", userController.getUsers);
app.post("/api/users", userController.createUser);
app.get("/api/users/:id", userController.getUser);
app.put("/api/users/:id", userController.updateUser);
app.delete("/api/users/:id", userController.deleteUser);

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
