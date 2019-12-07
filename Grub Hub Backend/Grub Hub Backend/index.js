const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors');
var withAuth = require('./Middleware/middleware')
var itemsRouter = require('./Routes/ItemsRoute1')
var detailsRouter = require('./Routes/Details1')
var router = express.Router()
var multer = require('multer');
const secret = 'mysecretsshhh';
var morgan = require('morgan');
var path = require('path');
var session = require('express-session')
var passport = require('passport');
const graphqlHttp = require('express-graphql')
const schema = require('./GraphQLSchema/schema')
//use cors to allow cross origin resource sharing
app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./config/passport')(passport);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
    secret: 'Aishwarya is secret',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}))
//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.use(morgan('dev'))

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use('/graphQL',graphqlHttp({
    schema,
    graphiql:true
}));

app.use('/uploads', express.static('uploads'))
app.use(cookieParser())
app.use('/items', itemsRouter)
app.use('/details', detailsRouter)
app.post('/testToken', (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    console.log(email + ' ' + password);
    if (email == 'admin' && password == 'admin') {
        console.log('dd');
        const payload = { email };
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: false });

        res.end('done');
    }
});
app.get('/api/secret', withAuth, function (req, res) {
    res.send('The password is potato');
})
app.get('/checkToken', passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log(req.headers)
    res.sendStatus(200);
})
app.get('/logout', withAuth, function (req, res) {

    res.sendStatus(200);
})
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');

});

var port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('app is listening at port 3001');
})

module.exports = app