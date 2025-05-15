import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAccount, useWalletClient, usePublicClient } from "wagmi"
import { createContentCoin } from "@/lib/zora"
import { base } from "viem/chains"

interface ZoraCoinCreatorProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
}

export default function ZoraCoinCreator({ isOpen, onClose, imageFile }: ZoraCoinCreatorProps) {
  const [coinName, setCoinName] = useState("")
  const [coinSymbol, setCoinSymbol] = useState("")
  const [coinDescription, setCoinDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: base.id })

  const handleCreateCoin = async () => {
    if (!address || !walletClient || !publicClient) {
      toast({
        title: "Error",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    if (!coinName.trim() || !coinSymbol.trim()) {
      toast({
        title: "Error",
        description: "Coin Name and Symbol are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await createContentCoin(
        walletClient, 
        publicClient, 
        {
          content: imageFile,
          title: coinName,
          symbol: coinSymbol,
          description: coinDescription,
          creatorAddress: address,
        }
      );

      if (result.success) {
        toast({
          title: "Success!",
          description: `Your coin "${coinName}" has been created. Tx: ${result.hash}`, 
        });
        console.log("Coin created successfully:", result);
        onClose(); 
      } else {
        toast({
          title: "Error Creating Coin",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
        console.error("Failed to create Zora coin:", result.error);
      }
    } catch (error: any) {
      console.error("Error in handleCreateCoin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create Zora coin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Create Zora Coin
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Publish your AI fusion art as a Zora coin. This will create a new token representing your artwork.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="coinName">Coin Name</Label>
            <Input
              id="coinName"
              value={coinName}
              onChange={(e) => setCoinName(e.target.value)}
              placeholder="Enter coin name (e.g., My Fusion Art)"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coinSymbol">Coin Symbol</Label>
            <Input
              id="coinSymbol"
              value={coinSymbol}
              onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
              placeholder="Enter coin symbol (e.g., FSNART)"
              className="bg-gray-800 border-gray-700 text-white"
              maxLength={10}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coinDescription">Description (Optional)</Label>
            <Textarea
              id="coinDescription"
              value={coinDescription}
              onChange={(e) => setCoinDescription(e.target.value)}
              placeholder="Describe your AI fusion art"
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCoin}
            disabled={isLoading || !coinName || !coinSymbol || !address || !imageFile || !walletClient || !publicClient}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Coin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 