import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ethers } from "ethers";

const WalletButton = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // ตรวจสอบการเชื่อมต่อบัญชี Ethereum เมื่อเริ่มต้น
  useEffect(() => {
    // ตรวจสอบว่า localStorage มีบัญชี Ethereum ที่เก็บไว้หรือไม่
    const storedAccount = localStorage.getItem("walletAccount");

    // Set account if it's different from the current account
    if (storedAccount && storedAccount !== account) {
      setAccount(storedAccount);
      setIsConnected(true);
      if (onConnect) onConnect(storedAccount, true);
    }

    // ตรวจสอบการเปลี่ยนแปลงบัญชีใน MetaMask
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0 && accounts[0] !== account) {
          setAccount(accounts[0]);
          setIsConnected(true);
          if (onConnect) onConnect(accounts[0], true);
        } else {
          setAccount(null);
          setIsConnected(false);
          if (onConnect) onConnect(null, false);
        }
      };

      const handleDisconnect = () => {
        setAccount(null);
        setIsConnected(false);
        if (onConnect) onConnect(null, false);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleDisconnect); // Add listener for chain change as well
      window.ethereum.on("disconnect", handleDisconnect);

      // Clean up listeners when component unmounts
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleDisconnect);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    }
  }, [account, onConnect]); // Use `account` as a dependency to avoid unnecessary updates

  // เชื่อมต่อกับ MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      Swal.fire({
        icon: "error",
        title: "MetaMask not installed",
        text: "Please install MetaMask to use this feature",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsConnected(true);
      if (onConnect) onConnect(accounts[0], true);

      // บันทึกข้อมูลบัญชี Ethereum ลงใน localStorage
      localStorage.setItem("walletAccount", accounts[0]);

      // แสดง SweetAlert เมื่อเชื่อมต่อสำเร็จ
      Swal.fire({
        icon: "success",
        title: "Wallet Connected",
        text: `Connected with ${shortenAccount(accounts[0])}`,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: "Could not connect to MetaMask.",
      });
    }
  };

  // ฟังก์ชันที่ใช้ย่อ account ให้สั้นลง
  const shortenAccount = (account) => {
    if (!account) return "";
    return `${account.slice(0, 5)}...${account.slice(-4)}`;
  };

  // ตัดการเชื่อมต่อกระเป๋าเงิน
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    if (onConnect) onConnect(null, false);

    // ลบข้อมูลจาก localStorage
    localStorage.removeItem("walletAccount");

    // แสดง SweetAlert เมื่อยกเลิกการเชื่อมต่อ
    Swal.fire({
      icon: "warning",
      title: "Wallet Disconnected",
      text: "You have disconnected your wallet",
    });
  };

  return (
    <div className="flex justify-center items-center">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-green-500">
            Connected: {shortenAccount(account)} {/* แสดง account ที่ย่อแล้ว */}
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
