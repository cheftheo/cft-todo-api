const express = require('express')
const app = express()
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cors =  require('cors');

app.use(cors({
    origin: 'http://localhost:8080', // This should match the URL of your front-end app
    credentials: true, // To allow session cookie from browser to pass through
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-www-form-urlencoded'] // Allowed custom headers
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

// app.use((req, res, next) => {
//     console.log('Incoming Request:', req.method, req.path);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(
    session({
        secret: 'ASGVBACBAVHOROXEGAYSABASAJBAVBAAVHCBAHVB',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 60 * 24 * 7},
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017',
            touchAfter: 60 * 1, // time period in seconds
            dbName: 'cft-roadmap',
            autoRemove: 'native'
          })
    })
);

const port = 3000
app.listen(port, () => {
    console.log(`MongoDB connection online -> mongodb://localhost:27017/cft-roadmap`)
    console.log(`Running on port -> ${port}`)
})

const posts = require('./api/posts');
const auth = require('./api/auth');

app.use('/api', posts);
app.use('/api', auth);