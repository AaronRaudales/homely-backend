import { getConnection } from "./../database/database";
//import helpers from "./../routes/helpers";
const helpers = require('../lib/helpers');

// FUNCIÓN PARA VERIFICAR LOS USUARIOS CREADOS
const signIn = async (req, res) => {
    try {
      
        const pool = await getConnection();
        const {nombreUsuario, password} = req.body;

        if(!(nombreUsuario && password)) {
            return  res.status(400).json({ status: 400, message: "El usuario y la contraseña son requeridos"});
        }
        
        const rows = await pool.query('SELECT * FROM usuarios WHERE nombreUsuario = ? OR correoElectronico = ?', [nombreUsuario, nombreUsuario]);

        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.password)
            
            if (validPassword) {
                res.status(200).json({status: 200, message: "Usted acaba de Iniciar Sesion", data:rows})
              } else {
                res.status(400).json({status: 400, message: "Contraseña Incorrecta"})
              }
        } else {
            res.status(400).json({status: 400, message: "Este usuario no existe"})
        }
        
    } catch (error) {
        res.status(500);
        res.send({status: 500, message: error.message});
    }

}

export const methods = {
signIn
};
    