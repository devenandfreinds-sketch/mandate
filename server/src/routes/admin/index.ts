import { Router } from "express";
import { adminAuthRouter } from "./auth.routes.js";
import { adminImportsRouter } from "./imports.routes.js";
import { adminPipelineRouter } from "./pipeline.routes.js";
import { adminResearchTasksRouter } from "./researchTasks.routes.js";
import { adminUsersRouter } from "./users.routes.js";
import { adminResearchHealthRouter } from "./researchHealth.routes.js";

export const adminRouter = Router();

adminRouter.use(adminAuthRouter);
adminRouter.use("/imports", adminImportsRouter);
adminRouter.use("/pipeline-assessments", adminPipelineRouter);
adminRouter.use("/research-tasks", adminResearchTasksRouter);
adminRouter.use("/users", adminUsersRouter);
adminRouter.use("/research-health", adminResearchHealthRouter);
