import { getConnection } from "./../database/database";

const getUser= async (req, res) => {
    try {
        var status = 200;
        var message = "Usuario encontrado"
        const {id} = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM usuarios WHERE idUsuario = ? ",[id]);
        
        if(result.length == 0){
            status = 400;
            message = "El usuario buscado no existe, por favor revise los datos"
            res.status(400).json({status: status, message: message});
            return;
        }
       
            res.status(status).json({status: status, message: message, data:result[0]});
            return;

    } catch (error) {
       status = 500;
       res.status(status).json({status: status, message: error.message});
    }
};

const updateUser= async (req, res) => {
    try {
        var status = 200;
        var message = "Usuario encontrado"
        var idUsuario= req.body.idUsuario;
      
        //estos parametros podrian cambiar.
        var usuarioAct = {
            primerNombre : req.body.primerNombre,
            primerApellido : req.body.primerApellido,
            nombreUsuario : req.body.nombreUsuario,
            correoElectronico : req.body.correoElectronico,
            telefono : req.body.telefono,
            imagenPerfil : req.body.imagenPerfil,
            esCliente : req.body.esCliente,
            esAnfitrion : req.body.esAnfitrion,
            rolPreferido : req.body.rolPreferido
        }
        
        const connection = await getConnection();
        const result = await connection.query("SELECT idUsuario FROM usuarios WHERE idUsuario = ? ",[idUsuario]);
        const validUsername = await connection.query("SELECT * FROM usuarios WHERE NOT idUsuario =? AND (nombreUsuario =? OR correoElectronico = ?)"  ,[idUsuario,usuarioAct.nombreUsuario,usuarioAct.correoElectronico]);

        if(result.length == 0){
            status = 400;
            message = "El usuario buscado no existe, por favor revise los datos"
            res.status(400).json({status: status, message: message});
            return;
        }

        if(validUsername.length >0 ){
            status = 400;
            message = "El nombre de usuario y/o correo ya se encuentra en uso. Por favor ingresar uno nuevo"
            res.status(400).json({status: status, message: message});
            return;
        }
        
        const queryResult = await connection.query('UPDATE usuarios SET primerNombre = ?,primerApellido = ?, nombreUsuario = ?, correoElectronico = ?,telefono = ?, imagenPerfil = ?, esCliente = ?, esAnfitrion = ?, rolPreferido = ? WHERE idUsuario = ? ', 
        [usuarioAct.primerNombre, usuarioAct.primerApellido, usuarioAct.nombreUsuario, usuarioAct.correoElectronico, usuarioAct.telefono, usuarioAct.imagenPerfil,usuarioAct.esCliente,usuarioAct.esAnfitrion,usuarioAct.rolPreferido,idUsuario]);
        

        var resultado={
            data : queryResult,
            status : 200,
            message : "Update realizado. Se han guardado los cambios"
        }


        res.status(status).json(resultado);
        return;

    } catch (error) {
       status = 500;
       res.status(status).json({status: status, message: error.message});
       return;
    }
};
//para el perfil de usuario, se encarga unicamente de cambiar sus preferencias de rol.
const changeRole = async(req,res) =>{

    try {
        var status = 200;
        var message = "actualizacion realizada"
        var idUsuario= req.body.idUsuario;
        var esCliente  = req.body.esCliente;
        var esAnfitrion = req.body.esAnfitrion;
        var rolPreferido = req.body.rolPreferido;
        const connection = await getConnection();
        const result = await connection.query("SELECT idUsuario FROM usuarios WHERE idUsuario = ? ",[idUsuario]);

        if(result.length == 0){
            status = 400;
            message = "El usuario buscado no existe, por favor revise los datos"
            res.status(400).json({status: status, message: message});
            return;
        }
        
        const queryResult = await connection.query('UPDATE usuarios SET esCliente = ?, esAnfitrion = ?, rolPreferido = ? WHERE idUsuario = ? ', 
        [esCliente,esAnfitrion,rolPreferido,idUsuario]);

        var resultado={
            data : queryResult,
            status : 200,
            message : "Update realizado. Se han guardado los cambios"
        }


        res.status(status).json(resultado);
        return;

    } catch (error) {
        status = 500;
        res.status(status).json({status: status, message: error.message});
        return;
        
    }

};

const getHosts= async (req, res) => {
    try {
        var status = 200;
        var message = "Usuarios encontrados"
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM usuarios WHERE esAnfitrion = ? ",[1]);
        
        if(result.length == 0){
            status = 400;
            message = "Anfitriones no encontrados, por favor revise los datos"
            res.status(400).json({status: status, message: message});
            return;
        }
       
            res.status(status).json({status: status, message: message, data:result});
            return;

    } catch (error) {
       status = 500;
       res.status(status).json({status: status, message: error.message});
    }
};


export const methods = {
    getUser,
    updateUser,
    changeRole,
    getHosts
};
        
