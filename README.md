## Project Summary

RakshaNet – Online Safety & Anti-Cyberbullying Platform

- Created an NLP-based reporting platform capable of analyzing 500+ text inputs per session for cyberbullying and online misconduct detection with secure logging and severity classification.

- Implemented a full MERN-stack backend with JWT authentication, role-based access control, and SMTP email notifications supporting multiple concurrent users with alert handling, logging, and automated workflow execution.

- Designed workflow automation for case assignment, escalation, notification routing, and audit tracking to simulate a real-world incident response system.

- Built secure evidence storage with file hashing, role-based access, and case-linked verification.

- Developed multi-dashboard architecture for Student, Counselor, Lawyer, and Admin with protected routes and permission-based UI rendering.

- Tested REST APIs using Postman and performed debugging to ensure stable backend services.

- Followed proper Git version control workflow during development with feature commits, fixes, and repository management.

### Technologies Used

MongoDB, Express.js, React.js, Node.js, Python, NLP, OpenAI API, Gmail SMTP, Tailwind CSS, JWT, Mongoose, PDFKit, Multer
## Core Capabilities

- Multi-role dashboard system
- Case management engine
- Workflow automation engine
- Evidence verification vault
- Appointment & session management
- Notification routing system
- Analytics dashboard
- Audit logging system
- NLP text analysis
- PDF escalation report generation
- Role-based authentication
- Secure file hashing
- Database seeding
- Admin control panel

---

## Roles Supported

- Student
- Counselor
- Lawyer
- Admin

Each role has its own dashboard and permissions.

---

## System Architecture

Frontend → React + TypeScript + Vite  
Backend → Node.js + Express  
Database → MongoDB  
Auth → JWT  
Storage → Local upload + hash verification  
Notifications → DB based  
Workflow → Service engine  
Logging → Audit models  
Analytics → Aggregation queries  

---

## Backend Structure

```

backend/
├── scripts/
│ └── seedData.js
│
├── src/
│ ├── config/
│ │ └── db.js
│ │
│ ├── controllers/
│ │ adminController.js
│ │ analyticsController.js
│ │ auditController.js
│ │ authController.js
│ │ caseController.js
│ │ complaintController.js
│ │ counselorController.js
│ │ emailController.js
│ │ legalController.js
│ │ nlpController.js
│ │ notificationController.js
│ │ resourceController.js
│ │ therapyController.js
│ │
│ ├── middleware/
│ │ authMiddleware.js
│ │ roleMiddleware.js
│ │ upload.js
│ │
│ ├── models/
│ │ Appointment.js
│ │ AuditLog.js
│ │ Case.js
│ │ CounselorSession.js
│ │ EmailLog.js
│ │ EscalationReport.js
│ │ Institution.js
│ │ LegalConsultation.js
│ │ NLPLog.js
│ │ Notification.js
│ │ ReportLog.js
│ │ SessionLog.js
│ │ SystemLog.js
│ │ User.js
│ │ WorkflowLog.js
│ │
│ ├── routes/
│ │ adminRoutes.js
│ │ analyticsRoutes.js
│ │ auditRoutes.js
│ │ authRoutes.js
│ │ caseRoutes.js
│ │ complaintRoutes.js
│ │ counselorRoutes.js
│ │ emailRoutes.js
│ │ legalRoutes.js
│ │ nlpRoutes.js
│ │ notificationRoutes.js
│ │ resourceRoutes.js
│ │ therapyRoutes.js
│ │
│ ├── services/
│ │ auditService.js
│ │ emailService.js
│ │ nlpEngine.js
│ │ nlpService.js
│ │ notificationService.js
│ │ toxicityModel.js
│ │ workflowEngine.js
│ │ workflowService.js
│ │
│ ├── utils/
│ │ generateTokens.js
│ │ logger.js
│ │
│ └── app.js
---

## Frontend Structure

---

frontend/
├── src/
│
│ ├── components/
│ │ Layout.tsx
│ │ Navbar.tsx
│ │ NotificationBell.tsx
│ │ ProtectedRoute.tsx
│
│ ├── pages/
│ │
│ │ admin/
│ │ AdminDashboard.tsx
│ │ AdminCases.tsx
│ │ AdminCaseDetails.tsx
│ │ AdminUsers.tsx
│ │ AdminLogs.tsx
│ │ AnalyticsDashboard.tsx
│
│ │ counselor/
│ │ CounselorDashboard.tsx
│ │ CounselorCases.tsx
│ │ CounselorCaseDetails.tsx
│ │ CounselorSessions.tsx
│
│ │ lawyer/
│ │ LawyerDashboard.tsx
│ │ LawyerCases.tsx
│ │ LawyerCaseDetails.tsx
│
│ │ pillars/
│ │ Dashboard.tsx
│ │ ReportIncident.tsx
│ │ CaseManagement.tsx
│ │ EvidenceVault.tsx
│ │ LegalConsultation.tsx
│ │ TherapySupport.tsx
│ │ AcademicSupport.tsx
│ │ AwarenessResources.tsx
│ │ NLPAnalysis.tsx
│ │ LinkedInMisconductReport.tsx
│
│ │ Home.tsx
│ │ Login.tsx
│ │ Register.tsx
│
│ ├── services/
│ │ api.ts
│
│ ├── styles/
│
│ ├── App.tsx
│ ├── main.tsx

---

## Workflow Engine

Automates case processing.

- Auto severity routing
- Auto assignment
- Notification trigger
- Workflow logs
- Escalation rules

Files


workflowEngine.js
workflowService.js
WorkflowLog.js


---

## Evidence Vault

- File upload
- Hash verification
- Evidence linked to case
- Admin access

---

## Appointment & Session System

- Student books appointment
- Counselor sees appointment
- Lawyer sees appointment
- Cancel appointment
- Session logs
- Session history

Models


Appointment.js
CounselorSession.js
SessionLog.js
LegalConsultation.js


---

## Notification System

- Role based notifications
- User specific delivery
- Notification bell UI
- DB storage

---

## Analytics Dashboard

- Case stats
- Severity stats
- Status stats
- Workflow stats
- Logs stats

---

## Audit Logging

Tracks system actions

- Case actions
- Workflow actions
- Login
- Emails
- NLP
- Sessions

---

## NLP Engine

- Abuse detection
- Severity classification
- Keyword detection
- NLP logs

---

## PDF Complaint Generator

- Escalation report
- Evidence list
- Legal sections

---

## Database Seeding

Creates demo data

- 10 students
- 3 lawyers
- 2 counselors
- cases
- sessions
- appointments


scripts/seedData.js


---

## Run Project

Backend


cd backend
npm install
npm run dev


Frontend


cd frontend
npm install
npm run dev


---

## Environment


MONGO_URI=
JWT_SECRET=
SMTP_EMAIL=
SMTP_PASS=
HF_TOKEN=


---

## Engineering Highlights

- Service-based backend architecture
- Multi-role dashboard routing
- Workflow engine
- Notification routing
- Secure evidence hashing
- Analytics aggregation
- Audit logging
- Appointment system
- Session tracking
- Admin control panel
- Database seeding
- JWT authentication
- Protected routes
- Modular controllers/services/models

---

## Author

Yashwanth Chowdary

RakshaNet Project
