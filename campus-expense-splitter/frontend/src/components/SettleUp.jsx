// Settle Up Component
// Displays settlement amounts and handles payment transfers

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

function SettleUp({ userAddress, expenses = [], onSettlementPaid }) {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate who owes whom
  useEffect(() => {
    calculateSettlements();
  }, [expenses]);

  const calculateSettlements = () => {
    if (expenses.length === 0) {
      setSettlements([]);
      return;
    }

    // Map to track balances
    const balances = {};

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
    const settlementList = [];
    Object.entries(balances).forEach(([person, balance]) => {
      if (balance < -0.001) { // Owes money (negative balance)
        const creditor = Object.entries(balances).find(([p, b]) => b > 0.001)?.[0];
        if (creditor) {
          settlementList.push({
            from: person,
            to: creditor,
            amount: Math.abs(balance)
          });
        }
      }
    });

    setSettlements(settlementList);
  };

  // Modal & payment flow state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSettlement, setModalSettlement] = useState(null);
  const [modalAmount, setModalAmount] = useState(0);

  const openPaymentModal = (settlement) => {
    setModalSettlement(settlement);
    setModalAmount(Number(Number(settlement.amount).toFixed(6)));
    setModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closePaymentModal = () => {
    setModalOpen(false);
    setModalSettlement(null);
    setModalAmount(0);
  };

  const handleConfirmPayment = async (settlement, paidAmount) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!userAddress) {
        setError('Please connect your wallet first');
        return;
      }

      if (settlement.from !== userAddress) {
        setError('You can only settle your own payments');
        return;
      }

      const amountNum = Number(paidAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      console.log('💳 Settlement (confirmed):', {
        from: settlement.from,
        to: settlement.to,
        amount: amountNum
      });

      // Create a local "settlement" expense for the paid amount so the app state reflects the payment.
      const settlementExpense = {
        id: Date.now(),
        description: `Settlement to ${settlement.to}`,
        amount: Number(Number(amountNum).toFixed(6)),
        paidBy: settlement.from,
        splitBetween: [settlement.to],
        createdAt: new Date().toLocaleString()
      };

      if (typeof onSettlementPaid === 'function') {
        onSettlementPaid(settlementExpense);
      }

      setSuccess(`✅ Recorded payment of ${amountNum.toFixed(3)} ALGO to ${settlement.to.slice(0,10)}...`);
      closePaymentModal();

    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settle-up">
      <h2>🤝 Settle Up</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {settlements.length === 0 ? (
        <div className="info-box">
          <p>No unsettled expenses yet. Add expenses to see settlements.</p>
        </div>
      ) : (
        <div className="settlements-list">
          {settlements.map((settlement, idx) => (
            <div key={idx} className="settlement-item">
              <div className="settlement-details">
                <span className="settlement-from">
                  {settlement.from.slice(0, 10)}...
                </span>
                <span className="arrow">→ owes →</span>
                <span className="settlement-to">
                  {settlement.to.slice(0, 10)}...
                </span>
                <span className="settlement-amount">
                  <strong>{settlement.amount.toFixed(3)} ALGO</strong>
                </span>
              </div>
              {settlement.from === userAddress && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => openPaymentModal(settlement)}
                    disabled={loading}
                  >
                    {loading ? '⏳ Processing...' : '✔️ Pay Now'}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Payment Modal */}
      {modalOpen && modalSettlement && (
        <div className="modal-overlay" onClick={closePaymentModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Pay {modalSettlement.to.slice(0,10)}... </h3>
            <p>Amount due: <strong>{modalSettlement.amount.toFixed(6)} ALGO</strong></p>
            <label style={{display:'block',marginTop:8}}>Amount to pay (ALGO)</label>
            <input
              type="number"
              step="0.000001"
              min="0"
              max={modalSettlement.amount}
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              style={{width:'100%',padding:'8px',marginTop:6}}
            />

            <div style={{marginTop:12, textAlign:'center'}}>
              <p style={{fontSize:'0.9em', color:'#555'}}>Scan this QR from your wallet to pay:</p>
              <div style={{background:'#fff',display:'inline-block',padding:12,borderRadius:8}}>
                <QRCode value={`algorand:${modalSettlement.to}?amount=${modalAmount}`} size={180} />
              </div>
              <p style={{fontSize:'0.85em', color:'#333', marginTop:8}}>
                URI: <span style={{wordBreak:'break-all'}}>{`algorand:${modalSettlement.to}?amount=${modalAmount}`}</span>
              </p>
              <div style={{marginTop:10}}>
                <button onClick={() => navigator.clipboard.writeText(`algorand:${modalSettlement.to}?amount=${modalAmount}`)} style={{marginRight:8}}>Copy URI</button>
                <button onClick={() => handleConfirmPayment(modalSettlement, modalAmount)} className="btn btn-primary">Confirm Paid</button>
                <button onClick={closePaymentModal} style={{marginLeft:8}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettleUp;
