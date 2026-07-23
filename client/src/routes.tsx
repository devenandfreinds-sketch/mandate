import { Route, Routes } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { GovernanceModelsListPage } from "@/pages/GovernanceModelsListPage";
import { GovernanceModelDetailPage } from "@/pages/GovernanceModelDetailPage";
import { PlaceProfilePage } from "@/pages/PlaceProfilePage";
import { MetricDetailPage } from "@/pages/MetricDetailPage";
import { PipelineDetailPage } from "@/pages/PipelineDetailPage";
import { PipelineMethodologyPage } from "@/pages/PipelineMethodologyPage";
import { DataCatalogPage } from "@/pages/DataCatalogPage";
import { ResearchMapPage } from "@/pages/ResearchMapPage";
import { ResearchJurisdictionDetailPage } from "@/pages/ResearchJurisdictionDetailPage";
import { ContributePage } from "@/pages/ContributePage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminImportsPage } from "@/pages/admin/AdminImportsPage";
import { AdminPipelinePage } from "@/pages/admin/AdminPipelinePage";
import { AdminResearchQueuePage } from "@/pages/admin/AdminResearchQueuePage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminExternalContributionsPage } from "@/pages/admin/AdminExternalContributionsPage";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/governance-models" element={<GovernanceModelsListPage />} />
      <Route path="/governance-models/:slug" element={<GovernanceModelDetailPage />} />
      <Route path="/places/:slug" element={<PlaceProfilePage />} />
      <Route path="/places/:jurisdictionSlug/pipeline/:policyAreaSlug" element={<PipelineDetailPage />} />
      <Route path="/metrics/:slug" element={<MetricDetailPage />} />
      <Route path="/methodology/pipeline" element={<PipelineMethodologyPage />} />
      <Route path="/data-catalog" element={<DataCatalogPage />} />
      <Route path="/research" element={<ResearchMapPage />} />
      <Route path="/research/:jurisdictionSlug" element={<ResearchJurisdictionDetailPage />} />
      <Route path="/contribute" element={<ContributePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/imports"
        element={
          <RequireAdmin>
            <AdminImportsPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/pipeline"
        element={
          <RequireAdmin>
            <AdminPipelinePage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/research-queue"
        element={
          <RequireAdmin>
            <AdminResearchQueuePage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAdmin>
            <AdminUsersPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/external-contributions"
        element={
          <RequireAdmin>
            <AdminExternalContributionsPage />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
