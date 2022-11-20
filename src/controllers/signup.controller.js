import { getConnection } from "./../database/database";
//import helpers from "./../routes/helpers";
const helpers = require('../lib/helpers');

//SIGNUP AGREGAR NUEVO USUARIO
const addUser = async (req, res) => {
    try{
        const pool = await getConnection();

        const{primerNombre,primerApellido,nombreUsuario,FechaNacimiento,correoElectronico,telefono,sexo,password,esCliente,esAnfitrion,rolPreferido}= req.body;
        var status=200;
        var message="Usuario agregado con éxito";
        // esCliente = 1 siginifica que es se registra como cliente y por lo tanto esAnfitrion =0 por lo que rolPreferido =0.esCliente = 0 y esAnfitrion =1 significa que se registra como anfitrion por lo que rolPreferido =1.
        if (primerNombre === undefined || primerApellido === undefined || nombreUsuario === undefined || FechaNacimiento === undefined
            || correoElectronico === undefined || telefono === undefined || sexo === undefined || password === undefined || esCliente == undefined || esAnfitrion == undefined || rolPreferido == undefined) {
           status=400;
           message="¡Advertencia! Por favor llenar todos los campos.";
        }
        const rows = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ? or nombreUsuario=?', [correoElectronico,nombreUsuario]);

        if (rows.length > 0) {
            status=400;
            message="¡Advertencia! El usuario y/o correo ya existen en el sistema.";
        
            
        }
        const actualDate = new Date();
        const userDate = new Date (FechaNacimiento);
        const userAge = actualDate.getFullYear() - userDate.getFullYear();

        if(esAnfitrion == 1 && userAge < 18){
            status=400;
            message="¡Advertencia! Es necesario ser mayor de edad para registrarse como un anfitrión";           

        }
        else{
            const connection = await getConnection();
            var passwordEncrypt = await helpers.encryptPassword(password);

            await connection.query('INSERT INTO usuarios SET primerNombre = ?,primerApellido = ?, nombreUsuario = ?, FechaNacimiento = ?,correoElectronico = ?,telefono = ?, sexo = ?, password = ?, imagenPerfil = ? , esCliente = ? , esAnfitrion = ?, rolPreferido =?', 
            [primerNombre, primerApellido,nombreUsuario,FechaNacimiento,correoElectronico,telefono,sexo,passwordEncrypt,null,esCliente,esAnfitrion,rolPreferido]);
            //se consigue el Id de la tabla recien insertada 
            const lastId = await connection.query("SELECT LAST_INSERT_ID()");
            console.log(lastId);

            //se manejan convierten los datos a un formato más facil de manipular
            const data = JSON.parse(JSON.stringify(lastId).split('"LAST_INSERT_ID()"').join('"id"'));
           //de esta forma se puede acceder a la propiedad ID del JSON recien creado
            //console.log(data[0].id)
            //console.log(data)
            //const newClient = await connection.query("INSERT INTO cliente (Id_Usuario) VALUES (?) ", [data[0].id])
        }
        
       var resultado={
        status: status,
        message: message
        }
        res.status(status).json(resultado);
    
    }catch(error){
        var resultado={
            status:500,
            message: error.message
        }
        res.status(500);
        res.send(resultado);
    }
};


// FUNCIÓN PARA VERIFICAR USUARIOS AGREGADOS CORRECTAMENTE... SE BORRARÁ
const getUser= async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT idUsuario, primerNombre, primerApellido, nombreUsuario, sexo, imagenPerfil,esCliente,esAnfitrion,rolPreferido FROM usuarios");
        res.json(result);

    } catch (error) {
    
       res.status(500);
       res.send(error.message);
    }
};


// DEJO LAS FUNCIONES DEL VIDEO ORIGINAL POR AHORA POR SI LES SIRVEN PARA SUS PARTES 
////////////////////////////////////////////////////////////////////////////////////////////
const getLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id, name, programmers FROM language WHERE id = ?", id);
        
        res.json(result);

        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, programmers } = req.body;

        if (id === undefined || name === undefined || programmers === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const language = { name, programmers };
        const connection = await getConnection();
        const result = await connection.query("UPDATE language SET ? WHERE id = ?", [language, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM language WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {

addUser,
getUser,
getLanguage,
updateLanguage,
deleteLanguage
};
