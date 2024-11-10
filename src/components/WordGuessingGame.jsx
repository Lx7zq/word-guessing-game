import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { formatEther } from "@ethersproject/units";
import contractABI from "../contract/contractABI"; // Import ABI
import Swal from "sweetalert2"; // Import SweetAlert

const contractAddress = "0x2Fc8d348712462442Ae49A5aD341Eb8bCBA2f44B"; // Your deployed contract address

export default function WordGuessingGame({
  wordToGuess,
  guessedLetters,
  setGuessedLetters,
  provider,
  accounts,
  isActive,
}) {
  const [balance, setBalance] = useState("0");
  const [guessCount, setGuessCount] = useState(0); // Track the number of guesses

  // Fetch token balance from contract
  useEffect(() => {
    const fetchBalance = async () => {
      if (!isActive || accounts.length === 0) {
        setBalance("0");
        return;
      }

      try {
        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const myBalance = await smartContract.balanceOf(accounts[0]);
        setBalance(formatEther(myBalance)); // Convert to human-readable balance (e.g., UDS)
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("0");
      }
    };

    fetchBalance();
  }, [isActive, provider, accounts]);

  // Handle letter guessing
  const handleGuess = (guess) => {
    if (!guessedLetters.includes(guess) && guessCount < wordToGuess.length) {
      setGuessedLetters((prev) => [...prev, guess]);
      setGuessCount(guessCount + 1); // Increment the guess count
    }
  };

  // Handle letter removal (delete)
  const handleRemoveLetter = (letter) => {
    setGuessedLetters((prev) => prev.filter((l) => l !== letter));
    setGuessCount(guessCount - 1); // Decrease guess count
  };

  // Reset the game
  const handleResetGame = () => {
    setGuessedLetters([]); // Clear guessed letters
    setGuessCount(0); // Reset guess count
  };

  // Check if game is completed (correct word guessed)
  useEffect(() => {
    if (
      wordToGuess.split("").every((letter) => guessedLetters.includes(letter))
    ) {
      console.log("Correct guess! Rewarded with 1 coin.");

      // Show SweetAlert success message
      Swal.fire({
        title: "Congratulations!",
        text: "You guessed the word correctly! You have been rewarded with 1 coin.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Call the reward function to transfer tokens to the winner's account
      rewardUser(accounts[0], 1); // Reward 1 coin to the current player
    }
  }, [guessedLetters, wordToGuess, accounts]);

  // Reward function - call smart contract to transfer tokens to the winner
  const rewardUser = async (recipient, amount) => {
    if (!recipient) return;
    try {
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // ดึงยอดเงินในธนาคาร (bank balance)
      const contractBalance = await smartContract.bankBalance(); // ตรวจสอบยอดเงินธนาคาร
      if (ethers.utils.parseUnits(amount.toString(), 18).gt(contractBalance)) {
        console.error("Not enough balance in the contract to reward.");
        return;
      }

      // ใช้ฟังก์ชัน rewardWinner แทน reward
      const tx = await smartContract.rewardWinner(
        recipient,
        ethers.utils.parseUnits(amount.toString(), 18), // จำนวนเหรียญที่ต้องการโอน
        {
          gasLimit: 2000000, // Gas limit เพื่อให้มั่นใจว่าธุรกรรมจะสำเร็จ
        }
      );

      await tx.wait(); // รอการยืนยันธุรกรรม
      console.log(`Rewarded ${amount} UDS to ${recipient}`);
    } catch (error) {
      console.error("Error rewarding user:", error);
    }
  };

  // Display guessed word with correct letters shown
  const getDisplayedWord = () => {
    return (
      <div className="flex justify-center items-center space-x-2">
        {wordToGuess.split("").map((letter, index) => {
          // Show guessed letters
          if (guessedLetters.includes(letter)) {
            return (
              <span
                key={index}
                className="text-green-500 text-4xl font-semibold"
              >
                {letter} {/* Show correctly guessed letters in green */}
              </span>
            );
          } else {
            // Show blank for undiscovered letters
            return (
              <span
                key={index}
                className="text-gray-400 text-4xl font-semibold"
                style={{
                  display: "inline-block",
                  width: "30px",
                  textAlign: "center",
                }}
              >
                _ {/* Undiscovered letters */}
              </span>
            );
          }
        })}
      </div>
    );
  };

  // Generate buttons for letter guessing A-Z
  const generateLetterButtons = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet.map((letter) => (
      <button
        key={letter}
        className="bg-gray-300 text-gray-800 py-2 px-4 m-2 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200"
        onClick={() => handleGuess(letter)}
        disabled={
          guessedLetters.includes(letter) || guessCount >= wordToGuess.length
        } // Disable button if letter guessed or if max guesses reached
      >
        {letter}
      </button>
    ));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      {/* Display Token Balance */}
      <div className="mb-6 flex justify-between items-center">
        <h6 className="text-xl font-semibold text-gray-800">
          Balance: {balance} UDS
        </h6>
      </div>

      {/* Word Display */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Word to Guess:
        </h2>
        <div className="text-4xl font-semibold text-gray-800">
          {getDisplayedWord()}
        </div>
      </div>

      {/* Guessed Letters Display */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Guessed Letters:
        </h3>
        <div className="flex flex-wrap gap-2">
          {guessedLetters.map((letter, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-lg cursor-pointer"
              onClick={() => handleRemoveLetter(letter)} // Add onClick event for deleting letter
            >
              {letter} {/* Clickable to remove letter */}
            </span>
          ))}
        </div>
      </div>

      {/* Letter Guess Buttons */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Guess a Letter:
        </h3>
        <div className="grid grid-cols-6 gap-2">{generateLetterButtons()}</div>
      </div>

      {/* Reset Game Button */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleResetGame}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none transition duration-200"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
