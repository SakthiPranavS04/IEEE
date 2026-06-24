# KEC IEEE Student Branch Web Portal

A premium, state-of-the-art community web portal developed for the **IEEE Student Branch of Kongu Engineering College (Autonomous)**, Perundurai, Tamil Nadu. This platform represents a high-performance, responsive student portal designed to highlight branch activities, facilitate event registrations, showcase student achievements, and offer an interactive administration system for local database updates.

## 🚀 Key Features

*   **Dynamic Landing Page:** Features a fluid notice marquee ticker, live student branch metrics counters, institutional keystone tab selections, active event cards, and an interactive embedded Google Map portal.
*   **ExeComm Chapters & Affinity Groups:** Individual dedicated layouts for **Computer Society**, **Communications Society (ComSoc)**, **Power & Energy Society (PES)**, **Robotics & Automation Society (RAS)**, and **Women in Engineering (WIE)**, highlighting their respective faculty advisors, bearers, active student members, and custom milestones.
*   **Interactive Achievements Staircase:** A bespoke, hover-responsive timeline staircase dashboard that spotlights Madras Section awards, national project expo winners, and global travel grant details.
*   **Virtual Assistant Chatbot:** A customized floating virtual guide component mapping localized quick reply suggestion chips and custom keywords to direct student branch registration details.
*   **Admin Control Panel:** A fully featured database dashboard dashboard for branch admins to perform CRUD operations on events, gallery photo logs, ExeComm bearers, and student research papers.

## 🛠️ Tech Stack & Design System

*   **Core:** React 19, React Router v7, Vite (build tool).
*   **Styling:** Custom Vanilla CSS utilizing HSL curated design tokens, dynamic dark overlays, glassmorphic card containers, and smooth animation keyframes.
*   **Icons:** Lucide React for modern vector iconography.
*   **State Management:** Component-level React hooks integrated with `LocalStorage` to maintain mock-database persistence across sessions.

## 📁 Project Structure

```
IEEE/
├── src/
│   ├── assets/         # Branded image assets & icons
│   ├── components/     # Reusable layout blocks (Navbar, Footer, Chatbot, Cards)
│   ├── data/           # Society details & fallback data configurations
│   ├── pages/          # Page layouts (Home, Events, Admin, Achievements, Contact)
│   ├── App.jsx         # App router & layout container
│   ├── index.css       # Core vanilla CSS design tokens and base themes
│   └── main.jsx        # App mounting configuration
├── vite.config.js      # Vite compilation configurations
└── package.json        # Dependencies list
```

## ⚙️ Installation & Running Locally

1.  **Clone & Navigate:**
    ```bash
    git clone <repository-url>
    cd IEEE
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The server will startup locally, typically at `http://localhost:5173`.

4.  **Production Compilation:**
    ```bash
    npm run build
    ```
    Creates the optimized production bundle under the `dist` folder.
