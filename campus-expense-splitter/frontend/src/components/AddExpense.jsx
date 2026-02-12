// Add Expense Component
// Allows users to add expenses to a group

import React, { useState } from 'react';

function AddExpense({ userAddress, selectedGroup, onExpenseAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(userAddress);
  const [splitBetween, setSplitBetween] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!userAddress) {
        setError('Please connect your wallet first');
        return;
      }

      if (!description.trim()) {
        setError('Please enter expense description');
        return;
      }

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (!splitBetween.trim()) {
        setError('Please specify who this expense is split between');
        return;
      }

      // Parse split addresses
      const splitList = splitBetween.split(',').map(m => m.trim()).filter(m => m);
      
      if (splitList.length === 0) {
        setError('Please enter at least one valid address');
        return;
      }

      const expenseAmount = parseFloat(amount);

      console.log('📊 Expense data:', {
        description,
        amount: expenseAmount,
        paidBy: userAddress,
        splitBetween: splitList
      });

      setSuccess(`✅ Expense "${description}" (${expenseAmount} ALGO) added successfully!`);
      setDescription('');
      setAmount('');
      setSplitBetween('');

      if (onExpenseAdded) {
        onExpenseAdded({ 
          description, 
          amount: expenseAmount, 
          paidBy: userAddress, 
          splitBetween: splitList 
        });
      }

    } catch (err) {
      console.error('Error adding expense:', err);
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense">
      <h2>➕ Add Expense</h2>
      <form onSubmit={handleAddExpense}>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            placeholder="e.g., Gas, Food, Hotel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (ALGO):</label>
          <input
            id="amount"
            type="number"
            step="0.001"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="paidBy">Paid By:</label>
          <input
            id="paidBy"
            type="text"
            value={userAddress || 'Not connected'}
            disabled
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="splitBetween">Split Between (addresses):</label>
          <textarea
            id="splitBetween"
            placeholder="ALGO_ADDR_1, ALGO_ADDR_2, ALGO_ADDR_3"
            value={splitBetween}
            onChange={(e) => setSplitBetween(e.target.value)}
            disabled={loading}
            rows="3"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Adding...' : '💾 Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
