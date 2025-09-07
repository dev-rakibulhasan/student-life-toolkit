import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ClassProvider } from "./contexts/ClassContext.jsx";
import { BudgetProvider } from "./contexts/BudgetContext.jsx";
import { QuestionProvider } from "./contexts/QuestionContext.jsx";
import { SubjectProvider } from "./contexts/SubjectContext.jsx";
import { InstructorProvider } from "./contexts/InstructorContext.jsx";
import { StudyTaskProvider } from "./contexts/StudyTaskContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ClassProvider>
        <BudgetProvider>
          <QuestionProvider>
            <SubjectProvider>
              <InstructorProvider>
                <StudyTaskProvider>
                  <App />
                </StudyTaskProvider>
              </InstructorProvider>
            </SubjectProvider>
          </QuestionProvider>
        </BudgetProvider>
      </ClassProvider>
    </AuthProvider>
  </StrictMode>
);
