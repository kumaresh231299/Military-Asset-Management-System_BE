# 🪖 Military Asset Management System – Backend

This is the backend server for the **MAMS** (Military Asset Management System), used to track and manage military assets like vehicles, weapons, and ammunition across multiple bases.

---

## ⚙️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (with ES6 module syntax)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT-based
- **Authorization**: Role-Based Access (Admin, Base Commander, Logistic Officer)
- **Logging**: Morgan (for request logging) + MongoDB audit logs

---

## 🔐 Roles & Permissions

| Role               | Permissions                                      |
| ------------------ | ------------------------------------------------ |
| `admin`            | Full access – CRUD, metrics, audit logs          |
| `base_commander`   | Assign & expend assets within their base         |
| `logistic_officer` | Create purchases & transfers for their base only |

---

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd MAMS-backend

   ```

2. **Install dependencies**

   ```bash
   npm install

   ```

3. **Seed default users**

   ```bash
   node seedUser.js

   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

---

## 📮 API Endpoints

All routes (except login) require Bearer Token in headers:

- Authorization: Bearer <token>

### ✅ Auth

| Method | Endpoint      | Description |
| ------ | ------------- | ----------- |
| POST   | `/auth/login` | Login user  |

### 📦 Purchases

| Method | Endpoint     | Role            | Description           |
| ------ | ------------ | --------------- | --------------------- |
| POST   | `/purchases` | admin, logistic | Record a new purchase |
| GET    | `/purchases` | all roles       | Get all purchases     |

### 🔁 Transfers

| Method | Endpoint     | Role            | Description        |
| ------ | ------------ | --------------- | ------------------ |
| POST   | `/transfers` | admin, logistic | Create a transfer  |
| GET    | `/transfers` | admin, logistic | View all transfers |

### 🎯 Assignments

| Method | Endpoint                         | Role             | Description                   |
| ------ | -------------------------------- | ---------------- | ----------------------------- |
| POST   | `/assignments`                   | admin, commander | Assign or expend assets       |
| GET    | `/assignments`                   | admin, commander | View assignments (filterable) |
| PATCH  | `/assignments/:id/mark-expended` | commander        | Mark assignment as expended   |

### 📊 Dashboard Metrics

| Method | Endpoint     | Role      | Description                       |
| ------ | ------------ | --------- | --------------------------------- |
| GET    | `/dashboard` | all roles | Get current balance, totals, etc. |

Supports optional query params:

```bash
?base=Alpha Base&equipmentType=weapon&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
```

### 💰 Opening Balance

| Method | Endpoint           | Role  | Description                   |
| ------ | ------------------ | ----- | ----------------------------- |
| POST   | `/opening-balance` | admin | Set or update opening balance |
| GET    | `/opening-balance` | all   | Get opening balances          |

### 🕵️ Logs

| Method | Endpoint | Role  | Description           |
| ------ | -------- | ----- | --------------------- |
| GET    | `/logs`  | admin | Fetch all action logs |

### 🧪 Sample Credentials

Seeded users (node seedUser.js):

| Role             | Email                                             | Password |
| ---------------- | ------------------------------------------------- | -------- |
| Admin            | [admin@example.com](mailto:admin@example.com)     | admin321 |
| Base Commander   | [commander@alpha.com](mailto:commander@alpha.com) | cmd321   |
| Logistic Officer | [log@alpha.com](mailto:log@alpha.com)             | log321   |

---
