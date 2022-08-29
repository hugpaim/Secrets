require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltrounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email : String,
    password: String
});


const user = new mongoose.model("User", userSchema)


app.get('/', function (req,res) {
    res.render('home');
});
app.get('/login', function (req,res) {
    res.render('login');
});
app.get('/register', function (req,res) {
    res.render('register');
});
app.post('/register', function (req,res) {
    bcrypt.hash(req.body.password, saltrounds,function (err,hash) {
        const newuser = new user({
            email:req.body.username,
            password:hash
        });
        newuser.save(function (err) {
            if(err){
                console.log(err)
            }else{
                res.render('secrets');
            }
        });  
    } )
});
app.post("/login", function (req,res) {
    const username = req.body.username;
    const password = req.body.password;

    user.findOne({email: username}, function(err, founduser) {
        if(err){
            console.log(err)
        }else{
            if(founduser){
                bcrypt.compare(password, founduser.password, function(err,result) {
                  if (result===true){
                    res.render('secrets');
                    }  
                });
            }
        }
    });
});



app.listen(3000, function() {
console.log("server up on port 3000")});
