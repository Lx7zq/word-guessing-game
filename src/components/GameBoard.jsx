import { useState, useEffect } from "react";
import WordGuessingGame from "../components/WordGuessingGame";
import { useWeb3 } from "../hooks/useWeb3"; // สมมุติว่าใช้ hook นี้
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

const GameBoard = () => {
  const { accounts, provider, isActive } = useWeb3(); // ใช้ hook เพื่อดึงข้อมูลที่จำเป็น
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [tokens, setTokens] = useState(0);

  return (
    <div>
      {/* ถ้าผู้ใช้เชื่อมต่อ MetaMask, แสดง WordGuessingGame */}
      {isActive ? (
        <WordGuessingGame
          wordToGuess="BLOCKCHAIN"
          guessedLetters={guessedLetters}
          setGuessedLetters={setGuessedLetters}
          setTokens={setTokens}
          provider={provider}
          accounts={accounts}
          isActive={isActive}
        />
      ) : (
        <div className="text-center mt-5">
          <p className="text-red-500 text-xl">
            Please connect to MetaMask to play!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
