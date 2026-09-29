import { Router, type IRouter } from "express";
import healthRouter from "./health";
import managementRouter from "./management";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(managementRouter);
router.use(storageRouter);

export default router;
