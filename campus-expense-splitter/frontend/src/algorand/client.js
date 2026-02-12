// Algorand Client Configuration
// Manages connection to Algorand network

import algosdk from 'algosdk';
import { ALGORAND_CONFIG, INDEXER_CONFIG } from './config';

// Initialize Algorand client
export const algodClient = new algosdk.Algodv2(
  ALGORAND_CONFIG.token,
  ALGORAND_CONFIG.server,
  ALGORAND_CONFIG.port
);

// Initialize Indexer client for querying transactions
export const indexerClient = new algosdk.Indexer(
  INDEXER_CONFIG.token,
  INDEXER_CONFIG.server,
  INDEXER_CONFIG.port
);

// Get account information
export const getAccountInfo = async (address) => {
  try {
    const info = await algodClient.accountInformation(address).do();
    return info;
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
};

// Get transaction status
export const getTransactionStatus = async (txId) => {
  try {
    const status = await algodClient.pendingTransactionInformation(txId).do();
    return status;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
};

// Get application state
export const getAppState = async (appId) => {
  try {
    const appInfo = await algodClient.getApplicationByID(appId).do();
    return appInfo;
  } catch (error) {
    console.error('Error fetching app state:', error);
    throw error;
  }
};
