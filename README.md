# UniFlow - Premium University Planner

A high-end, dark-mode university planner web application built with React, TypeScript, and Tailwind CSS.

## Architecture

1.  **Framework:** Single Page Application (SPA) using React 18.
2.  **State Management:** `usePlannerStore` custom hook manages global state (`subjects`, `assignments`) and handles persistence via `localStorage`.
3.  **Styling:** Tailwind CSS is used for utility-first styling. A "Glassmorphism" effect is achieved using semi-transparent backgrounds (`bg-white/5`), backdrop filters (`backdrop-blur`), and subtle borders.
4.  **Data Flow:** Unidirectional data flow. Actions (add, delete, update) are exposed by the store and passed down to views (`Dashboard`, `Subjects`, `Assignments`).
5.  **AI Integration:** The `geminiService` uses the `@google/genai` SDK (`gemini-2.5-flash` model with `googleSearch` tool) to fetch real-world study resources for subjects.

## Data Models

### Subject
```json
{
  "id": "uuid",
  "name": "Calculus",
  "code": "MAT101",
  "professor": "Dr. Strange",
  "classesConducted": 20,
  "classesAttended": 18,
  "color": "#8b5cf6"
}
```

### Assignment
```json
{
  "id": "uuid",
  "subjectId": "uuid-ref",
  "title": "Problem Set 1",
  "dueDate": "2023-10-25",
  "description": "Chapters 1-3",
  "isCompleted": false
}
```

## Running Locally

1.  Ensure you have `node` and `npm` installed.
2.  Set your API Key: The app requires a Google Gemini API Key for the search feature. In a development environment, you would set `process.env.API_KEY`.
3.  Install dependencies (if running in a standard create-react-app environment):
    ```bash
    npm install react react-dom lucide-react @google/genai
    ```
4.  If just pasting the code, ensure the TypeScript compilation handles the `.tsx` files and the environment variable is injected.
