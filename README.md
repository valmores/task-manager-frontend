# TaskMaster Frontend

TaskMaster is a premium, modern task management dashboard built with Next.js and Material UI. It features a sleek purple theme, responsive design, and an integrated internal chat system for administrative tracking.

## ✨ Highlights

- **Chat-Style Internal Notes**: A high-fidelity chat interface for admins and owners to discuss tasks privately.
- **Role-Based UI**: Dynamic dashboard that adapts based on user roles (Admin, Project Owner, or User).
- **Premium Aesthetics**: Vibrant purple theme with smooth transitions, dark mode support, and interactive UI components.
- **Smart Task Management**: Interactive task cards with notification badges for internal notes.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) & React 19
- **Styling**: [Material UI (MUI) 9](https://mui.com/) & [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **State Management**: [Zustand v5](https://github.com/pmndrs/zustand)
- **HTTP Client**: Axios with interceptors for JWT management.

## 🚀 Key Features

### 💬 Internal Discussion System
A dedicated chat modal for every task that allows authorized roles (Admins/Owners) to leave internal notes.
- **Newest Messages at Bottom**: Logical conversation flow.
- **Auto-Scroll**: Smart scrolling to the latest update.
- **Avatar Attribution**: Initials-based avatars for all participants.

### 🌓 Theme & Accessibility
- **Purple Brand Theme**: Cohesive design across all components.
- **Password Visibility**: Toggle icons on all login/register forms.
- **Dark Mode**: Respects system preferences and manual toggle.

## ⚙️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Backend URL**:
   Currently, the API URL is set to `http://127.0.0.1:8000/api`. You can update this in:
   - `lib/api.ts`
   - `lib/config.ts`

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/app`: Next.js App Router (Dashboard, Projects, Tasks, Admin).
- `/components`: Shared UI components and layout logic.
- `/hooks`: Custom hooks for data synchronization (React Query).
- `/lib`: API configuration and axios instance.
- `/store`: Global state for authentication.
- `/types`: TypeScript interfaces for the TaskMaster domain.
