import express from "express";
import {
  createClassStreamsController,
  getClassStreamsByIdController,
  updateClassStreamsController,
  getAllClassStreamsController,
  deleteClassStreamsController,
  searchClassStreamsController
} from "../Controllers/Class_Streams.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createClassStreamsController);
router.get("/get/:id", getClassStreamsByIdController);
router.put("/update/:id", updateClassStreamsController);
router.get("/all", getAllClassStreamsController);
router.delete("/delete/:id", deleteClassStreamsController);
router.get("/search", searchClassStreamsController);


export default router;