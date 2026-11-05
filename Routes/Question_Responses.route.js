import express from "express";
import {
  createQuestionResponseController,
  getQuestionResponseByIdController,
  updateQuestionResponseController,
  getAllQuestionResponseController,
  deleteQuestionResponseController,
  searchQuestionResponseController
} from "../Controllers/Question_Responses.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createQuestionResponseController);
router.get("/get/:id", getQuestionResponseByIdController);
router.put("/update/:id", updateQuestionResponseController);
router.get("/all", getAllQuestionResponseController);
router.delete("/delete/:id", deleteQuestionResponseController);
router.get("/search", searchQuestionResponseController);


export default router;