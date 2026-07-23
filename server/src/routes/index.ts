import { Router } from "express";
import { governanceModelsRouter } from "./governanceModels.routes.js";
import { jurisdictionsRouter } from "./jurisdictions.routes.js";
import { categoriesRouter } from "./categories.routes.js";
import { policyAreasRouter } from "./policyAreas.routes.js";
import { metricDefinitionsRouter } from "./metricDefinitions.routes.js";
import { sourcesRouter } from "./sources.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { catalogRouter } from "./catalog.routes.js";
import { researchMapRouter } from "./researchMap.routes.js";
import { externalContributionsRouter } from "./externalContributions.routes.js";
import { adminRouter } from "./admin/index.js";

export const apiRouter = Router();

apiRouter.use("/governance-models", governanceModelsRouter);
apiRouter.use("/jurisdictions", jurisdictionsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/policy-areas", policyAreasRouter);
apiRouter.use("/metric-definitions", metricDefinitionsRouter);
apiRouter.use("/sources", sourcesRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/data-catalog", catalogRouter);
apiRouter.use("/research-map", researchMapRouter);
apiRouter.use("/external-contributions", externalContributionsRouter);
apiRouter.use("/admin", adminRouter);
