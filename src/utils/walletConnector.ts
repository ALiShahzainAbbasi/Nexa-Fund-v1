
import { ethers } from "ethers";

export type WalletState = {
  address: string | null;
  connected: boolean;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
};

export const initialWalletState: WalletState = {
  address: null,
  connected: false,
  chainId: null,
  provider: null,
};

// Simulated IPFS hash generation for campaign images
export const generateIPFSHash = (fileName: string) => {
  // This is a placeholder function that returns a fake IPFS hash
  // In a real implementation, this would upload to IPFS and return the actual hash
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `ipfs://Qm${randomPart}${fileName.replace(/[^a-zA-Z0-9]/g, "")}`;
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && 
         typeof window.ethereum !== "undefined" && 
         window.ethereum.isMetaMask === true;
};

// Get Ethereum provider
export const getProvider = (): ethers.providers.Web3Provider | null => {
  if (!isMetaMaskInstalled()) return null;
  try {
    return new ethers.providers.Web3Provider(window.ethereum);
  } catch (error) {
    console.error("Error creating provider:", error);
    return null;
  }
};

// Connect to MetaMask
export const connectWallet = async (): Promise<WalletState> => {
  try {
    if (!isMetaMaskInstalled()) {
      console.error("MetaMask is not installed");
      throw new Error("MetaMask is not installed");
    }

    const provider = getProvider();
    if (!provider) {
      console.error("Failed to get provider");
      throw new Error("Failed to get provider");
    }

    // Request account access
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Get network information
    const network = await provider.getNetwork();
    
    console.log("Connected successfully:", { address, network });

    return {
      address,
      connected: true,
      chainId: network.chainId,
      provider,
    };
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return initialWalletState;
  }
};

// Handle account change events
export const handleAccountsChanged = (
  accounts: string[],
  callback: (address: string | null) => void
): void => {
  if (accounts.length === 0) {
    callback(null);
  } else {
    callback(accounts[0]);
  }
};

// Handle chain change events
export const handleChainChanged = (
  chainId: string,
  callback: (chainId: number) => void
): void => {
  callback(parseInt(chainId, 16));
};

// Simulated contract interaction - Create Campaign
export const createCampaignOnChain = async (
  provider: ethers.providers.Web3Provider,
  campaignData: {
    title: string;
    description: string;
    goal: number;
    duration: number;
    ipfsHash: string;
  }
): Promise<{ txHash: string }> => {
  try {
    // In a real implementation, this would:
    // 1. Connect to the actual smart contract
    // 2. Call the createCampaign function with the provided data
    // 3. Return the transaction hash

    // Simulating a transaction for now
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Simulate a delay to mimic blockchain transaction time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a fake transaction hash
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log("Campaign created on blockchain:", {
      creator: address,
      title: campaignData.title,
      goal: campaignData.goal,
      txHash,
    });
    
    return { txHash };
  } catch (error) {
    console.error("Error creating campaign on blockchain:", error);
    throw error;
  }
};

// Simulated contract interaction - Contribute to Campaign
export const contributeToChain = async (
  provider: ethers.providers.Web3Provider,
  campaignId: string,
  amount: number
): Promise<{ txHash: string }> => {
  try {
    // In a real implementation, this would:
    // 1. Connect to the actual smart contract
    // 2. Call the contribute function with the provided campaignId and amount
    // 3. Return the transaction hash

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Simulate a delay to mimic blockchain transaction time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a fake transaction hash
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log("Contribution made on blockchain:", {
      contributor: address,
      campaignId,
      amount,
      txHash,
    });
    
    return { txHash };
  } catch (error) {
    console.error("Error contributing on blockchain:", error);
    throw error;
  }
};

// Simulated contract interaction - Fetch Campaign Data
export const fetchCampaignsFromChain = async (
  provider: ethers.providers.Web3Provider
): Promise<any[]> => {
  try {
    // In a real implementation, this would:
    // 1. Connect to the actual smart contract
    // 2. Call a view function to get all campaigns
    // 3. Return the campaign data

    // Simulate a delay to mimic blockchain call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return simulated data
    return [
      {
        id: "0",
        title: "Blockchain Game Development",
        description: "Creating a new play-to-earn game on Ethereum",
        goal: 50000,
        raised: 12500,
        creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        ipfsHash: "ipfs://QmT7fTc6Zv3RKxjm9Qz4vVkQzgCp5xuvQzPfUJAKoqevio",
        daysLeft: 20,
      },
      {
        id: "1",
        title: "Decentralized Energy Trading",
        description: "A platform for P2P clean energy trading",
        goal: 75000,
        raised: 45000,
        creator: "0x8F174594BA4a0925A9FdF164aBaA4748a566c700",
        ipfsHash: "ipfs://QmUvZR7LRgYS7JZYWse9xDgSsQZ3wxKNj5RVKS52vtVe2q",
        daysLeft: 15,
      }
    ];
  } catch (error) {
    console.error("Error fetching campaigns from blockchain:", error);
    return [];
  }
};
