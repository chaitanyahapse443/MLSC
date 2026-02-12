// Algorand Utility Functions
// Helper functions for common Algorand operations

import algosdk from 'algosdk';
import { ALGORAND_CONFIG } from './config';

/**
 * Validate Algorand address format
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export const isValidAlgorandAddress = (address) => {
  try {
    algosdk.decodeAddress(address);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Format address for display (shortened)
 * @param {string} address - Full address
 * @param {number} length - Length to show on each side
 * @returns {string} Formatted address
 */
export const formatAddress = (address, length = 10) => {
  if (!address || address.length < 20) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

/**
 * Convert microAlgo to ALGO
 * @param {number} microAlgo - Amount in microAlgo
 * @returns {number} Amount in ALGO
 */
export const microToAlgo = (microAlgo) => {
  return microAlgo / 1e6;
};

/**
 * Convert ALGO to microAlgo
 * @param {number} algo - Amount in ALGO
 * @returns {number} Amount in microAlgo
 */
export const algoToMicro = (algo) => {
  return Math.round(algo * 1e6);
};

/**
 * Calculate equal split among members
 * @param {number} totalAmount - Total amount to split
 * @param {number} members - Number of members
 * @returns {number} Amount per member
 */
export const calculateSplit = (totalAmount, members) => {
  if (members <= 0) return 0;
  return totalAmount / members;
};

/**
 * Create Algorand standard transaction
 * @param {string} signer - Signer address
 * @param {string} receiver - Receiver address
 * @param {number} amount - Amount in ALGO
 * @param {object} params - Transaction parameters
 * @returns {object} Transaction object
 */
export const createPaymentTransaction = (signer, receiver, amount, params) => {
  const microAlgoAmount = algoToMicro(amount);
  
  return algosdk.makePaymentTxnWithSuggestedParams(
    signer,
    receiver,
    microAlgoAmount,
    undefined,
    undefined,
    params
  );
};

/**
 * Create application call transaction
 * @param {string} signer - Signer address
 * @param {number} appId - Application ID
 * @param {Array} appArgs - Application arguments
 * @param {Array} accounts - Foreign accounts
 * @param {object} params - Transaction parameters
 * @returns {object} Transaction object
 */
export const createAppCallTransaction = 
  (signer, appId, appArgs, accounts, params) => {
  
  return algosdk.makeApplicationNoOpTxn(
    signer,
    appId,
    appArgs,
    accounts,
    [],
    [],
    [],
    params
  );
};

/**
 * Calculate settlements from expense list
 * @param {Array} expenses - List of expenses
 * @returns {Array} List of settlements (who owes whom)
 */
export const calculateSettlements = (expenses) => {
  const balances = {};
  
  // Calculate net balance for each person
  expenses.forEach(expense => {
    const { paidBy, amount, splitBetween } = expense;
    
    if (!balances[paidBy]) balances[paidBy] = 0;
    balances[paidBy] += amount;
    
    const splitAmount = amount / splitBetween.length;
    splitBetween.forEach(person => {
      if (!balances[person]) balances[person] = 0;
      balances[person] -= splitAmount;
    });
  });
  
  // Generate settlement transactions
  const settlements = [];
  const debtors = Object.entries(balances).filter(([_, balance]) => balance < -0.001);
  const creditors = Object.entries(balances).filter(([_, balance]) => balance > 0.001);
  
  // Simple matching algorithm
  debtors.forEach(([debtor, debtAmount]) => {
    creditors.forEach(([creditor, creditAmount]) => {
      if (debtAmount < -0.001 && creditAmount > 0.001) {
        const settlement = Math.min(Math.abs(debtAmount), creditAmount);
        settlements.push({
          from: debtor,
          to: creditor,
          amount: settlement
        });
      }
    });
  });
  
  return settlements;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount, currency = 'Ⓐ') => {
  return `${currency} ${parseFloat(amount).toFixed(3)}`;
};

/**
 * Generate unique group ID
 * @returns {string} Unique ID
 */
export const generateGroupId = () => {
  return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate expense object
 * @param {object} expense - Expense to validate
 * @returns {object} Validation result { valid: boolean, errors: Array }
 */
export const validateExpense = (expense) => {
  const errors = [];
  
  if (!expense.description || expense.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!expense.amount || expense.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!expense.paidBy || !isValidAlgorandAddress(expense.paidBy)) {
    errors.push('Valid payer address is required');
  }
  
  if (!expense.splitBetween || expense.splitBetween.length === 0) {
    errors.push('At least one person must share this expense');
  }
  
  expense.splitBetween?.forEach(addr => {
    if (!isValidAlgorandAddress(addr)) {
      errors.push(`Invalid address: ${addr}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  isValidAlgorandAddress,
  formatAddress,
  microToAlgo,
  algoToMicro,
  calculateSplit,
  createPaymentTransaction,
  createAppCallTransaction,
  calculateSettlements,
  formatCurrency,
  generateGroupId,
  validateExpense
};
