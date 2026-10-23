import express from "express";
import {
  createAcademicYearController,
  getAcademicYearByIdController,
  updateAcademicYearController,
  getAllAcademicYearController,
  deleteAcademicYearController,
  searchAcademicYearController
} from "../Controllers/Academic_Years.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createAcademicYearController);
router.get("/get/:id", getAcademicYearByIdController);
router.put("/update/:id", updateAcademicYearController);
router.get("/all", getAllAcademicYearController);
router.delete("/delete/:id", deleteAcademicYearController);
router.get("/search", searchAcademicYearController);


export default router;