// cookie kaise set karte hain aur read karte hain

/*const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
    res.cookie("name", "praveen");
    res.send("Cookie has been set");
});

app.get("/read", (req, res) => {
    console.log(req.cookies);
    res.send("read page");
});

app.listen(3000);*/


// bcrypt kaise use karte hain *******************--------------------------*********************************--------------------------

/*const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.get("/", (req, res) => {
    // Password ko hash karne ka example, encryption ke liye
    //bcrypt.genSalt(10, function(err, salt) {
    //bcrypt.hash("pra@7488", salt, function(err, hash) {
    //    console.log(hash);
    //    });
    //});


    // Password ko verify karne ka example, decryption ke liye
    bcrypt.compare("pra@7488", "$2b$10$UqxX6A71jMBFkJNV/wsy1.4xK2VqhH.KWKCwkOgdZ3NeIQr8sFDEi", function(err, result) {
        console.log(result);
    });
});


app.listen(3000);*/


// JWT kaise use karte hain *******************--------------------------*********************************--------------------------

/*const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get("/", (req, res) => {
    const token = jwt.sign({email: "praveen@example.com"}, "secret");   // email isiliye kyunki wo sabki unique hoti hai and the secret is very secret we cant write it in plain text
    // console.log(token);
    res.cookie("token", token);
    res.send("done");
});

app.get("/read", (req, res) => {
    //console.log(req.cookies.token);
    let data = jwt.verify(req.cookies.token, "secret");
    console.log(data);
})


app.listen(3000);*/








// Part-2 ***************************************************************////////////////////////***************************************** */

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const cookieParser = require('cookie-parser');
const path = require('path');

const userModel = require('./models/user'); 

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("index");
});

app.post('/create', (req, res) => {
    let {username, email, password, age} = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({ email }, "shhhhh");
            res.cookie("token", token);

            res.send(createdUser);
        });
    });
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if(!user) res.send("Something went wrong");

    // console.log(user.password, req.body.password); to check if the password is correct or not

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        //console.log(result);
        if(result) {
            let token = jwt.sign({email: user.email}, "shhhhh");
            res.cookie("token", token);
            res.send("Yes you can Login");
        }
            
        else res.send("Something went wrong");
    })
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
})

app.listen(3000);