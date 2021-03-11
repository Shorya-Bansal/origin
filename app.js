require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { static } = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/userDB", { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRETS, encryptedFields: ["password"] });

const User = mongoose.model("Users", userSchema);
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        }
        else {
            console.log(err);
        }
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const pass = req.body.password;

    User.findOne({ email: username, password: pass }, function (err, foundUser) {
        res.render("secrets");
    });
});





app.listen(3000, function () {
    console.log("The server is running at port 3000");
});