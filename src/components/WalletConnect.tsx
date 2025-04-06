
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, ExternalLink } from "lucide-react";

const WalletConnect = () => {
  const { wallet, connect, disconnect, isLoading } = useWallet();
  const [showAddress, setShowAddress] = useState(false);
  const [isMetaMaskDetected, setIsMetaMaskDetected] = useState(false);

  useEffect(() => {
    // Check if MetaMask is available
    setIsMetaMaskDetected(typeof window !== "undefined" && 
                         typeof window.ethereum !== "undefined" && 
                         window.ethereum.isMetaMask === true);
  }, []);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleAddressDisplay = () => {
    setShowAddress(!showAddress);
  };

  const viewOnEtherscan = () => {
    if (!wallet.address) return;
    
    const baseUrl = wallet.chainId === 1 
      ? "https://etherscan.io/address/" 
      : wallet.chainId === 5
        ? "https://goerli.etherscan.io/address/"
        : "https://sepolia.etherscan.io/address/";
    
    window.open(`${baseUrl}${wallet.address}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      {wallet.connected && wallet.address ? (
        <div className="flex items-center gap-2">
          <div 
            className="bg-green-100 text-green-800 px-3 py-1 rounded-md cursor-pointer flex items-center gap-1"
            onClick={toggleAddressDisplay}
          >
            {showAddress ? wallet.address : shortenAddress(wallet.address)}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={viewOnEtherscan}
            className="h-8 w-8"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDisconnect}
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleConnect}
          disabled={isLoading || !isMetaMaskDetected}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : !isMetaMaskDetected ? (
            "Install MetaMask"
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
