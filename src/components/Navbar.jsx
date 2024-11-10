import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletButton from "./WalletButton"; // นำเข้า WalletButton
import GameBoard from "./GameBoard";

const Navbar = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]); // ใช้สำหรับเก็บบัญชี Ethereum
  const [isActive, setIsActive] = useState(false); // ใช้สำหรับเก็บสถานะการเชื่อมต่อ

  const handleConnect = (account, isConnected) => {
    setAccounts([account]); // เก็บบัญชี Ethereum ที่เชื่อมต่อ
    setIsActive(isConnected); // อัปเดตสถานะการเชื่อมต่อ
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="text-2xl font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Word Guessing Game
          </div>

          <div className="space-x-4">
            <div className="inline-block">
              {/* ส่งฟังก์ชัน handleConnect ไปยัง WalletButton */}
              <WalletButton onConnect={handleConnect} />
            </div>
          </div>
        </div>
      </nav>

      {/* ส่ง accounts และ isActive ไปยัง GameBoard */}
      <div className="flex-grow">
        <GameBoard accounts={accounts} isActive={isActive} />
      </div>
    </div>
  );
};

export default Navbar;
