const express = require('express')
const app = express()

const bodyParser = require('body-parser');     
app.use(bodyParser.urlencoded({extended:false}));  
app.use(bodyParser.json());

const amqp = require('amqplib')


require('dotenv').config()



app.post('/mail',  async (req,res) => {
    const userEmail = req.body.userEmail
    const userPassword = req.body.userPassword

    if(userEmail && userPassword) {
        res.redirect('/login')
    } else {
        return res.status(400).json('kayıt işlşemi sırasında hata meydana geldi')
    }


    //rabbitmq publisher 
    const connection = await amqp.connect('amqp://localhost:5672')  
    const chanel = await connection.createChannel()     
    await chanel.assertQueue('emailQueue')              
  
    chanel.sendToQueue('emailQueue', Buffer.from(JSON.stringify(userEmail))) 
    console.log('Kuyruğa Gönderilen Email Bilgisi :', userEmail)
    

})


app.get('/login', (req,res) => {
    res.send('giriş sayfasına hoş geldiniz.')
}) 

app.listen(5000, () => {
    console.log('sunucu başlatıldı')
})