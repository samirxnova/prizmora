"use client";
import React, { useEffect, useState } from "react";

const BASE_MAINNET_CHAIN_ID = "0x2105"; // 8453 in hex

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setIsMetaMask(!!(window as any).ethereum.isMetaMask);
      setChainId((window as any).ethereum.chainId);
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
      (window as any).ethereum.on("chainChanged", (id: string) => {
        setChainId(id);
      });
    }
  }, []);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      if (!(window as any).ethereum) throw new Error("MetaMask not found");
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setChainId((window as any).ethereum.chainId);
    } catch (e: any) {
      setError(e.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  return {
    account,
    chainId,
    isMetaMask,
    error,
    connecting,
    connect,
    isBaseMainnet: chainId === BASE_MAINNET_CHAIN_ID,
  };
}

export default function WalletConnectButton({ onConnected }: { onConnected?: (account: string) => void }) {
  const { account, isMetaMask, error, connect, connecting, isBaseMainnet } = useMetaMask();

  useEffect(() => {
    if (account && onConnected) onConnected(account);
  }, [account, onConnected]);

  if (!isMetaMask) {
    return <button className="bg-red-200 text-red-800 px-4 py-2 rounded" disabled>Install MetaMask</button>;
  }
  if (!account) {
    return <button onClick={connect} className="bg-yellow-400 px-4 py-2 rounded font-bold" disabled={connecting}>{connecting ? "Connecting..." : "Connect Wallet"}</button>;
  }
  if (!isBaseMainnet) {
    return <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded">Please switch to Base Mainnet in MetaMask</div>;
  }
  return <div className="bg-green-100 text-green-800 px-4 py-2 rounded">Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>;
}
