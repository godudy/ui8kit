import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./blocks/dashboard/page";
import { HomePage } from "./blocks/home/page";
import { ComponentExamples } from "./gallery/component-examples";

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage>
            <ComponentExamples />
          </DashboardPage>
        }
      />
      <Route path="/home/*" element={<HomePage />} />
    </Routes>
  );
}
