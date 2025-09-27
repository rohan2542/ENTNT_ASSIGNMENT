

***

# TalentFlow: Production-Ready Frontend Hiring Platform

TalentFlow is a modern, feature-rich frontend hiring platform built with **React, TypeScript, and Vite**, designed to showcase a robust, production-ready application architecture. Its primary innovation lies in its **offline-first design**, achieving a realistic, full-stack experience without a traditional backend server.

*Deployed Application*: [https://entnt-assignment123.netlify.app/jobs]

---

##  Architecture and Technology

The platform uses a unique architecture centered around client-side API simulation and persistence:

| Component | Role | Rationale |
| :--- | :--- | :--- |
| **React App** | Frontend UI | Core user interface for Jobs, Candidates, and Assessments. |
| **MSW (Mock Service Worker)** | API Layer & Simulation | Intercepts network requests to simulate a backend API, providing **true network delays** ($\text{200-1200ms}$) and **realistic error simulation** ($\text{5-10\%}$ failure rate for writes). |
| **IndexedDB (via Dexie)** | Data Persistence | Stores all application data ($\text{jobs, candidates, assessments}$) locally and persistently across browser sessions. |

### Key Technologies

* **State Management**: **React Query** for superior caching, optimistic updates, and error handling.
* **Database Wrapper**: **Dexie** for robust, TypeScript-friendly IndexedDB operations.
* **Performance**: **react-window** for high-performance virtualization (1000+ candidates).
* **UI/UX**: **dnd-kit** for accessible drag-and-drop, and **Tailwind CSS** for rapid development.

---

##  Core Features

TalentFlow provides complete management capabilities across the entire hiring workflow:

### **1. Jobs Management**
* **Full CRUD** operations (Create, Edit, Archive/Unarchive).
* **Drag & Drop Reordering** with **Optimistic UI** and automatic rollback on failure.
* **Advanced Filtering** by title, status, and tags.
* **Server-like Pagination** and **Slug Validation** with real-time uniqueness checks.

### **2. Candidates Management**
* **Virtualized List** for high-performance rendering of $\text{1000+}$ candidates.
* **Kanban Board** for visual stage management and drag-and-drop transitions.
* **Timeline Tracking** for a complete candidate journey log.
* **Profile Management** with rich text notes and **@Mention Support**.

### **3. Assessment Builder**
* **Visual Drag-and-Drop Builder** for managing sections and questions.
* **Live Preview** with instant updates.
* Support for various **Question Types** (Text, Numeric, Single/Multi-choice).
* **Conditional Logic** to show/hide questions based on previous answers.

---

##  Technical Capabilities & Testing

### **Error Resilience**
The platform is explicitly designed for resilience, featuring **Optimistic UI** (immediate feedback with automatic rollback on network errors) and configurable **Error Simulation** through MSW, allowing developers to easily test failure scenarios ($\text{window.__MSW_ERROR_RATE__ = 0.5}$).

### **Seeding and Testing**
* It includes a comprehensive seed script ($\text{npm run seed}$) that populates the database with $\text{25}$ jobs, $\text{1000}$ candidates, and $\text{3}$ assessments.
* It utilizes **Playwright** for end-to-end (E2E) test coverage, specifically targeting complex flows like drag-and-drop reordering with error simulation and slug validation.

### **Deployment**
TalentFlow is deployable to platforms like Vercel or Netlify with **zero server-side configuration** or environment variables required, as all logic and data persistence run entirely within the browser.

---

##  Future Roadmap

Planned improvements focus on advanced features and technical refinement:
* **Advanced Analytics Dashboard**.
* **Real-time Collaboration** (via WebSocket simulation).
* **Bulk Operations** (e.g., batch candidate updates).
* Increasing test coverage to $>\text{90\%}$ and implementing proper loading states.
