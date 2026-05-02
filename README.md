# TaskFlow - Premium Team Task Manager

TaskFlow is a modern, full-stack Team Task Manager built with Next.js. It features a premium, glassmorphism-inspired user interface, secure authentication, role-based access control, and dynamic Kanban-style task boards.

## 🚀 Features

- **Secure Authentication**: User signup and login powered by NextAuth.js and bcrypt encryption.
- **Role-Based Access Control (RBAC)**: Supports `ADMIN` and `MEMBER` roles. Admins can create projects and manage teams.
- **Project Management**: Create, view, and organize projects easily.
- **Kanban Task Board**: Manage project tasks across three dynamic columns: *To Do*, *In Progress*, and *Done*.
- **Personal Dashboard**: A birds-eye view of all your metrics, recent projects, and assigned tasks.
- **Premium Aesthetics**: Fully custom Vanilla CSS implementation featuring smooth gradients, glassmorphism cards, and interactive micro-animations.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS / CSS Modules
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- npm or yarn
- A MongoDB database (e.g., MongoDB Atlas)

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/thekarannagpal/task-manager.git
cd task-manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory of your project and add the following variables:

```env
# Database connection string (Replace with your actual MongoDB URI)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?appName=Cluster0"

# NextAuth Secret (Used for encrypting sessions)
# Generate a real one by running `openssl rand -base64 32` in your terminal
NEXTAUTH_SECRET="your_secure_random_string_here"

# NextAuth URL (The base URL of your application)
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## 📁 Folder Structure

```
task-manager/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and API endpoints
│   │   ├── api/            # Backend REST routes (Auth, Projects, Tasks)
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Login page
│   │   ├── projects/       # Projects list and details board
│   │   ├── signup/         # Signup page
│   │   ├── tasks/          # Personal tasks view
│   │   ├── layout.js       # Root layout file
│   │   ├── globals.css     # Premium styling system
│   │   └── page.js         # Landing page
│   ├── components/         # Reusable React components (Navbar, Sidebar)
│   ├── lib/                # Database connection & Auth configuration
│   └── models/             # Mongoose schemas (User, Project, Task)
├── .env.local              # Environment variables
└── package.json            # Project dependencies and scripts
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](#) if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
