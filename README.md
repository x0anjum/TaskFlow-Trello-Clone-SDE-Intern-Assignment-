# TaskFlow — Trello Clone (SDE Intern Assignment)
TaskFlow is a full-stack Kanban-style project management application designed to closely replicate the user experience, layout, and interaction patterns of Trello. This project was developed as a technical assessment for the Scalar AI SDE Intern role.

🚀 Live Demo & Repository
Deployed Application: [Link to Vercel/Render]

GitHub Repository: [Link to Repository]

🛠 Tech Stack
Frontend: React.js 19 (via Vite 6), Tailwind CSS 4 & PostCSS 8 (for pixel-perfect Trello styling).

Backend: Node.js (v24+), Express.js 5.

Database: PostgreSQL (Hosted on Supabase).

ORM: Prisma 6 (Ensuring a type-safe, well-structured relational schema).

Drag & Drop: `@hello-pangea/dnd` (A modern, actively maintained fork of `react-beautiful-dnd` used for smooth, intuitive reordering of cards and lists).

✨ Core Features (Must-Haves)
1. Board & List Management
Board View: View a comprehensive board with all its associated lists and cards.

List CRUD: Create, edit (rename), and delete lists.

Reordering: Drag and drop lists horizontally to reorganize project workflows.

2. Card Management
Card Creation: Quickly add cards with titles to any list.

Drag-and-Drop: Move cards vertically within a list or horizontally between different lists.

Card Details (Modal): 
* Labels: Add/remove colored tags (displayed as vertical strips on the board view).
* Due Dates: Set and track deadlines with a dedicated date picker.
* Checklists: Add sub-tasks with a dynamic progress bar that updates as items are checked off.
* Member Assignment: Assign pre-seeded team members to specific cards using many-to-many API connections.

3. Search & Filtering
Title Search: Filter cards instantly by typing in the search bar. This intelligently hides empty project lists to prevent UI clutter.

Advanced Filters: Filter the entire board by Labels, Assigned Members, or Due Dates in real-time. Drag-and-drop operations are safely disabled when filtering is active to prevent database corruption.

📊 Database Design
The database was designed with strict relational integrity to ensure data consistency:

Board: The top-level container.

List: One-to-Many relationship with Boards.

Card: One-to-Many relationship with Lists.

Member/User: Many-to-Many relationship with Cards (allowing multiple members per task).

ChecklistItem: One-to-Many relationship with Cards.

Label: Many-to-Many relationship with Cards for flexible tagging.

📝 Key Assumptions & Decisions
No Login Required: As per the instructions, the application assumes a "Default User" is always logged in.

Pre-seeded Data: The database comes with a `seed.ts` script to populate the board with sample lists, cards, and members for immediate evaluation. You can run this using `npm run seed`.

UI Pattern: I prioritized Trello’s signature "vertical label strips" and specific modal layouts to demonstrate attention to interaction design.

⚙️ Local Setup Instructions
### 1. Clone the repository
```bash
git clone https://github.com/yourusername/taskflow-trello-clone.git
cd taskflow-trello-clone
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd trello-clone-frontend
npm install

# Install backend dependencies
cd ../trello-clone-backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `trello-clone-backend` directory:
```env
DATABASE_URL="your_supabase_postgresql_url"
PORT=4000
```

*(Optional)* Create a `.env` file in the `trello-clone-frontend` directory:
```env
VITE_API_URL=http://localhost:4000
```

### 4. Database Migration & Seeding
```bash
cd trello-clone-backend
npx prisma migrate dev --name init
npm run seed
```

### 5. Run the Application
```bash
# Start Backend (from /trello-clone-backend)
npm run dev

# Start Frontend (from /trello-clone-frontend)
npm run dev
```
🎯 Evaluation Criteria Checklist
[x] Functionality: All core "Must-Have" features are fully operational.

[x] UI/UX: Visual styling (Tailwind) closely mimics Trello’s interface.

[x] Drag & Drop: Smooth reordering for both Cards and Lists.

[x] Code Quality: Modular React components and a clean Express router structure.