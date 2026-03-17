import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportIncident from "./pages/pillars/ReportIncident";
import CaseManagement from "./pages/pillars/CaseManagement";
import EvidenceVault from "./pages/pillars/EvidenceVault";
import LegalConsultation from "./pages/pillars/LegalConsultation";
import TherapySupport from "./pages/pillars/TherapySupport";
import AcademicSupport from "./pages/pillars/AcademicSupport";
import AwarenessResources from "./pages/pillars/AwarenessResources";;
import LinkedInMisconductReport from "./pages/pillars/LinkedInMisconductReport";
import NLPAnalysis from "./pages/pillars/NLPAnalysis";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
        <Route path="/cases" element={<ProtectedRoute><CaseManagement /></ProtectedRoute>} />
        <Route path="/evidence" element={<ProtectedRoute><EvidenceVault /></ProtectedRoute>} />
        <Route path="/legal" element={<ProtectedRoute><LegalConsultation /></ProtectedRoute>} />
        <Route path="/therapy" element={<ProtectedRoute><TherapySupport /></ProtectedRoute>} />
        <Route path="/academic" element={<ProtectedRoute><AcademicSupport /></ProtectedRoute>} />
        <Route path="/nlp" element={<NLPAnalysis />} />
        <Route path="/resources" element={<ProtectedRoute><AwarenessResources /></ProtectedRoute>} />
        <Route path="/linkedin-report" element={<ProtectedRoute><LinkedInMisconductReport /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;