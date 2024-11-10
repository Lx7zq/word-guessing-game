import React from "react";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>
      <main className="flex-1 mt-20 overflow-auto"></main>
    </div>
  );
};

export default MainLayout;
