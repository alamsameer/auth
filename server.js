// authenticate  using github
//  how to ensure that it is authenticated
//  when i go to different route   first check if ti is authentucated  ifnot then route to different route

//  require dotenv  
require('dotenv').config()
const  exp= require('express')
const app=exp()
const passport =require('passport') 
const passwordGithub=require("passport-github") 
const session=require('express-session')

//  middeware 

//  express middellware 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized:false,
  cookie: {
    httpOnly:true,
     secure: false,
    maxAge:24*60*60*1000
    }
}))
// passport middeware 


app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


//  setting strategy 
var GitHubStrategy = require('passport-github').Strategy;


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://192.168.43.222:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
     console.log(accessToken);
    return cb(null,true);
  }
));


//  auth  request
app.get('/auth/github',
  passport.authenticate('github'));

  app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(res.user);
    res.redirect('/profile');
  });

// routing

 
app.get('/login',(req,res)=>{
  res.sendFile(__dirname+'/client/login.html')
})
//  home routing
app.get('/',(req,res)=>{
  console.log(res.user)
  if (req.isAuthenticated()) {
    res.redirect('/profile')
  }
  res.sendFile(__dirname+'/client/index.html')
})
//  protected route  start 
app.get('/profile',isLoggedIn ,(req,res)=>{
    res.sendFile(__dirname+'/client/profile.html')
})
app.get('/sam',isLoggedIn ,(req,res)=>{
  res.sendFile(__dirname+'/client/sam.html')
})

//  making page logout
app.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/')
})

//   To ensure authenticate 

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())  // <-- typo here
      return next();
  res.redirect('/');
}


//  server will listen  at port  3000
app.listen(3000,()=>{
  console.log("liten");
})
