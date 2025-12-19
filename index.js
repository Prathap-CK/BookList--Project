require('dotenv').config();
const express=require('express');
const path=require('path');
const methodOverride=require('method-override');

const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.set('trust proxy', 1);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const session=require("express-session");
const pgSession=require("connect-pg-simple")(session);
const {pool}=require("./db");

app.use(session({
    store:new pgSession({
        pool:pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave:false,
    saveUninitialized:false,
    cookie :{maxAge : 7*24*60*60*1000}
}));

const bookRouter=require('./routes/books');
app.use('/',bookRouter);
app.use((req,res)=>{
    res.status(404).send('404 not found');
})
app.use((err,req,res,next)=>{
    console.error("Server Error :",err);
    res.status(500).send('Something went wrong');
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});
