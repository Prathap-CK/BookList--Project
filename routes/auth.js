const express=require("express");
const bcrypt=require("bcryptjs");
const db=require("../db");

const router=express.Router();

router.get("/signup", (req,res)=>{
    res.render("signup");
});

router.post("/signup",async (req,res)=>{
    const {username,password}=req.body;

    const hashed=await bcrypt.hash(password,10);
    await db.query(
        "INSERT INTO users (username,password) VALUES ($1,$2)",
        [username,password]

    );
    res,redirect("/login");
}
);

router.get("/login",(req,res)=>{
    res.render("/login");
})

router.post("/login",async (req,res)=>{
    const {username,password}=req.body;

    const result=await db.query(
        "SELECT * FROM users WHERE username=$1",[username]
    );
    if (result.rows.length===0){
        return res.send("User not found!");}

        const user=result.rows[0];

        const match=await bcrypt.compare(password,user.password);
        if(!match)return res.send("Wrong Password");

        req.session.user={id : user.id, username :user.username};
        res.redirect("/");
    
});
router.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
});

module.exports=router;