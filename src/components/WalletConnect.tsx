
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, ExternalLink, Wallet } from "lucide-react";

const WalletConnect = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [isMetaMaskDetected, setIsMetaMaskDetected] = useState(false);
  const [isContextError, setIsContextError] = useState(false);
  
  // Wrap wallet context access in try-catch to handle potential context errors
  let walletContextValue = {
    wallet: { connected: false, address: null, chainId: null },
    connect: async () => {},
    disconnect: () => {},
    isLoading: false
  };
  
  try {
    walletContextValue = useWallet();
  } catch (error) {
    console.error("Error accessing wallet context:", error);
    setIsContextError(true);
  }
  
  const { wallet, connect, disconnect, isLoading } = walletContextValue;

  useEffect(() => {
    // Check if MetaMask is available
    const checkMetaMask = () => {
      const hasMetaMask = typeof window !== "undefined" && 
                         typeof window.ethereum !== "undefined" && 
                         window.ethereum.isMetaMask === true;
      setIsMetaMaskDetected(hasMetaMask);
      console.log("MetaMask detected:", hasMetaMask);
    };
    
    checkMetaMask();
    
    // Add a small delay and check again (sometimes window.ethereum isn't immediately available)
    const timeoutId = setTimeout(checkMetaMask, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleConnect = () => {
    console.log("Connect button clicked, isMetaMaskDetected:", isMetaMaskDetected);
    if (isContextError) {
      console.error("Cannot connect: WalletProvider context is not available");
      return;
    }
    connect();
  };

  const handleDisconnect = () => {
    if (isContextError) return;
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

  if (isContextError) {
    return (
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="bg-gray-300 text-gray-600 flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        Wallet Unavailable
      </Button>
    );
  }

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
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : !isMetaMaskDetected ? (
            <>
              <Wallet className="h-4 w-4" />
              Install MetaMask
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
