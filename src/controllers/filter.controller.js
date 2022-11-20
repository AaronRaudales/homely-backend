import { getConnection } from "./../database/database";

const getPropertyFilter= async (req, res) => {
    try {
        var status = 200;
        var message = "Propiedades filtradas encontradas";
        var result;
        var resultado;
        const {idUsuario} = req.body
        const {direccion, tipoEspacio, tipoPropiedad, inicioFecha, finFecha, precioMinimo, precioMaximo} = req.body;

        const connection = await getConnection();
        result = `SELECT usuario.*, propiedad.idUsuario,propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado,propiedad.reservacion,tipopropiedad.idTipoPropiedad, tipopropiedad.cantidadHuespedes,tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche, propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,propiedad.image_3,case when propiedadfavorita.idPropiedad IS NULL then 0 when propiedadfavorita.idUsuario != ? then 0 ELSE 1 END AS favorito FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idTipoPropiedad INNER JOIN usuarios usuario ON propiedad.idUsuario= usuario.idUsuario LEFT JOIN propiedadFavorita ON propiedadfavorita.idPropiedad =  propiedad.idPropiedad AND propiedadfavorita.idUsuario = ? WHERE propiedad.estado = 1 AND propiedad.reservacion = 1 AND NOT usuario.idUsuario = ? `;
        
        if(tipoEspacio === "" && tipoPropiedad === "" && inicioFecha === "" && finFecha === "" && precioMinimo === "" && precioMaximo === ""){
            resultado = await connection.query(result,[idUsuario,idUsuario,idUsuario]);

        } else {

             if(direccion !== "" && direccion !== null){
                 result = result.concat(" ", `AND propiedad.direccion LIKE '%${direccion}%'`);
             }
             
              if(inicioFecha !== "" && inicioFecha !== null){
                  result = result.concat(" ", `AND propiedad.inicioFechaDisponible >= "${inicioFecha}" `);
              }

              if(finFecha !== "" && finFecha !== null){
                result = result.concat(" ", `AND propiedad.finFechaDisponible <= "${finFecha}"`);
              }

             if(tipoPropiedad !== "" && tipoPropiedad !== null){
                 result = result.concat(" ", `AND tipopropiedad.tipoPropiedad = "${tipoPropiedad}"`);
             }

             if(tipoEspacio !== "" && tipoEspacio !== null){
                result = result.concat(" ", `AND tipopropiedad.tipoEspacio = "${tipoEspacio}"`);
             }

             if(precioMinimo !== "" && precioMinimo !== null){
                result = result.concat(" ", `AND propiedad.precioPorNoche >= ${precioMinimo} `);
             }

             if(precioMaximo !== "" && precioMaximo!= null){
                result = result.concat(" ", `AND propiedad.precioPorNoche <= ${precioMaximo}`);
             }
            console.log(result);
            resultado = await connection.query(result,[idUsuario,idUsuario,idUsuario]);

       } 
       if(resultado.length ==0){
        message = "No se encontraron coincidencias";
       }
        res.status(status).json({status: status, message: message, resultado});
    } catch (error) {
       status = 500;
       res.status(status).json({status: status, message: error.message});
    }
};

export const methods = {
    getPropertyFilter
};