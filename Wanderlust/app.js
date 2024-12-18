if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();
const port = 3000;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require('./models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

// app.get("/", (req,res)=>{
//   res.send("HI, I am root!");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/demouser', async (req,res)=>{
//   let fakeUser = new User({
//     email: "Student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// })

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next)=>{
  let { statusCode=500, message="Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs" ,{ message });
  // res.status(statusCode).send(message);
})

app.listen(port, ()=>{
  console.log(`Listening to the port ${port}`);
});