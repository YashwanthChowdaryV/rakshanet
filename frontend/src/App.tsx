import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ReportIncident from "./pages/pillars/ReportIncident";
import CaseManagement from "./pages/pillars/CaseManagement";
import EvidenceVault from "./pages/pillars/EvidenceVault";
import LegalConsultation from "./pages/pillars/LegalConsultation";
import TherapySupport from "./pages/pillars/TherapySupport";
import AcademicSupport from "./pages/pillars/AcademicSupport";
import AwarenessResources from "./pages/pillars/AwarenessResources";;
import LinkedInMisconductReport from "./pages/pillars/LinkedInMisconductReport";
import NLPAnalysis from "./pages/pillars/NLPAnalysis";
import CounselorDashboard from "./pages/counselor/CounselorDashboard";
import CounselorCases from "./pages/counselor/CounselorCases";
import CounselorCaseDetails from "./pages/counselor/CounselorCaseDetails";
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import LawyerCases from "./pages/lawyer/LawyerCases";
import LawyerCaseDetails from "./pages/lawyer/LawyerCaseDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCases from "./pages/admin/AdminCases";
import AdminCaseDetails from "./pages/admin/AdminCaseDetails";
import AdminLogs from "./pages/admin/AdminLogs";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute allowedRoles={["student"]}><ReportIncident /></ProtectedRoute>} />
          <Route path="/cases" element={<ProtectedRoute allowedRoles={["student"]}><CaseManagement /></ProtectedRoute>} />
          <Route path="/evidence" element={<ProtectedRoute allowedRoles={["student"]}><EvidenceVault /></ProtectedRoute>} />
          <Route path="/legal" element={<ProtectedRoute allowedRoles={["student"]}><LegalConsultation /></ProtectedRoute>} />
          <Route path="/therapy" element={<ProtectedRoute allowedRoles={["student"]}><TherapySupport /></ProtectedRoute>} />
          <Route path="/academic" element={<ProtectedRoute allowedRoles={["student"]}><AcademicSupport /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute allowedRoles={["student"]}><AwarenessResources /></ProtectedRoute>} />
          <Route path="/linkedin-report" element={<ProtectedRoute allowedRoles={["student"]}><LinkedInMisconductReport /></ProtectedRoute>} />
          
          <Route path="/nlp" element={<NLPAnalysis />} />

          <Route path="/counselor" element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorDashboard /></ProtectedRoute>} />
          <Route path="/counselor/cases" element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorCases /></ProtectedRoute>} />
          <Route path="/counselor/case/:id" element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorCaseDetails /></ProtectedRoute>} />

          <Route path="/lawyer" element={<ProtectedRoute allowedRoles={["lawyer"]}><LawyerDashboard /></ProtectedRoute>} />
          <Route path="/lawyer/cases" element={<ProtectedRoute allowedRoles={["lawyer"]}><LawyerCases /></ProtectedRoute>} />
          <Route path="/lawyer/case/:id" element={<ProtectedRoute allowedRoles={["lawyer"]}><LawyerCaseDetails /></ProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/cases" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCases /></ProtectedRoute>} />
          <Route path="/admin/case/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCaseDetails /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLogs /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><AnalyticsDashboard /></ProtectedRoute>} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;