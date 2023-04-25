//import express module
const exp=require("express");
const app=exp();

//for validating CORS policy
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
//initializing app to listen onn port 5000
app.listen(5000,()=>console.log("Listening on port 5000..."));

//body parser middleware
app.use(exp.json());

//importing userApi
const userApp=require("./APIs/userAPI");
app.use("/user-api",userApp);

//Error Handling MiddleWare
const errHandlingMiddleware=require("./APIs/middlewares/errorHandlingMiddleware");
app.use(errHandlingMiddleware);

//Invalid Path MiddleWare
const invalidPathMiddleware=require("./APIs/middlewares/invalidPathMiddleware");
app.use("*",invalidPathMiddleware);

//importing mongodb module
const mclient=require('mongodb').MongoClient
//Connecting to mongodb
mclient.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0')
.then((dbRef)=>{
    const dbObj=dbRef.db("test")//initializing server to use test-database
    const userCollectionObj=dbObj.collection("userCollection")//initializing server to use userCollection-collection 
    app.set("userCollectionObj",userCollectionObj)
    console.log("Connection to Test DB - Success")
})
.catch((err)=>console.log("Connection to Test DB - Failed"))