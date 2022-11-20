import { Router } from "express";
import { methods as signupController } from "./../controllers/signup.controller";


const multer = require("multer");
const path = require("path");
const router = Router();

const storage = multer.diskStorage({
    destination: './upload/images/profilePicture',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage: storage
})



router.post("/",upload.single('imagenPerfil'),signupController.addUser);
router.get("/", signupController.getUser);



//router.get("/", signupController.getLanguages);
//router.get("/:id", languageController.getLanguage);
//router.post("/", languageController.addLanguage);
//router.put("/:id", languageController.updateLanguage);
//router.delete("/:id", languageController.deleteLanguage);

export default router;
