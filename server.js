//importing packages
const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const pricingRouter = require('./routes/pricingRouter');


const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV || "production";

require('dotenv').config({ path: '.env.' + NODE_ENV });
const PORT = process.env.PORT;

console.log(`Your env is ${process.env.NODE_ENV}`);
app.use(cors());
app.set('view engine', 'html');
app.set("locale", "en");
global.LOCALE = app.get("locale");

app.set("env", process.env);
global.ENV = app.get("env");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  res.removeHeader("X-Powered-By");
  // Pass to next layer of middleware
  next();
});

app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api/pricing', pricingRouter);


//connecting database
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log("database connected")
});

//(error handling ) when errors will be occur
mongoose.connection.on('error', (err) => {
  console.log("err connecting", err)
});
//setting up custom error message for routes 
app.use((req, res, next) => {
  const error = new Error('This APIs does not exist');
  error.status = 404;
  next(error);
});

//Error handler function`
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log("server is running on", PORT)
});
