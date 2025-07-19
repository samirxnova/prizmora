"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WalletConnectButton, { useMetaMask } from "@/components/wallet";

interface MintModalProps {
  open: boolean;
  onClose: () => void;
  image: string | null;
  onMint: (params: { name: string; symbol: string; description: string }) => void;
  isMinting: boolean;
  txHash?: string;
  error?: string | null;
}

export default function MintModal({ open, onClose, image, onMint, isMinting, txHash, error }: MintModalProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const { account, isMetaMask, isBaseMainnet, connect, connecting } = useMetaMask();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mint Fusion Coin</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {image && (
            <img src={image} alt="Fusion Preview" className="w-full h-48 object-cover rounded-lg border" />
          )}
          <Input
            placeholder="Coin Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isMinting}
            maxLength={32}
          />
          <Input
            placeholder="Symbol (max 6 chars)"
            value={symbol}
            onChange={e => setSymbol(e.target.value.toUpperCase().slice(0, 6))}
            disabled={isMinting}
            maxLength={6}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={isMinting}
            maxLength={200}
          />
          <WalletConnectButton />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {txHash && (
            <div className="text-green-600 text-sm break-all">Minted! Tx: {txHash}</div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() => onMint({ name, symbol, description, account })}
            disabled={!name || !symbol || !description || isMinting || !account || !isBaseMainnet}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
          >
            {isMinting ? "Minting..." : "Mint Coin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
