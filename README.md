DevPulse – Issue Tracker API

A collaborative backend system for reporting bugs, tracking features, and managing software issues efficiently.

Live URL
http://localhost:3000

Features
Create, update, delete issues
Get all issues with filtering & sorting
Get single issue details
JWT Authentication system
Role-based access control (Contributor / Maintainer)
Secure PostgreSQL database integration
Structured API response system

Tech Stack:
Node.js
Express.js
TypeScript
PostgreSQL (Raw SQL with pg)
JSON Web Token (JWT)
bcrypt.js

Setup Instructions
1. Clone repository
git clone https://github.com/rakib2275/assignment_2.git
cd assingment_2
2. Install dependencies
npm install
3. Setup environment variables

Create .env file:
CONNECTIONSTRING = "postgresql://neondb_owner:npg_vTFc8HnMuYD0@ep-empty-field-ap9tp3f3-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

PORT = 3000

JWT_SECRET = jklsajkdklga;
JWT_REFRESH_SECRET = asjdfkjdzjfkwsw;


4. Run database

Ensure PostgreSQL is running, then tables will auto-create on server start.

5. Start development server
npm run dev

Server will run on:

http://localhost:3000

📡 API Endpoints
🔐 Auth
Method	Endpoint	Description
POST	/api/auth/login	User login
POST /api/auth/signup User signup
🐛 Issues
Method	Endpoint	Access	Description
GET	/api/issues	Public	Get all issues
GET	/api/issues/:id	Public	Get single issue
POST	/api/issues	Auth	Create issue
PATCH	/api/issues/:id	Auth	Update issue
DELETE	/api/issues/:id	Maintainer	Delete issue

🗄️ Database Schema Summary
👤 Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'contributor'
  CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🐛 Issues Table
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(30) NOT NULL
  CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(30) DEFAULT 'open'
  CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
