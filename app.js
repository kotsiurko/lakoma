/* Importing Different Moduls */

const {globalVariables} = require("./config/keys");
const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const keys = require('./config/keys');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');

const app = express();


// ! connection to DB with method { useNewUrlParser: true }
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
    .then(response => {
        console.log("MongoDB Successfully Connected!");
    }).catch(err => {
        console.log("Database connection failed");
});



/* Configure Express */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


/* Flash and Session */
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

/* Use Global Variables */
app.use(globalVariables);


/* File UploadMiddleware */
app.use(fileUpload());

/* Setup View Engine To Use Handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine', 'handlebars');


/* Method Override Middleware */
app.use(methodOverride('newMethod'));


/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


/* Start The Server */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
