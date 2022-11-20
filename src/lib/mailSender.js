const { text } = require('body-parser');
const nodemailer = require('nodemailer');



const mailSender = {};

mailSender.sendMail = async(data,flag) =>{

    const config ={

        host: "smtp.gmail.com",
        port : 587,
        auth:{
            user: "homelyApp2022@gmail.com",
            pass: "nlqoqdbhnvubndqu",
        }
    }
    //para correos olvidados
    if(flag == 1){
        const message ={
            from: "homelyApp2022@gmail.com",
            to : data.correoElectronico,
            subject: "Recuperacion de contrasena para " + data.nombreUsuario,
            text: "Hola le enviamos el siguiente enlace para la recuperacion de su contrasena en la aplicacion de homely: " + data.link
        }
    
        const trasnport = nodemailer.createTransport(config);
    
        const info = await trasnport.sendMail(message);

    }
    //para el usuario que alquila la propiedad.
    if(flag == 2){
        const message ={
            from: "homelyApp2022@gmail.com",
            to : data.correoElectronico,
            subject: "Estado de la reserva de: " + data.propiedad,
            text: "Hola, te enviamos este correo para notificarte que la reservacion de " + data.propiedad +" se ha realizado de forma correcta, podras chequear toda la informacion de la reserva en la aplicacion. Informacion de contacto del anfitrion: \nNumero de telefono: " + data.numeroAnfitrion + "\nCorreo electronico: " + data.correoAnfitrion
        }
    
        const trasnport = nodemailer.createTransport(config);
    
        const info = await trasnport.sendMail(message);

    }
    //para los anfitriones 
    
    if(flag == 3){
        const message ={
            from: "homelyApp2022@gmail.com",
            to : data.correoElectronico,
            subject: data.propiedad + " ha sido reservada por " + data.nombreCliente,
            text: "Hola, te enviamos este correo para notificarte que " + data.propiedad + " ha sido alquilada por " + data.nombreCliente + ". Por favor ponte en contacto con el cliente para que puedan hablar los detalles del trato, te recordamos que esta reservacion tiene una validez de " + data.dias +" dias"+" que inician en "+ data.fechaInicio + " y terminan en " +data.fechaFin + ". Informacion de contacto del cliente: " + "\nNumero de telefono:" + data.telefonoCliente + "\nCorreo electronico: " + data.correoCliente
        }
    
        const trasnport = nodemailer.createTransport(config);
    
        const info = await trasnport.sendMail(message);

    }
    //error
    if(flag == 4){
        const message ={
            from: "homelyApp2022@gmail.com",
            to : data.correoElectronico,
            subject: "Problemas con la reservacion de: " + data.propiedad,
            text: "Hola, te enviamos este correo para notificarte que ha ocurrido un problema con la reservacion de " + data.propiedad + ". Nos disculpamos por los inconvenientes causados y te aseguramos que estamos trabajando para arreglar el problema."
        }
    
        const trasnport = nodemailer.createTransport(config);
    
        const info = await trasnport.sendMail(message);

    }


}

module.exports = mailSender;