CREATE DATABASE homely;

USE homely;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE usuarios(
idUsuario INTEGER PRIMARY KEY auto_increment ,
primerNombre VARCHAR(200) NOT NULL,
primerApellido VARCHAR(200) NOT NULL,
nombreUsuario VARCHAR(200) NOT NULL,
fechaNacimiento DATE NOT NULL,
correoElectronico VARCHAR(200) UNIQUE NOT NULL,
telefono VARCHAR(8) UNIQUE NOT NULL,
sexo VARCHAR(10) NOT NULL,
password VARCHAR(200) NOT NULL,
imagenPerfil VARCHAR (300),
esCliente BOOLEAN NOT NULL,
esAnfitrion BOOLEAN NOT NULL,
rolPreferido INTEGER NOT NULL,
CONSTRAINT ck_primerNombre CHECK (primerNombre NOT LIKE '%[^A-Z]%'),
CONSTRAINT ck_primerApellido CHECK (primerApellido NOT LIKE '%[^A-Z]%'),
CONSTRAINT ck_correo CHECK(correoELectronico LIKE '_%@__%.__%'),    
CONSTRAINT ck_telefono CHECK (telefono NOT LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
CONSTRAINT ck_sexo CHECK(sexo = 'Masculino' OR sexo = 'Femenino' )
);


CREATE TABLE tipoPropiedad(
idTipoPropiedad INTEGER PRIMARY KEY auto_increment, 
tipoPropiedad VARCHAR (300) NOT NULL,
tipoEspacio VARCHAR (300) NOT NULL,
cantidadHuespedes INTEGER NOT NULL, 
numHabitaciones INTEGER NOT NULL, 
estacionamiento INTEGER NOT NULL, 
cantidadBanios INTEGER NOT NULL, 
internet BOOLEAN NOT NULL,
aireAcondicionado BOOLEAN NOT NULL,
CONSTRAINT ck_tipoEspacio CHECK (tipoEspacio NOT LIKE '%[^A-Z]%')
);


CREATE TABLE Propiedad(
idUsuario INTEGER NOT NULL,
idPropiedad INTEGER PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR (100) NOT NULL, 
descripcion VARCHAR (300) NOT NULL,
direccion VARCHAR (300) NOT NULL,
precioPorNoche INTEGER NOT NULL,
estado BOOLEAN NOT NULL,
reservacion BOOLEAN NOT NULL,
inicioFechaDisponible DATE NOT NULL,
finFechaDisponible DATE NOT NULL,
image_1 VARCHAR (300) NOT NULL,
image_2 VARCHAR (300) NOT NULL,
image_3 VARCHAR (300) NOT NULL,
idTipoPropiedad INTEGER NOT NULL,
CONSTRAINT ck_titulopropiedad CHECK (titulo NOT LIKE '%[^A-Z]%'),
FOREIGN KEY (idTipoPropiedad) REFERENCES tipoPropiedad(idTipoPropiedad),
FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE PropiedadFavorita(
idPropiedadFavorita INTEGER PRIMARY KEY AUTO_INCREMENT,
idUsuario INTEGER NOT NULL,
idPropiedad INTEGER NOT NULL,
FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
FOREIGN KEY (idPropiedad) REFERENCES Propiedad(idPropiedad)
);

CREATE TABLE Reservacion(
idReservacion INTEGER PRIMARY KEY AUTO_INCREMENT,
fechaIngreso DATE NOT NULL,
fechaSalida DATE NOT NULL,
cantidadPersonas INTEGER NOT NULL,
precioPorNoche INTEGER NOT NULL,
cantidadNoches INTEGER NOT NULL,
subTotal DECIMAL (13,2) NOT NULL,
total DECIMAL (13,2) NOT NULL,
fecha DATE NOT NULL,
idUsuario INTEGER NOT NULL,
idPropiedad INTEGER NOT NULL,
FOREIGN KEY (idUsuario) REFERENCES usuarios (idUsuario),
FOREIGN KEY (idPropiedad) REFERENCES Propiedad(idPropiedad)
);


SELECT propiedad.idPropiedad,tipopropiedad.tipoPropiedad, tipopropiedad.tipoEspacio,propiedad.titulo, propiedad.descripcion, propiedad.direccion,propiedad.estado, tipopropiedad.cantidadHuespedes,
tipopropiedad.numHabitaciones,tipopropiedad.cantidadBanios, tipopropiedad.estacionamiento, tipopropiedad.internet,tipopropiedad.aireAcondicionado, propiedad.idPropiedad, propiedad.precioPorNoche,propiedad.inicioFechaDisponible,propiedad.finFechaDisponible, propiedad.image_1, propiedad.image_2,
propiedad.image_3 
FROM tipopropiedad INNER JOIN propiedad ON tipopropiedad.idTipoPropiedad = propiedad.idPropiedad;

SELECT * FROM usuarios;