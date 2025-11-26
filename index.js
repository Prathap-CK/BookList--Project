require('dotenv').config();
const express=require('express');
const path=require('path');
const methodOverride=require('method-override');

const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

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
