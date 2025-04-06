
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

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

// Get Ethereum provider
export const getProvider = (): ethers.providers.Web3Provider | null => {
  if (!isMetaMaskInstalled()) return null;
  try {
    return new ethers.providers.Web3Provider(window.ethereum, "any");
  } catch (error) {
    console.error("Error creating provider:", error);
    return null;
  }
};

// Connect to MetaMask
export const connectWallet = async (): Promise<WalletState> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }

    const provider = getProvider();
    if (!provider) {
      throw new Error("Failed to get provider");
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Get network information after successful connection
    const network = await provider.getNetwork();

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    console.log("Connected successfully:", { account: accounts[0], network });

    return {
      address: accounts[0],
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
