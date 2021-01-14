const dotenv = require('dotenv');
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const user = require("./routes/api/users");

const app = express();

// Bodyparser middleware

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Use this if only running local, or else change use environment variables
// const db = require("./config/keys").mongoURI;

// Use this for utilizing env values
const db = process.env.mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", user);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
