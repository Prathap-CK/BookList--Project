const express=require("express");
const router=express.Router();

router.get("/api/health",(req,res)=>{
    res.json({message:"backend is alive"});
});

module.exports=router;
