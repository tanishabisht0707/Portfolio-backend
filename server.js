const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/',(res,res) => {
    console.log('mail server running with cors!');
})

app.post('/contact' , async (req,res) => {
    const {name,email,message} = req.body;

    if(!name,email,message) {
        return res.status(400).json('All fields are required!');
    }

    try{
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        })
        const mail = {
            from : email,
            to : process.env.EMAIL_USER,
            subject : `Message from portfolio : ${name}`,
            message : `name : ${name} message : ${message}`
        }

        await transporter.sendMail(mail);
        res.status(200).json('Email send successfully !');
    }catch(err){
        console.log(err);
        res.status(500).json({message : 'fail to send message ' , err})
    }

    app.listen(5000,() => {
        console.log('server running on port 5000');
    })
})

