const exp=require("express")
const userApp=exp.Router()

const expressAsyncHandler=require("express-async-handler")

userApp.get('/get-users',expressAsyncHandler(async(req,res)=>{
    //get userCollectionObj
    const userCollectionObj=req.app.get("userCollectionObj");
    
    //get all users from db
    await userCollectionObj.find().toArray()
    .then((userList)=>{
        res.status(200).send({message:"Userlist",payload:userList});
    })
    .catch((err)=>console.log(err))
}))
userApp.get('/get-users-1',expressAsyncHandler(async(req,res)=>{
    //get userCollectionObj
    const userCollectionObj=req.app.get("userCollectionObj");
    
    //get Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes” from db.
    await userCollectionObj.find({
      income:{$lt:"$5.00"},//filters Users who have income lower than 5 USD
      car:{$in:["BMW","Mercedes-Benz"]}//filters Users who have Either BMW or Mercedes-Benz
    }).toArray()
    .then((userList)=>{
        //sending userList from callback as Response payload
        res.status(200).send({message:"Userlist",payload:userList});
    })
    .catch((err)=>console.log(err))
}))
userApp.get('/get-users-2',expressAsyncHandler(async(req,res)=>{
    //get userCollectionObj
    const userCollectionObj=req.app.get("userCollectionObj");
    
    //get Male Users which have phone price greater than 10,000 from db
    await userCollectionObj.find({
      gender:"Male",//filters Male Users
      $expr: { $gte: [{ $strLenCP: "$phone_price" }, 5] }//filters Users who have phone_price greater than 10000(as phone_price is a string its length must be minimum of 5 such that phone_price>10000)
    }).toArray()
    .then((userList)=>{
      //sending userList from callback as Response payload
        res.status(200).send({message:"Userlist",payload:userList});
    })
    .catch((err)=>console.log(err))
}))
userApp.get('/get-users-3',expressAsyncHandler(async(req,res)=>{
    //get userCollectionObj
    const userCollectionObj=req.app.get("userCollectionObj");
    //get Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name from db
    await userCollectionObj.find(
      {last_name:{ $regex: /^M/ }},//filters users whose last name starts with M
      {$expr:{$gt:[{$strLenCP:"$quote"},15]}},//filters users whose quote length greater tham 15
      {email:{ $regex: /^.*<last_name>.*@.*$/i }//filters users whose email includes last name 
    }).toArray()
    .then((userList)=>{
      //sending userList from callback as Response payload
        res.status(200).send({message:"Userlist",payload:userList});
    })
    .catch((err)=>console.log(err))
}))
userApp.get('/get-users-4',expressAsyncHandler(async(req,res)=>{
    //get userCollectionObj
    const userCollectionObj=req.app.get("userCollectionObj");
    
    //get Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
    await userCollectionObj.find(
      {car: { $in: ["BMW", "Mercedes-Benz", "Audi"] },//filters users who have BMW or Mercedes Or Audi car
      email: { $not: /\d/ }//filters users whose email doesnot contain any digits
    }).toArray()
    .then((userList)=>{
      //sending userList from callback as Response payload
        res.status(200).send({message:"Userlist",payload:userList});
    })
    .catch((err)=>console.log(err))
}))
userApp.get('/get-users-5',expressAsyncHandler(async(req,res)=>{
    //get userCollectionObj
    const userCollectionObj=req.app.get("userCollectionObj");
    
    //Show the data of top 10 cities which have the highest number of users and their average income.
    await userCollectionObj.aggregate([
        {
          $addFields: {
            incomeNum: { $toDouble: { $substr: ["$income", 1, -1] } }//adds a field incomeNum - numerical Income value for each user
          }
        },
        {
          $group: {
            _id: "$city",//group by city
            count: { $sum: 1 },//count is count of users within that city
            avgIncome: { $avg: "$incomeNum" }//finds average of incomeNum for all users 
          }
        },
        {
            $group:{
                _id:null,//group by null
                maxUserCount:{$max:"$count"},//creates a max count variable
                cities: { $push: { city: "$_id", count: "$count", avgIncome: "$avgIncome" } }
            }
        },
        {
          $project: {
            _id: 0,
            cities: {
              $filter: {
                input: "$cities",
                as: "city",
                cond: { $eq: ["$$city.count", "$maxUserCount"] }//filters cities which consist of max number of users
              }
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ]).toArray()
      .then(async(cities)=>{
        const t=cities[0];
        const cityNames = await t.cities.map(cityObj=> cityObj.city);//maps all cities into cityNames array
        // fetch users from the extracted city names
        await userCollectionObj.find({ city: { $in: cityNames } })//filters users who are from cities of cityNames array
        .toArray()
        .then((users) => {
          //sending cities and users as corresponding payloads
          res.status(200).send({ message: "users", userPayload: users , cityPayload:cities[0].cities});
        })
        .catch((err) => console.log(err));
        })
    .catch((err)=>console.log(err))
}))
module.exports=userApp;