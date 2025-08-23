import exprees from "express";
import { getAllCourse, getCourseId } from "../controllers/coursecontroller.js";

const courseRouter = exprees.Router();

courseRouter.get('/all', getAllCourse)
courseRouter.get('/:id', getCourseId)

export default courseRouter