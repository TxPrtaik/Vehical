let express=require('express');
let bodyparser=require('body-parser');
let app=express();
app.use(express.static("public/"));
app.use(bodyparser.urlencoded({extended:true}));
let exe=require("./connection");
app.get("/",(req,res)=>{
    res.render("home.ejs");
})
app.post("/save-vehical",async (req,res)=>{
    let d=req.body;
    let data=await exe(`insert into vehical(number,type,owner_name,owner_number) values('${d.number}','${d.type}','${d.owner_name}','${d.owner_number}')`)
if(data.length!=0){
    res.redirect("/");
}
})
app.get("/vehical-list",async (req,res)=>{
    let data=await exe(`select*,(select sum (distance)  from trip where trip.vehical_id=vehical.id) as total_distance from vehical`);
    let obj={
        "vehical":data
    }

    res.render("vehicallist.ejs",obj);
})
app.get("/trip/:id",async (req,res)=>{

    let data=await exe(`select*from vehical where id=${req.params.id}`);
    let obj={
        "vehical":data[0]
    }
    res.render("addtrip.ejs",obj);
})
app.post("/create-trip",async(req,res)=>{
    req.body.distance=req.body.end-req.body.start;
   let d=req.body;
   let data=await exe(`insert into trip(vehical_id,from_dist,to_dist,initial_km,ending_km,distance,date) values('${d.vid}','${d.from_location}','${d.to_location}','${d.start}','${d.end}','${d.distance}','${d.date}') `);
   if(data.length!=0){
    res.redirect("/vehical-list");
   }
})
app.get("/trip-info/:id",async (req,res)=>{
  let data=await exe(`select*from trip where vehical_id='${req.params.id}'`);
  let data2=await exe(`select*from vehical where id='${req.params.id}'`);
  let obj={
    "info":data,
    "vehical":data2[0]
  }
  res.render('tripinfo.ejs',obj);
})
app.listen(1000);
//create table vehical(id int primary key auto_increment,number,type,owner_name,owner_number);
//create table trip(id int primary key auto_increment,vehical id int,from varchar(100),to varchar(100),initial_km varchar(100),ending_km varchar(100),distance varchar(100),date varchar(100));
