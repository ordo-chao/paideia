import express from "express";
import {
  createClassSubjectsController,
  getClassSubjectsByIdController,
  updateClassSubjectsController,
  getAllClassSubjectsController,
  deleteClassSubjectsController,
  searchClassSubjectsController
} from "../Controllers/Class_Subjects.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createClassSubjectsController);
router.get("/get/:id", getClassSubjectsByIdController);
router.put("/update/:id", updateClassSubjectsController);
router.get("/all", getAllClassSubjectsController);
router.delete("/delete/:id", deleteClassSubjectsController);
router.get("/search", searchClassSubjectsController);


export default router;