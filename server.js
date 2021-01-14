const dotenv = require('dotenv');
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

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

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirnam, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
