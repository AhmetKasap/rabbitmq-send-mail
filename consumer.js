const amqp = require('amqplib')
const nodemailer = require("nodemailer");

require('dotenv').config()

const rabbitmq = async () => {
    console.log('email bilgisi bekleniyor...')
    const connection = await amqp.connect('amqp://localhost:5672')  
    const chanel = await connection.createChannel()     
    await chanel.assertQueue('emailQueue')  

    chanel.consume('emailQueue', (response) => {      
        const rabbitEmail = response.content.toString()         
        console.log('Kuyruktan Alınan Email Bilgisi', rabbitEmail) 
        chanel.ack(response) 


        const transporter =  nodemailer.createTransport({
            service:'gmail',
            auth : {
                user : 'aahmetkasap@gmail.com',
                pass : process.env.MAIL_PASSWORD_KEY
            }
        })
    
        const mailOptions =  {
            from : "aahmetkasap@gmail.com",
            to : rabbitEmail,
            subject : 'Hesab Onayı',
            text : 'Hesabını onaylandı'
        }
       
        transporter.sendMail(mailOptions)


    })






}
   
rabbitmq()