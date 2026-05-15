import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUTS ---
import MainLayout from '../components/layout/MainLayout';

// --- PAGES ---
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import CreateProject from '../pages/CreateProject';
import Engineers from '../pages/Engineers';
import SiteVisit from '../pages/SiteVisit';
import Documentation from '../pages/Documentation';
import NitApproval from '../pages/NitApproval';
import Advertisement from '../pages/Advertisement';
import RateApproval from '../pages/RateApproval';
import TenderAgreement from '../pages/TenderAgreement'; // Adjust the path if your folder structure is different
import Schemes from '../pages/Schemes';
import AdministrativeApproval from '../pages/AdministrativeApproval';
import TechnicalSanction from '../pages/TechnicalSanction';

import WeeklyUpdate from '../pages/WeeklyUpdate';
import QualityAspect from '../pages/QualityAspect';
import MaterialTesting from '../pages/MaterialTesting';
import OnsiteTesting from '../pages/MaterialTesting';

import WorkProgress from '../pages/WorkProgress';

// --- AUTH TOOLS ---
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ROLES } from '../utils/roles';

// --- FALLBACK COMPONENT ---
// Keeps the app from crashing when you click unbuilt sidebar links
const ComingSoon = ({ title }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center">
      <h1 className="text-2xl font-black text-[var(--color-text-main)] mb-2 uppercase">{title}</h1>
      <p className="text-[13px] text-[var(--color-text-muted)] border border-cghb-border bg-cghb-border/10 px-4 py-2 rounded-lg">
        Module pending initialization.
      </p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* ============================== */}
          {/* 1. PUBLIC ROUTES               */}
          {/* ============================== */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Auth />} />

          {/* ============================== */}
          {/* 2. PROTECTED DASHBOARD ROUTES  */}
          {/* ============================== */}
          <Route path="/dashboard" element={<MainLayout />}>
            
            {/* --- Global Dashboard (Everyone) --- */}
            <Route index element={<Home />} />

            {/* --- Management Routes (Commissioner & Dept Head) --- */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.COMMISSIONER, ROLES.DEPT_HEAD]} />}>
              <Route path="create-project" element={<CreateProject />} />
              <Route path="engineers" element={<Engineers />} />
              
              {/* Tender Approvals */}
              <Route path="tender/nit-approval" element={<NitApproval />} />
              <Route path="tender/advertisement" element={<Advertisement />} />
              <Route path="tender/rate-approval" element={<RateApproval />} />
              <Route path="tender/agreement" element={<TenderAgreement />} />

              <Route path="schemes" element={<Schemes />} />
              <Route path="administrative-approval" element={<AdministrativeApproval />} />
              <Route path="technical-sanction" element={<TechnicalSanction />} />
              
              
              {/* Other Management Areas */}
            </Route>

            {/* --- Field Operations (Commissioner & Engineer) --- */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.COMMISSIONER, ROLES.ENGINEER]} />}>
              <Route path="site-visit/*" element={<SiteVisit />} />
            </Route>

            {/* --- Shared Repository (All Roles) --- */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.COMMISSIONER, ROLES.DEPT_HEAD, ROLES.ENGINEER]} />}>
              <Route path="documentation/*" element={<Documentation />} />
              <Route path="site-visit/:id/weekly-update" element={<WeeklyUpdate />} />
              <Route path="site-visit/:id/quality-aspect" element={<QualityAspect />} />
              <Route path="site-visit/:id/material-testing" element={<MaterialTesting />} />
              <Route path="site-visit/:id/onsite-testing" element={<OnsiteTesting />} />
              <Route path="work-progress" element={<WorkProgress />} />
            </Route>

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;