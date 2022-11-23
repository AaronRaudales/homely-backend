import { getConnection } from "./../database/database";


const addProperty = async (req, res) => {
    const pool = await getConnection();
    await pool.query('start transaction')
    try {
        var typeProperty = {
            tipoPropiedad : req.body.tipoPropiedad,
            tipoEspacio : req.body.tipoEspacio,
            cantidadHuespedes : req.body.cantidadHuespedes,
            numHabitaciones : req.body.numHabitaciones,
            cantidadBanios : req.body.cantidadBanios,
            estacionamiento : req.body.estacionamiento,
            internet : req.body.internet,
            aireAcondicionado : req.body.aireAcondicionado
        }
        var property = {
            idUsuario : req.body.idUsuario,
            titulo: req.body.titulo,
            descripcion : req.body.descripcion,
            direccion : req.body.direccion,
            precioPorNoche : req.body.precioPorNoche,
            estado : req.body.estado,
            reservacion : req.body.reservacion,
            inicioFechaDisponible : req.body.inicioFechaDisponible,
            finFechaDisponible : req.body.finFechaDisponible,
            image_1 : req.body.image_1,
            image_2 : req.body.image_2,
            image_3 : req.body.image_3
        }


        var status=200;
        var message="Propiedad agregada con éxito";

        if (typeProperty.tipoPropiedad === undefined || typeProperty.tipoEspacio === undefined || typeProperty.cantidadHuespedes === undefined 
            || typeProperty.numHabitaciones === undefined || typeProperty.cantidadBanios === undefined || typeProperty.estacionamiento === undefined 
            || typeProperty.internet=== undefined || typeProperty.aireAcondicionado === undefined || property.titulo === undefined || property.descripcion  ===  undefined 
            || property.direccion  ===  undefined  || property.precioPorNoche  ===  undefined    ||  property.estado  ===  undefined || property.reservacion == undefined || property.inicioFechaDisponible === undefined 
            || property.finFechaDisponible === undefined) {
             return res.status(400).json({
                 "message": "¡Advertencia! Por favor llenar todos los campos."
             });
         }
         console.log("paso1");
        //const pool = await getConnection();
        //await pool.beginTransaction();
        await pool.query("INSERT INTO tipoPropiedad SET ?",typeProperty);
        //await pool.commit();
        console.log("paso2");
          const lastId = await pool.query("SELECT LAST_INSERT_ID()");
          const data =JSON.parse(JSON.stringify(lastId).split('"LAST_INSERT_ID()"').join('"id"'));
          const id_TipoPropiedad = data[0].id;

        // // Se agrega el elemento al objeto
         property.idTipoPropiedad = id_TipoPropiedad;
        await pool.query("INSERT INTO Propiedad SET ?", property);
        await pool.query('commit');
        
          

        var resultado={
            status: status,
            message: message
            }
            res.status(status).json(resultado);
            return;

    } catch (error) {
        const pool = await getConnection();
        await pool.query('rollback');
        res.status(500);
        res.send({status: 500, message: error.message});
        //await pool.rollback();
        return;
    }
}


/*******************************************************************************************************/
// get para traer todas las propiedades existentes

const getProperty= async (req, res) => {
    try {
        
        const connection = await getConnection();
        const resultProperty = await connection.query(
            "SELECT propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche,propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3 FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad;"
        );
       
        res.json({status:200,message: "Propiedades encontradas",data:resultProperty});


    } catch (error) {
    
       res.status(500);
       res.send({status: 500, message: error.message});
    }
};



/*******************************************************************************************************/

const updateProperty = async (req, res) => {
    const connection = await getConnection();
   await pool.beginTransaction();
    try {
   
        var typeProperty = {
            idTipoPropiedad: req.body.idTipoPropiedad,
            tipoPropiedad : req.body.tipoPropiedad,
            tipoEspacio : req.body.tipoEspacio,
            cantidadHuespedes : req.body.cantidadHuespedes,
            numHabitaciones : req.body.numHabitaciones,
            cantidadBanios : req.body.cantidadBanios,
            estacionamiento : req.body.estacionamiento,
            internet : req.body.internet,
            aireAcondicionado : req.body.aireAcondicionado
        }
       
        var property = {
            idUsuario : req.body.idUsuario,
            idPropiedad: req.body.idPropiedad,
            idTipoPropiedad: req.body.idTipoPropiedad,
            titulo: req.body.titulo,
            descripcion : req.body.descripcion,
            direccion : req.body.direccion,
            precioPorNoche : req.body.precioPorNoche,
            estado : req.body.estado,
            reservacion: req.body.reservacion,
            inicioFechaDisponible : req.body.inicioFechaDisponible,
            finFechaDisponible : req.body.finFechaDisponible,
            image_1 : req.body.image_1,
            image_2 : req.body.image_2,
            image_3 : req.body.image_3
        }

        
        //const connection = await getConnection();
        var status=200;
        var message="Propiedad actualizada con éxito";

        const rows = await connection.query('SELECT * FROM Propiedad WHERE idPropiedad = ?' , [property.idPropiedad]);
        if(rows.length === 0){
            status=400;
            message="¡Advertencia! El hospedaje no existe";
        }else{
            // // Se agrega el elemento al objeto
            
            await connection.query("UPDATE TipoPropiedad SET ? WHERE idTipoPropiedad = ?", [typeProperty, req.body.idTipoPropiedad]);
            await connection.query("UPDATE Propiedad SET ? WHERE idPropiedad = ?", [property, property.idPropiedad]);
            await pool.commit();
                
        }
     
            var resultado={
                status: status,
                message: message
            }
            res.status(status).json(resultado);
        
        
    } catch (error) {
        await pool.rollback();
        res.status(500);
        res.send({status: 500, message: error.message});
    }
};

// UPDATE DE UN USUARIO EN ESPECIFICO

const updateUserProperty = async (req, res) => {
    const connection = await getConnection();
    var idUsuario= req.body.idUsuario;
    await pool.query('start transaction')
    try {
   
        var typeProperty = {
            idTipoPropiedad: req.body.idTipoPropiedad,
            tipoPropiedad : req.body.tipoPropiedad,
            tipoEspacio : req.body.tipoEspacio,
            cantidadHuespedes : req.body.cantidadHuespedes,
            numHabitaciones : req.body.numHabitaciones,
            cantidadBanios : req.body.cantidadBanios,
            estacionamiento : req.body.estacionamiento,
            internet : req.body.internet,
            aireAcondicionado : req.body.aireAcondicionado
        }
       
        var property = {
            idPropiedad: req.body.idPropiedad,
            idTipoPropiedad: req.body.idTipoPropiedad,
            titulo: req.body.titulo,
            descripcion : req.body.descripcion,
            direccion : req.body.direccion,
            precioPorNoche : req.body.precioPorNoche,
            estado : req.body.estado,
            reservacion: req.body.reservacion,
            inicioFechaDisponible : req.body.inicioFechaDisponible,
            finFechaDisponible : req.body.finFechaDisponible,
            image_1 : req.body.image_1,
            image_2 : req.body.image_2,
            image_3 : req.body.image_3
        }
        console.log(property);
        
        //const connection = await getConnection();
        var status=200;
        var message="Propiedad actualizada con éxito";

        const result = await connection.query("SELECT idUsuario FROM propiedad WHERE idUsuario = ? ",[idUsuario]);
        if(result.length == 0){
            status = 400;
            message = "El usuario buscado no existe, por favor revise los datos"
            res.status(400).json({status: status, message: message});
            return;
        }

        const rows = await connection.query('SELECT * FROM Propiedad WHERE idUsuario =? AND idPropiedad = ?' , [idUsuario,property.idPropiedad]);
        if(rows.length === 0){
            status=400;
            message="¡Advertencia! El hospedaje no existe";
        }else{
            // // Se agrega el elemento al objeto
            
            await connection.query("UPDATE TipoPropiedad SET ? WHERE idTipoPropiedad = ?", [typeProperty, req.body.idTipoPropiedad]);
            await connection.query("UPDATE Propiedad SET ? WHERE IdUsuario = ? AND idPropiedad = ?", [property,idUsuario, property.idPropiedad]);
            await pool.query('commit')
                
        }
     
            var resultado={
                status: status,
                message: message
            }
            res.status(status).json(resultado);
        
        
    } catch (error) {
       await pool.query('rollback')
        res.status(500);
        res.send({status: 500, message: error.message});
    }
};

/*******************************************************************************************************/

const deleteProperty = async (req, res) => {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
        const { idPropiedad } = req.params;
        //const connection = await getConnection();
        var status=200;
        var message="Propiedad eliminado con éxito";

        const rows = await connection.query('SELECT idPropiedad FROM Propiedad WHERE idPropiedad = ?' , [idPropiedad]);
        if(rows.length == 0){
            status=400;
            message="¡Advertencia! La propiedad no existe";
        }
        else{
            const Id = await connection.query("SELECT idTipoPropiedad FROM Propiedad WHERE idPropiedad = ?",[idPropiedad]);
            const data =JSON.parse(JSON.stringify(Id).split('"idTipoPropiedad"').join('"id"'));
            const Id_Tipo_Propiedad = data[0].id;

            await connection.query("DELETE FROM Propiedad WHERE idPropiedad = ?",[idPropiedad]);
            await connection.query("DELETE FROM TipoPropiedad WHERE idTipoPropiedad = ?",[Id_Tipo_Propiedad]);
            await connection.commit();
        } 

        var resultado={
            status: status,
            message: message
            }
            res.status(status).json(resultado);

    } catch (error) {
        await connection.rollback()
        res.status(500);
        res.send({status: 500, message: error.message});
    }
};

/*******************************************************************************************************/
// GET PARA TRAER LAS PROPIEDADES DE UN USUARIO EN ESPECIFICO

const getUserProperties= async (req, res) => {
    try {
        var status = 200;
        var message = "Propiedades encontradas"
        const {idUsuario} = req.params;
        const connection = await getConnection();
        const resultProperty = await connection.query(
            "SELECT propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche,propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3 FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad WHERE propiedad.idUsuario = ?;",[idUsuario]
        );
        if(resultProperty.length == 0){
            status = 400;
            message = "No se encontraron propiedades para este usuario."
            res.status(400).json({status: status, message: message});
            return;
        }
        res.json({status:status,message: message,data:resultProperty});


    } catch (error) {
    
       res.status(500);
       res.send({status: 500, message: error.message});
    }
};

/*******************************************************************************************************/

//PARA FEED DE CLIENTE, SOLO PROPIEDADES DISPONIBLES PARA RESERVAR (ESTADO=1 Y RESERVACION =1)

const getAvailableProperties= async (req, res) => {
    try {
        var status = 200;
        var message = "propiedades encontradas"
        const connection = await getConnection();
        const resultProperty = await connection.query(
            "SELECT usuario.*,  propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche,propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3 FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad INNER JOIN usuarios usuario ON propiedad.idUsuario= usuario.idUsuario WHERE propiedad.estado = 1 AND propiedad.reservacion = 1;"
        );

        if(resultProperty.length == 0){
            status = 400;
            message = "No se encontraron propiedades disponibles para reservar."
            res.status(400).json({status: status, message: message});
            return;
        }
       
        res.json({status:200,message: "Propiedades disponibles encontradas",data:resultProperty});


    } catch (error) {
    
       res.status(500);
       res.send({status: 500, message: error.message});
    }
};

/*******************************************************************************************************/

//PARA FEED DE ANFITRION, SOLO PROPIEDADES CON "ESTADO" DISPONIBLE (=1)

const getUserActiveProperties= async (req, res) => {
    try {
        var status = 200;
        var message = "Propiedades activas encontradas"
        const {idUsuario} = req.params;
        const connection = await getConnection();
        const resultProperty = await connection.query(
            "SELECT usuario.*, propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche,propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3 FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad INNER JOIN usuarios usuario ON propiedad.idUsuario= usuario.idUsuario WHERE propiedad.estado = 1 AND propiedad.idUsuario = ?;",[idUsuario]
        );
        if(resultProperty.length == 0){
            status = 400;
            message = "No se encontraron propiedades activas para este usuario."
            res.status(400).json({status: status, message: message});
            return;
        }
        res.json({status:status,message: message,data:resultProperty});


    } catch (error) {
    
       res.status(500);
       res.send({status: 500, message: error.message});
    }
};
/*******************************************************************************************************/
const addFavoriteProperty = async (req, res) => {
    const connection = await getConnection();
    try {

        var property = {
            idUsuario : req.params.idUsuario,
            idPropiedad : req.body.idPropiedad
        }
        var status=200;
        var message="Propiedad marcada como favorita";
        
        const rows = await connection.query('SELECT idPropiedad FROM Propiedad WHERE idPropiedad = ?' , [property.idPropiedad]);
        if(rows.length == 0){
            status=400;
            message="¡Advertencia! La propiedad no existe";
        }
        
        else{
            const query = await connection.query("INSERT INTO propiedadFavorita SET ?",[property]);

        } 

        var resultado={
            status: status,
            message: message
            }
            res.status(status).json(resultado);
            return;

    } catch (error) {
        res.status(500);
        res.send({status: 500, message: error.message});
        return;
    }
}
/*******************************************************************************************************/
const deleteFavoriteProperty = async (req, res) => {
    const connection = await getConnection();
    try {

        var property = {
            idUsuario : req.params.idUsuario,
            idPropiedad : req.params.idPropiedad
        }
        var status=200;
        var message="Propiedad eliminada de favoritos";
        
        const rows = await connection.query('SELECT idPropiedad FROM Propiedad WHERE idPropiedad = ?' , [property.idPropiedad]);
        console.log(rows)
        if(rows.length == 0){
            status=400;
            message="¡Advertencia! La propiedad no existe";
        }
        
        else{
            console.log("adentro")
            const query = await connection.query("DELETE FROM propiedadFavorita WHERE idUsuario = ? AND idPropiedad =?",[property.idUsuario,property.idPropiedad]);
            console.log(query)

        } 

        var resultado={
            status: status,
            message: message
            }
            res.status(status).json(resultado);
            return;

    } catch (error) {
        res.status(500);
        res.send({status: 500, message: error.message});
        return;
    }
}
/*******************************************************************************************************/
//para el feed de clientes, en el apartado de "Favoritos" se encarga de retornar las propiedades que esten marcadas como favoritas
const getUserFavoriteProperties= async (req, res) => {
    try {
        var status = 200;
        var message = "Propiedades favoritas encontradas"
        const {idUsuario} = req.params;
        const connection = await getConnection();
        const resultProperty = await connection.query(
            "SELECT usuario.*, propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche,propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3, 1 as favorito FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad INNER JOIN usuarios usuario ON propiedad.idUsuario= usuario.idUsuario INNER JOIN propiedadFavorita ON propiedadFavorita.idPropiedad =  propiedad.idPropiedad WHERE propiedad.estado = 1 AND propiedad.reservacion = 1 AND  propiedadFavorita.idUsuario = ? AND NOT usuario.idUsuario = ?;",[idUsuario,idUsuario]
        );
        //const data = JSON.parse(JSON.stringify(resultProperty))
        //console.log(data[5])
        if(resultProperty.length == 0){
            status = 400;
            message = "No se encontraron propiedades marcadas como favoritas para este usuario."
            res.status(400).json({status: status, message: message});
            return;
        }
        res.json({status:status,message: message,data:resultProperty});
        //res.json({status:status,message: message,data:data});        


    } catch (error) {
    
       res.status(500);
       res.send({status: 500, message: error.message});
    }
};
/*******************************************************************************************************/
//para traer las propiedades disponibles para un usuario, muestra cuales de ellas son favoritas y cuales no. No trae las propiedades del usuario en cuestion.
const getAvailableClientProperties= async (req, res) => {
    try {
        var status = 200;
        var message = "Propiedades encontradas"
        const {idUsuario} = req.params;
        const connection = await getConnection();

        const feedProperty = await connection.query(
            
            "SELECT usuario.*, propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche, propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3,case when propiedadfavorita.idPropiedad IS NULL then 0 when propiedadfavorita.idUsuario != ? then 0 ELSE 1 END AS favorito FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad INNER JOIN usuarios usuario ON propiedad.idUsuario= usuario.idUsuario LEFT JOIN propiedadFavorita ON propiedadfavorita.idPropiedad =  propiedad.idPropiedad AND propiedadfavorita.idUsuario = ? WHERE propiedad.estado = 1 AND propiedad.reservacion = 1 AND NOT usuario.idUsuario = ?  ",[idUsuario,idUsuario,idUsuario]
        );
        if(feedProperty.length == 0){
            status = 400;
            message = "No se encontraron propiedades disponibles."
            res.status(400).json({status: status, message: message});
            return;
        }


        res.json({status:status,message: message,data:feedProperty});    


    } catch (error) {
    
       res.status(500);
       res.send({status: 500, message: error.message});
    }
};

//API PARA ACTUALIZAR EL ESTADO DE RESERVACION DE LA PROPIEDAD

const updatePropertyReservationState= async(req,res) =>{

    try {
        var status = 200;
        var message = "Actualizacion de estado-reservacion realizada con exito"
        var idPropiedad= req.body.idPropiedad;
        var reservacion  = req.body.reservacion;
        const connection = await getConnection();
        const result = await connection.query("SELECT idPropiedad FROM Propiedad WHERE idPropiedad = ? ",[idPropiedad]);

        if(result.length == 0){
            status = 400;
            message = "La propiedad buscada no existe, por favor revise los datos"
            res.status(400).json({status: status, message: message});
            return;
        }
        
        await connection.query('UPDATE Propiedad SET reservacion = ? WHERE idPropiedad = ? ', 
        [reservacion, idPropiedad]);

        var resultado={
            status: status,
            message: message
            }
            
        res.status(status).json(resultado);
        return;

    } catch (error) {
        status = 500;
        res.status(status).json({status: status, message: error.message});
        return;
        
    }

};




export const methods = {
addProperty,
getProperty,
getAvailableProperties,
updateProperty,
updateUserProperty,
deleteProperty,
getUserProperties,
getUserActiveProperties,
addFavoriteProperty,
deleteFavoriteProperty,
getUserFavoriteProperties,
getAvailableClientProperties,
updatePropertyReservationState
};
