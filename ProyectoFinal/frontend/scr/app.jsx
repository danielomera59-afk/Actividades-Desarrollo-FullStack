import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="mainContent">
        <AppRoutes />
      </main>
    </div>
  );
}