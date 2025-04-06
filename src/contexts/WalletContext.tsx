
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import {
  connectWallet,
  handleAccountsChanged,
  handleChainChanged,
  initialWalletState,
  isMetaMaskInstalled,
  WalletState,
  createCampaignOnChain,
  contributeToChain,
  fetchCampaignsFromChain,
  generateIPFSHash
} from "@/utils/walletConnector";

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  createCampaign: (campaignData: {
    title: string;
    description: string;
    goal: number;
    duration: number;
    ipfsHash: string;
  }) => Promise<{ txHash: string }>;
  contribute: (campaignId: string, amount: number) => Promise<{ txHash: string }>;
  fetchChainCampaigns: () => Promise<any[]>;
  generateIPFSHash: (fileName: string) => string;
}

// Create the context with a meaningful default value
const WalletContext = createContext<WalletContextType>({
  wallet: initialWalletState,
  connect: async () => {},
  disconnect: () => {},
  isLoading: false,
  createCampaign: async () => ({ txHash: "" }),
  contribute: async () => ({ txHash: "" }),
  fetchChainCampaigns: async () => [],
  generateIPFSHash: () => "",
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [isLoading, setIsLoading] = useState(false);

  // Load previous wallet connection if exists
  useEffect(() => {
    const checkPreviousConnection = async () => {
      if (isMetaMaskInstalled() && localStorage.getItem("walletAddress")) {
        try {
          handleConnect(false);
        } catch (error) {
          console.error("Failed to reconnect:", error);
          localStorage.removeItem("walletAddress");
        }
      }
    };
    
    checkPreviousConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChangedCallback = (accounts: string[]) => {
      handleAccountsChanged(accounts, (address) => {
        if (address) {
          setWallet(prev => ({ ...prev, address, connected: true }));
          localStorage.setItem("walletAddress", address);
          toast({
            title: "Account changed",
            description: `Connected to: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          });
        } else {
          disconnect();
          toast({
            title: "Disconnected",
            description: "Your wallet has been disconnected",
            variant: "destructive",
          });
        }
      });
    };

    const handleChainChangedCallback = (chainId: string) => {
      handleChainChanged(chainId, (newChainId) => {
        setWallet(prev => ({ ...prev, chainId: newChainId }));
        toast({
          title: "Network changed",
          description: `Switched to network with Chain ID: ${newChainId}`,
        });
      });
    };

    // Use the correct event handling for MetaMask
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChangedCallback);
      window.ethereum.on("chainChanged", handleChainChangedCallback);
      
      // Check if already connected when component mounts
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            handleConnect(false);
          }
        })
        .catch(console.error);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChangedCallback);
        window.ethereum.removeListener("chainChanged", handleChainChangedCallback);
      }
    };
  }, []);

  const handleConnect = async (showToasts = true) => {
    try {
      setIsLoading(true);

      if (!isMetaMaskInstalled()) {
        if (showToasts) {
          toast({
            title: "MetaMask not installed",
            description: "Please install MetaMask extension to connect your wallet",
            variant: "destructive",
          });
        }
        return;
      }

      const walletState = await connectWallet();

      if (walletState.connected && walletState.address) {
        setWallet(walletState);
        localStorage.setItem("walletAddress", walletState.address);
        
        if (showToasts) {
          toast({
            title: "Connected successfully",
            description: `Connected to: ${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 4)}`,
          });
        }
      } else if (showToasts) {
        toast({
          title: "Connection failed",
          description: "Failed to connect to MetaMask",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in connect:", error);
      if (showToasts) {
        toast({
          title: "Connection error",
          description: error instanceof Error ? error.message : "An error occurred while connecting to MetaMask",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setWallet(initialWalletState);
    localStorage.removeItem("walletAddress");
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleCreateCampaign = async (campaignData: {
    title: string;
    description: string;
    goal: number;
    duration: number;
    ipfsHash: string;
  }) => {
    if (!wallet.connected || !wallet.provider) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      throw new Error("Wallet not connected");
    }

    try {
      return await createCampaignOnChain(wallet.provider, campaignData);
    } catch (error) {
      console.error("Error in createCampaign:", error);
      toast({
        title: "Campaign creation failed",
        description: error instanceof Error ? error.message : "Failed to create campaign on blockchain",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleContribute = async (campaignId: string, amount: number) => {
    if (!wallet.connected || !wallet.provider) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      throw new Error("Wallet not connected");
    }

    try {
      return await contributeToChain(wallet.provider, campaignId, amount);
    } catch (error) {
      console.error("Error in contribute:", error);
      toast({
        title: "Contribution failed",
        description: error instanceof Error ? error.message : "Failed to contribute on blockchain",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFetchChainCampaigns = async () => {
    if (!wallet.connected || !wallet.provider) {
      console.log("Wallet not connected, cannot fetch blockchain campaigns");
      return [];
    }

    try {
      return await fetchCampaignsFromChain(wallet.provider);
    } catch (error) {
      console.error("Error fetching blockchain campaigns:", error);
      return [];
    }
  };

  const contextValue = {
    wallet,
    connect: handleConnect,
    disconnect,
    isLoading,
    createCampaign: handleCreateCampaign,
    contribute: handleContribute,
    fetchChainCampaigns: handleFetchChainCampaigns,
    generateIPFSHash
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
