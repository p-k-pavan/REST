const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const dotenv = require("dotenv").config()

const app=express();

app.use(cors());
app.use(express.json({limit:"10mb"}))
const PORT = process.env.PORT || 8080

// mongodb connectrion
mongoose.connect(process.env.MONGODB_URL)
.then( () => {
    console.log("connected to database")
})
.catch( (err) =>{
    console.log(err)
})


// schema

const userSchema = mongoose.Schema({
    FirstName:String ,
    LastName: String,
    Email:{
        type:String,
        unique:true
    },
    Password: String,
    ConfirmPassword: String,
    Contry: String,
    image:String
})

//models

const userModel = mongoose.model('user',userSchema)

app.get("/",(req,res)=>{
    res.send("sucessfull")
})

app.post("/SignUp", async (req, res) => {
    console.log(req.body);
    const { Email } = req.body; // Fix typo here
    try {
      const result = await userModel.findOne({ Email: Email });
      if (result) {
        res.send({ Message: "Email already registered", alert:false });
      } else {
        const user1 = new userModel(req.body); // Fix here
        const save = await user1.save();
        res.send({ Message: 'Successful registration' , alert:true});
        console.log("saved")
        console.log(save)
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ Message: 'Internal Server Error' });
    }
  });

  app.post("/Login" , async(req,res) =>{
    const { Email,Password } = req.body; // Fix typo here
    try {
      const result = await userModel.findOne({ Email: Email });
      if (result) {
        console.log(result)
          const isPasswordValid = result.Password === Password;
    
          if (isPasswordValid) {
            
            const userData={
              _id:result._id,
              FirstName:result.FirstName,
              LastName:result.LastName,
              Email:result.Email,
              image:result.image,
              Contry:result.Contry
            };
            //console.log(userData);
            res.send({ Message: 'Successful Login', alert: true , data:userData});
            console.log(result);
          } else {
            res.send({ Message: 'Incorrect Password', alert: false });
          }
      } else {
        res.send({ Message: "Email not registered", alert:false });
        
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ Message: 'Internal Server Error' });
    }
  });
  

app.listen( PORT, () =>{
    console.log("Working")
})


//Produt setion
const productSchema = mongoose.Schema({
   Name:String,
   Categroy:String,
   image:String,
   Price:Number,
   Description:String
});

const productModel = mongoose.model("product" , productSchema);

app.post("/NewProduct" , async(req,res) =>{
  const product1 =await new productModel(req.body); // Fix here
  const save = await product1.save();
  setTimeout( () =>{
    res.send({ Message: 'Successful Add product' , alert:true});
  })
  
  
})

app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})

