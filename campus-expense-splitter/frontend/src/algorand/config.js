// Algorand Configuration
// Contains network configuration and credentials

export const ALGORAND_CONFIG = {
  server: process.env.REACT_APP_ALGORAND_SERVER || 'https://testnet-api.algonode.cloud',
  port: process.env.REACT_APP_ALGORAND_PORT || 443,
  token: process.env.REACT_APP_ALGORAND_TOKEN || '',
  network: process.env.REACT_APP_NETWORK || 'testnet',
  appId: parseInt(process.env.REACT_APP_APP_ID) || 0,
  creatorAddress: process.env.REACT_APP_CREATOR_ADDRESS || ''
};

export const INDEXER_CONFIG = {
  server: process.env.REACT_APP_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud',
  port: process.env.REACT_APP_INDEXER_PORT || 443,
  token: process.env.REACT_APP_INDEXER_TOKEN || ''
};
