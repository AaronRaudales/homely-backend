import express from "express";
import morgan from "morgan";
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Routes
import signupRoutes from "./routes/signup.routes";
import signInRoutes from "./routes/signIn.routes";
const forgotPasswordRoutes = require("./routes/forgotPassword.routes")
import profileRoutes  from "./routes/profile.routes";
import propertyRoutes from "./routes/property.routes";
import filterRoutes from "./routes/filter.routes";
import reservationRoutes from "./routes/reservation.routes";
const app = express();

//cors
var cors = require('cors');

// Settings
app.set("port", process.env.PORT || 8080);

app.use(cors());
// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/upload', express.static('upload/images/profilePicture'));
app.use('/upload', express.static('upload/images/property'));

// Routes
app.use("/signup", signupRoutes);
app.use("/login", signInRoutes);
app.use("/forgot-password",forgotPasswordRoutes);
app.use("/profile", profileRoutes);
app.use("/api/propiedades", propertyRoutes);
app.use("/api/propiedades/filtros", filterRoutes);
app.use("/reservation", reservationRoutes);

export default app;
