-- CreateIndex
CREATE UNIQUE INDEX "PipelineAssessment_jurisdictionId_policyAreaId_assessmentDa_key" ON "PipelineAssessment"("jurisdictionId", "policyAreaId", "assessmentDate");
