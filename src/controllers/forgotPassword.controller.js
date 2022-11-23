const jwt = require('jsonwebtoken');

import { getConnection } from "./../database/database";
const helpers = require('../lib/helpers');
const mailSender = require('../lib/mailSender')

const { json } = require('body-parser');
//esta clave puede guardarse en otro lado para hacerlo mas seguro
const JWT_SECRET = 'clave'

//post
const forgotPassword = async (req, res) => {
    
    
    try{
        const pool = await getConnection();
        const{correoElectronico} = req.body;
        const rows = await pool.query('SELECT correoElectronico,nombreUsuario,idUsuario,password FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
        const data = JSON.parse(JSON.stringify(rows))
        //validando que el objeto exista
        if(data.length == 0){
            res.status(400).json({status: 400, message: "El usuario no se encontró, por favor revisar los datos"})
            return;
        }
        
        //creando un link que sea valido por 15 min
        const secret = JWT_SECRET + data[0].password
        const payload = {
            "email": data[0].correoElectronico,
            "id": data[0].idUsuario
        }
    
        const token = jwt.sign(payload,secret,{expiresIn: '15m'})
        var result ={
            id : data[0].idUsuario,
            token : token,
            status : 200,
            message : "Autenticación correcta, el link de restauración será enviado a su correo. Por favor, revisarlo."
        }
        const link = `homely-ing-software.netlify.app/auth/change-password-v2/${data[0].idUsuario}/${token}`;
        const emailData = {
            correoElectronico : data[0].correoElectronico,
            nombreUsuario : data[0].nombreUsuario,
            link : link
        }
        //const mailSended = await mailSender.sendMail(data[0].correoElectronico,data[0].nombreUsuario,link)
        const mailSended = await mailSender.sendMail(emailData,1)
        res.json(result)
        return;

        
    }
    catch(error){
        var resultado={
            status:500,
            message: error.message
        }
        res.status(500);
        res.send(resultado);
        return;
    }
    
};
//put, ocupar /:id/:token

const restorePassword = async (req, res) => {
    
    const {id,token} = req.params
    const pool = await getConnection();

    const rows = await pool.query('SELECT correoElectronico,nombreUsuario,password FROM usuarios WHERE idUsuario = ?', [id]);
    
    if(rows.length == 0){
        res.status(400).json({message: "ID incorrecto, por favor revisar los datos"})
        return;
    }
    const data = JSON.parse(JSON.stringify(rows))
    //el pass aun no cambia
    const secret = JWT_SECRET + data[0].password

    try {
        const payload = jwt.verify(token, secret)
        //se llama al otro metodo, aca se toman los datos de los formularios.
        const{contrasena,confirmarContrasena} =req.body
        
        const data = JSON.parse(JSON.stringify(rows))
    
        try {
            console.log("try")
            
            const payload = jwt.verify(token, secret)
            //validando los password
            const equalPassword = await helpers.matchPassword(contrasena, data[0].password)
    
            if(equalPassword){
                console.log("iguales")
                res.status(400).json({status:400 ,message: "La nueva contraseña no puede ser la misma que la anterior"})
                return;
    
            }
    
            if (confirmarContrasena != contrasena){
                console.log("el final")
                res.status(400).json({status:400,message: "Las contraseñas no concuerdan, por favor ingreselas de nuevo"})
            }
              
            if(confirmarContrasena == contrasena && equalPassword ==false){
                console.log("validas")
                data[0].password = await helpers.encryptPassword(contrasena);
                const queryResult = await pool.query('UPDATE usuarios SET password = ? WHERE correoElectronico = ? ', [data[0].password,data[0].correoElectronico]);
                console.log(queryResult)
                var resutl = {
                    data : queryResult,
                    status : 200,
                    message : "Actualización realizada"
                }
                res.json(resutl);
                return;
            }
    
    
        } catch (error) {
            var resultado={
                status:500,
                message: error.message
            }
            res.status(500);
            res.send(resultado);
            return;
        }


    } catch (error) {
        var resultado={
            status:500,
            message: error.message
        }
        res.status(500);
        res.send(resultado);
        return;
    }

};


module.exports = {
    restorePassword,
    forgotPassword
};


    

  

