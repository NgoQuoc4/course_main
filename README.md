# 🎓 CFD Course - Fullstack MERN Application

> Hệ thống quản lý khóa học trực tuyến xây dựng với MERN Stack

## 📋 Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Frontend  | ReactJS, Vite, Ant Design, React Router v6    |
| Backend   | Node.js, Express.js                           |
| Database  | MongoDB Atlas, Mongoose ODM                   |
| Auth      | JWT (Access + Refresh Token), bcryptjs         |
| Upload    | Cloudinary + Multer                           |
| Dev Tools | Nodemon, ESLint, Morgan                       |

## 🗂️ Cấu trúc thư mục

```
cfdcourse-main/
├── client/                       # 🌐 FRONTEND (ReactJS + Vite)
│   ├── assets/                   # Static files (images, fonts, SCSS)
│   ├── components/
│   │   ├── common/               # UI thuần: Spinner, EmptyState, Button...
│   │   └── layout/               # Khung trang: Header, Footer, Sidebar
│   ├── constants/                # Hằng số: paths, environments
│   ├── context/                  # React Context (Auth, Main)
│   ├── contexts/                 # Contexts mở rộng (Theme...)
│   ├── features/                 # 🌟 Feature-based modules
│   │   ├── auth/                 # Auth: slice, hooks, services, components
│   │   └── products/             # Products: slice, hooks, services, components
│   ├── hooks/                    # Custom hooks dùng chung
│   ├── layouts/                  # Layout wrappers (MainLayout)
│   ├── pages/                    # Page components (Smart components)
│   ├── routes/                   # React Router config
│   ├── services/                 # Axios client + API services
│   ├── store/                    # Redux Store config
│   └── utils/                    # Hàm tiện ích (token, axios, formatter)
│
├── server/                       # ⚙️ BACKEND
│   ├── config/                   # DB connection, environment config
│   ├── controllers/              # Request handler (thin layer)
│   ├── middlewares/              # Auth guard, Error handler, Upload
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # RESTful API endpoints
│   ├── scripts/                  # Seed data, migration scripts
│   └── src/
│       ├── config/               # Extended configs (Cloudinary)
│       ├── services/             # 🌟 Business Logic layer
│       └── utils/                # AppError, catchAsync, APIFeatures
```

## 🚀 Cài đặt & Chạy

### 1. Clone & Install

```bash
# Clone repo
git clone <repo-url>
cd cfdcourse-main

# Cài đặt Frontend
npm install

# Cài đặt Backend
cd server
npm install
```

### 2. Cấu hình Environment

**Frontend** (`.env` ở thư mục gốc):
```env
VITE_BASE_URL=http://localhost:5000/api
```

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cfdcourse
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Chạy Development

```bash
# Terminal 1 - Frontend (port 5173)
npm run dev

# Terminal 2 - Backend (port 5000)
cd server
npm run dev
```

### 4. Seed Data (Tùy chọn)

```bash
cd server
npm run seed
```

## 📌 Nguyên tắc phát triển

1. **Single Responsibility**: Mỗi file/hàm chỉ làm một việc duy nhất
2. **Feature-based**: Tính năng mới → tạo folder trong `features/`
3. **Service Layer**: Business logic ở `services/`, không ở `controllers/`
4. **Bảo mật**: File `.env` KHÔNG BAO GIỜ được commit lên Git
5. **Error Handling**: Sử dụng Global Error Handler, không try/catch rải rác

## 👥 API Endpoints

| Method | Endpoint                  | Description           | Auth |
| ------ | ------------------------- | --------------------- | ---- |
| POST   | /api/customer/register    | Đăng ký               | ❌   |
| POST   | /api/customer/login       | Đăng nhập             | ❌   |
| PUT    | /api/customer/refresh     | Refresh token         | ❌   |
| GET    | /api/customer/profiles    | Lấy profile           | ✅   |
| PUT    | /api/customer/profiles    | Cập nhật profile      | ✅   |
| GET    | /api/courses              | Danh sách khóa học    | ❌   |
| GET    | /api/courses/:slug        | Chi tiết khóa học     | ❌   |
| GET    | /api/orders/me            | Lịch sử thanh toán    | ✅   |
| GET    | /api/orders/courses/me    | Khóa học đã mua       | ✅   |
| GET    | /api/blogs                | Danh sách blog        | ❌   |
| GET    | /api/blogs/:slug          | Chi tiết blog         | ❌   |
| GET    | /api/health               | Health check          | ❌   |

---

**Author**: CFD Course Team