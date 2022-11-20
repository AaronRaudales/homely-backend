
import { getConnection } from "./../database/database";
const mailSender = require('../lib/mailSender')

const addReservation = async (req, res) => {
    const pool = await getConnection();
    await pool.beginTransaction();
    try {
        var reservation = {
            idUsuario : req.body.idUsuario,
            idPropiedad : req.body.idPropiedad,
            fechaIngreso: req.body.fechaIngreso,
            fechaSalida: req.body.fechaSalida,
            cantidadPersonas : req.body.cantidadPersonas,
            precioPorNoche : 0,
            cantidadNoches: 0,
            subTotal: 0,
            total : 0,
            fecha : ""
            
        }

        var tarjeta={
            noTarjeta:req.body.noTarjeta,
            fechaVencimientoT:req.body.fechaVencimientoT,
            codigoCVV:req.body.codigoCVV
        }

        var status=200;
        var message;

        if (reservation.fechaIngreso === undefined || reservation.fechaSalida === undefined || reservation.cantidadPersonas === undefined
           || tarjeta.noTarjeta === undefined || tarjeta.fechaVencimientoT === undefined || tarjeta.codigoCVV === undefined) {
             return res.status(400).json({
                 "message": "¡Advertencia! Por favor llenar todos los campos."
             });
         }

        //OBTENIENDO ESTADO DE DISPONIBILIDAD DE LA PROPIEDAD
        const disponible = await pool.query('SELECT estado FROM Propiedad WHERE idPropiedad = ?' , [reservation.idPropiedad]);
        const data1 =JSON.parse(JSON.stringify(disponible).split('"estado"').join('"estadoD"'));
        const disponiblePropiedad = data1[0].estadoD; 
 
         //OBTENIENDO ESTADO DE RESERVACION DE LA PROPIEDAD
         const reservacion = await pool.query('SELECT reservacion FROM Propiedad WHERE idPropiedad = ?' , [reservation.idPropiedad]);
         const data =JSON.parse(JSON.stringify(reservacion).split('"reservacion"').join('"estadoR"'));
         const reservacionPropiedad = data[0].estadoR; 


         if (reservacionPropiedad === 0 || disponiblePropiedad ===0 ) {
            return res.status(400).json({
                "message": "¡Advertencia! Esta propiedad no esta disponible para reservar."
            });
        }

        // VALIDACIONES DE LA TARJETA DE CREDITO


        if(tarjeta.noTarjeta > 9999999999999999 || tarjeta.noTarjeta < 1000000000000000){
            return res.status(400).json({
                "message": "¡Advertencia! Numero de tarjeta invalido, revise sus datos."

            });
         }

        if(tarjeta.codigoCVV > 999 || tarjeta.codigoCVV < 100){
            return res.status(400).json({
                "message": "¡Advertencia! Codigo CVV invalido, revise sus datos."

            });
         }

        let fechaVence = new Date(tarjeta.fechaVencimientoT);

        let hoy = new Date();

        if(fechaVence<hoy){
            return res.status(400).json({
                "message": "¡Advertencia! La tarjeta de credito obsoleta."

            });
        }
       
        else{
        
         //OBTENER PRECIO POR NOCHE DE LA PROPIEDAD
    
         const precioNoche = await pool.query('SELECT precioPorNoche FROM Propiedad WHERE idPropiedad = ?' , [reservation.idPropiedad]);
          const data =JSON.parse(JSON.stringify(precioNoche).split('"precioPorNoche"').join('"precio"'));
          const precio = data[0].precio; 
          reservation.precioPorNoche = precio;


         //CALCULAR LA CANTIDAD DE NOCHES
         let fecha1 = new Date(reservation.fechaIngreso);
         let fecha2 = new Date(reservation.fechaSalida);

         let milisegundosdia = 24*60*60*1000;
         let milisegundostrancurridos = Math.abs(fecha1.getTime()-fecha2.getTime());
        
         reservation.cantidadNoches= Math.round(milisegundostrancurridos/milisegundosdia);
         

         //CALCULAR EL SUBTOTAL
         reservation.subTotal = ((reservation.cantidadNoches)*(reservation.precioPorNoche));

         //CALCULAR EL TOTAL
         reservation.total = (reservation.subTotal + (reservation.subTotal*0.15));

         //OBTENER LA FECHA EN QUE SE HIZO LA RESERVACION
         let hoy = new Date();
         let dia = hoy.getDate();
         let mes = hoy.getMonth() + 1;
         let anio = hoy.getFullYear();

         reservation.fecha = `${anio}-${mes}-${dia}`; 

        //INSERTAR DATOS DE RESERVACION
        await pool.query("INSERT INTO Reservacion SET ?",[reservation]);   

        //CAMBIAR ESTADO DE LA PROPIEDAD A RESERVADA
        await pool.query("UPDATE Propiedad SET reservacion=0 WHERE idPropiedad = ?", [reservation.idPropiedad]);
        await pool.commit();
       // var message="Reservacion agregada con exito!";

        let client = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?' , [reservation.idUsuario]);
        let host  = await pool.query('SELECT usuarios.* FROM propiedad INNER JOIN usuarios ON propiedad.idUsuario = usuarios.idUsuario WHERE idPropiedad = ?' , [reservation.idPropiedad]);
        let property = await pool.query('SELECT * FROM propiedad WHERE idPropiedad = ?' , [reservation.idPropiedad]);
        
        //var message="Reservacion agregada con exito!";
        const clientEmailData = {
            correoElectronico : client[0].correoElectronico,
            propiedad : property[0].titulo,
            numeroAnfitrion : host[0].telefono,
            correoAnfitrion : host[0].correoElectronico
        }
        const hostEmailData = {
            correoElectronico : host[0].correoElectronico,
            nombreCliente : client[0].nombreCliente,
            propiedad : property[0].titulo,
            nombreCliente : client[0].nombreUsuario,
            telefonoCliente : client[0].telefono,
            correoCliente : client[0].correoElectronico,
            dias : reservation.cantidadNoches,
            fechaInicio : reservation.fechaIngreso,
            fechaFin : reservation.fechaSalida,

        }
        const clientMail = await mailSender.sendMail(clientEmailData,2)
        const hostMail = await mailSender.sendMail(hostEmailData,3)
        var message="Reservacion agregada con exito!";
    
    }
        var resultado={
            status: status,
            message: message
            }
            res.status(status).json(resultado);
            return;

    } catch (error) {
        await pool.rollback();
        
        /*const errorEmailData = {
            correoElectronico : client[0].correoElectronico,
            propiedad : property[0].titulo,
        }
        const errorEmail = await mailSender.sendMail(errorEmailData,4)
        */
        res.status(500);
        res.send({status: 500, message: error.message});
        return;
    }
};

export const methods = {
    addReservation
    };
