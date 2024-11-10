import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWeb3 = () => {
    const [accounts, setAccounts] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            // ตรวจสอบการเชื่อมต่อบัญชี Ethereum
            const checkConnection = async () => {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });

                if (accounts.length > 0) {
                    setAccounts(accounts);
                    setIsActive(true); // อัปเดตสถานะให้เป็น true
                    setProvider(new ethers.providers.Web3Provider(window.ethereum));
                } else {
                    setIsActive(false); // ถ้าไม่มีบัญชี, ตั้งค่าเป็น false
                }
            };

            checkConnection();

            // ติดตั้ง event listeners สำหรับการเปลี่ยนแปลงบัญชี
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAccounts(accounts);
                    setIsActive(true); // อัปเดตสถานะเป็น true เมื่อมีการเปลี่ยนแปลงบัญชี
                } else {
                    setIsActive(false); // ถ้าไม่มีบัญชี, ตั้งค่าเป็น false
                }
            });

            window.ethereum.on("chainChanged", (chainId) => {
                console.log("Chain changed to:", chainId);
            });
        } else {
            setIsActive(false); // ถ้าไม่พบ MetaMask, ตั้งค่าเป็น false
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", () => { });
                window.ethereum.removeListener("chainChanged", () => { });
            }
        };
    }, []);

    return { accounts, isActive, provider };
};
