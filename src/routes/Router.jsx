import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../components/MainLayout";
import GameBoard from "../components/GameBoard"; // นำเข้า GameBoard

const router = createBrowserRouter([
  {
    path: "/", // Main route, the home page
    element: <MainLayout />, // Wraps the entire application with navbar
    children: [
      {
        index: true, // Matches '/'
        element: <Home />, // Render Home component
      },
      {
        path: "game", // เส้นทางใหม่สำหรับหน้าเกม
        element: <GameBoard />, // Render GameBoard component
      },
    ],
  },
]);

export default router;
