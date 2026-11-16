# 🚦 Smart Traffic Violation Reporting and Management System

A full-stack web application designed to make traffic violation reporting, verification, assignment, and management easier and more transparent.

## 📌 Project Overview

The **Smart Traffic Violation Reporting and Management System** allows citizens to report traffic violations by uploading photographic evidence and location details. Reviewers verify the submitted reports, administrators assign validated cases to traffic officers, and officers update the action status until the case is resolved.

The system provides role-based access, secure authentication, violation tracking, search functionality, and report generation.

## ✨ Features

- **Citizen Module**
  - Register and log in.
  - Report traffic violations with photos.
  - Capture geographical location.
  - Track submitted reports and status.

- **Reviewer Module**
  - View submitted violation reports.
  - Verify uploaded evidence.
  - Approve or reject reports with notes.

- **Admin Module**
  - Manage user accounts.
  - Create reviewer and officer accounts.
  - Assign validated cases to traffic officers.
  - Monitor violation reports.

- **Traffic Officer Module**
  - View assigned cases.
  - Update cases to In Progress.
  - Mark cases as Resolved.
  - Add action notes.

- **Search and Reports**
  - Search violations using filters.
  - View violation category reports.
  - View pending violation reports.
  - Generate area-wise reports.
  - View resolution and action reports.
  - Download reports in CSV and PDF formats.

## 🛠️ Technologies Used

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| HTTP Requests | Axios |
| Charts | Recharts |
| Web Server | Nginx |
| Version Control | Git, GitHub |
| Containerization | Docker |
| Orchestration | Kubernetes |
| Development Tools | VS Code, Git Bash |

## 🏗️ System Architecture

The application follows a three-tier architecture:

1. **Presentation Layer:** React application served through Nginx.
2. **Application Layer:** Node.js and Express REST API.
3. **Data Layer:** MongoDB database for storing users, violations, and case history.

Docker Compose and Kubernetes are used for deployment.

## 📂 Project Structure

```text
traffic-violation-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── server.js
│   │   └── seed.js
│   ├── uploads/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── AuthContext.jsx
│   │   └── App.jsx
│   ├── nginx.conf
│   └── Dockerfile
│
├── k8s/
│   ├── secrets-configmap.yaml
│   ├── mongo.yaml
│   ├── backend.yaml
│   └── frontend.yaml
│
├── docker-compose.yml
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- Node.js
- MongoDB
- Git
- Docker Desktop
- Kubernetes (Docker Desktop Kubernetes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/2303A53004/traffic-violation-system.git
```

```bash
cd traffic-violation-system
```

### Step 2: Run Using Docker Compose

Build and start all services:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

Initialize demo data:

```bash
docker compose exec backend node src/seed.js
```

### Step 3: Access the Application

Open your browser:

**Docker Compose URL:**

http://localhost:8080

If port 8080 is already occupied and your Compose configuration uses port 8081:

http://localhost:8081

## ☸️ Kubernetes Deployment

Build Docker images:

```bash
docker build -t traffic-backend:1.0 ./backend
```

```bash
docker build -t traffic-frontend:1.0 ./frontend
```

Apply Kubernetes configurations:

```bash
kubectl apply -f k8s/secrets-configmap.yaml
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

Check pods, services, and persistent volumes:

```bash
kubectl get pods,svc,pvc
```

Initialize demo data:

```bash
kubectl exec deploy/backend -- node src/seed.js
```

**Access the application:**

http://localhost:30080

## 🔄 Violation Status Workflow

```text
Submitted
    |
    v
Validated / Rejected
    |
    v
Assigned
    |
    v
In Progress
    |
    v
Resolved
```

Each status update is recorded in the case history with the user, note, and timestamp.

## 🔐 Security Features

- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control.
- Protected API endpoints.
- User ownership verification.
- Image upload validation.
- Restricted file upload size.
- Server-side input validation.

## 📊 Reports Generated

1. Violation Category Report
2. Pending Violation Report
3. Area-wise Violation Report
4. Resolution / Action Report

Reports are displayed using charts and tables and support CSV and PDF downloads.

## 🚀 Future Enhancements

- Automatic number plate recognition.
- AI-based traffic violation detection.
- Integration with government e-challan systems.
- Online fine payment.
- Real-time traffic monitoring.
- Advanced analytics and dashboards.

## 👩‍💻 Developer Information

**Project Name:** Smart Traffic Violation Reporting and Management System

**Student Name:** Ayreddy Akanksha

**Hall Ticket Number:** 2303A53004

**University:** SR University

**School:** School of Computer Science & Artificial Intelligence

**Course:** DevOps and Full Stack Development

**Academic Year:** 2026–2027

## 🔗 GitHub Repository

https://github.com/2303A53004/traffic-violation-system

---

⭐ **If you find this project useful, consider giving the repository a star!**
