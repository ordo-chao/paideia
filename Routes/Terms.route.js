import express from "express";
import {
  createTermController,
  getTermByIdController,
  updateTermController,
  getAllTermController,
  deleteTermController,
  searchTermController
} from "../Controllers/Terms.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createTermController);
router.get("/get/:id", getTermByIdController);
router.put("/update/:id", updateTermController);
router.get("/all", getAllTermController);
router.delete("/delete/:id", deleteTermController);
router.get("/search", searchTermController);


export default router;