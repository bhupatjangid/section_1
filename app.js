const express=require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const bodyParser = require("body-parser") 
const { body, validationResult } = require('express-validator');


const app = express()
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://test:AeO0lK5mUGeb6BJp@cluster0.xz9wu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})

const itemSchema = mongoose.Schema({
    email:String,
    password:String
    
})

const Item = mongoose.model("Item",itemSchema)


app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login",{error:{}})
})
app.get("/register",function(req,res){
    res.render("register",{error:{}})
})

app.get("/success",function(req,res){
    res.render("success")
})



app.post('/register',
    [
        body('username','username must be email').isEmail(),
        body('password','length must be more than 7').isLength({ min: 8 })
    ],
    function(req,res){
        const errors = validationResult(req)
        if (errors.errors.length){
            res.render('register',{error:errors.mapped()})
        }
        else{
            const email=req.body.username;
            const password=req.body.password;
    
            Item.findOne({email:email},function(err,result){

                if(err){
                    console.log(err);
                }else{
                    if(result){
                        if(result.password === password){
                            res.redirect('success')
                        }
                        else{
                            res.render('register',{error:{password:{msg:"email id already exist"}}})
                        }
                    }
                    else{
                        const item1 = new Item({
                            email:req.body.username,
                            password:req.body.password
                        })
                    
                    item1.save()
                    res.redirect('success')
                    }
            
                }
            })
        }
        

    
})


app.post('/login',
    [
        body('username','username must be email').isEmail(),
        body('password','length must be more than 7').isLength({ min: 8 })
    ],
    function(req,res){

        const errors = validationResult(req)
        if (errors.errors.length){
            res.render('login',{error:errors.mapped()})
        }
        else{
        const email=req.body.username;
        const password=req.body.password;
    
        Item.findOne({email:email},function(err,result){
            console.log(result);
            if(err){
                console.log(err);
            }else{
                if(result.password === password){
                    res.redirect("success")
                }
                else{
                    res.render('login',{error:{password:{msg:'enter valid email id and password'}}})
                }
            }
        })
    }
    
})


app.listen(process.env.PORT || 4500)