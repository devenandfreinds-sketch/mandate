import { Router } from "express";
import { adminAuthRouter } from "./auth.routes.js";
import { adminImportsRouter } from "./imports.routes.js";

export const adminRouter = Router();

adminRouter.use(adminAuthRouter);
adminRouter.use("/imports", adminImportsRouter);
