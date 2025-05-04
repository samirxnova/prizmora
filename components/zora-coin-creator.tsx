import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCoin } from "@zoralabs/coins-sdk"
import { useToast } from "@/components/ui/use-toast"
import { useAccount, useWalletClient, usePublicClient } from "wagmi"
import { base } from "viem/chains"

interface ZoraCoinCreatorProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageTitle: string
}

export default function ZoraCoinCreator({ isOpen, onClose, imageUrl, imageTitle }: ZoraCoinCreatorProps) {
  const [coinName, setCoinName] = useState("")
  const [coinSymbol, setCoinSymbol] = useState("")
  const [coinDescription, setCoinDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const handleCreateCoin = async () => {
    if (!address || !walletClient || !publicClient) {
      toast({
        title: "Error",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      // Create coin metadata
      const metadata = {
        name: coinName,
        symbol: coinSymbol,
        description: coinDescription,
        image: imageUrl,
        properties: {
          originalTitle: imageTitle,
          type: "AI Fusion Art",
          creationDate: new Date().toISOString(),
        },
      }

      // Create the coin using Zora SDK
      const result = await createCoin({
        name: coinName,
        symbol: coinSymbol,
        uri: imageUrl,
        payoutRecipient: address,
        platformReferrer: address,
      }, walletClient, publicClient)

      toast({
        title: "Success!",
        description: "Your AI fusion art has been published as a Zora coin.",
      })

      onClose()
    } catch (error) {
      console.error("Error creating Zora coin:", error)
      toast({
        title: "Error",
        description: "Failed to create Zora coin. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
              placeholder="Enter coin name"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coinSymbol">Coin Symbol</Label>
            <Input
              id="coinSymbol"
              value={coinSymbol}
              onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
              placeholder="Enter coin symbol (e.g., FUSION)"
              className="bg-gray-800 border-gray-700 text-white"
              maxLength={5}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coinDescription">Description</Label>
            <Textarea
              id="coinDescription"
              value={coinDescription}
              onChange={(e) => setCoinDescription(e.target.value)}
              placeholder="Describe your AI fusion art"
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCoin}
            disabled={isLoading || !coinName || !coinSymbol || !address}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? "Creating..." : "Create Coin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 