import express from "express";
import {
  createSubjectsController,
  getSubjectsByIdController,
  updateSubjectsController,
  getAllSubjectsController,
  deleteSubjectsController,
  searchSubjectsController
} from "../Controllers/Subjects.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createSubjectsController);
router.get("/get/:id", getSubjectsByIdController);
router.put("/update/:id", updateSubjectsController);
router.get("/all", getAllSubjectsController);
router.delete("/delete/:id", deleteSubjectsController);
router.get("/search", searchSubjectsController);


export default router;