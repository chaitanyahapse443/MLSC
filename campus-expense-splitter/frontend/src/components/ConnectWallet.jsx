// Connect Wallet Component
// Handles wallet connection with mock simulator (no extensions needed)

import React, { useState } from 'react';

function ConnectWallet({ onWalletConnected }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMock, setShowMock] = useState(false);

  // Mock test accounts (for testing without wallet extension)
  const MOCK_ACCOUNTS = [
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY',
    'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBZ4WYPA',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC4QCYA',
  ];

  // Connect with actual wallet (if available)
  const connectWithWallet = async () => {
    try {
      setLoading(true);
      
      // Try PeraWallet
      if (window.peraWallet) {
        const accounts = await window.peraWallet.connect();
        const userAccount = accounts[0];
        setAddress(userAccount);
        setConnected(true);
        if (onWalletConnected) onWalletConnected(userAccount);
        console.log('✅ Connected with PeraWallet:', userAccount);
        return;
      }
      
      // Try AlgoSigner
      if (window.AlgoSigner) {
        const accounts = await window.AlgoSigner.connect();
        const userAccount = accounts[0].address;
        setAddress(userAccount);
        setConnected(true);
        if (onWalletConnected) onWalletConnected(userAccount);
        console.log('✅ Connected with AlgoSigner:', userAccount);
        return;
      }
      
      // This will show the mock option
      setShowMock(true);
      
    } catch (error) {
      console.error('❌ Wallet error:', error);
      setShowMock(true);
    } finally {
      setLoading(false);
    }
  };

  // Use mock account for testing
  const connectWithMock = (mockAddress) => {
    setAddress(mockAddress);
    setConnected(true);
    setShowMock(false);
    if (onWalletConnected) {
      onWalletConnected(mockAddress);
    }
    console.log('✅ Mock wallet connected:', mockAddress);
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    setShowMock(false);
  };

  return (
    <div className="connect-wallet">
      <div className="wallet-container">
        {!connected ? (
          <>
            <button 
              className="btn btn-primary" 
              onClick={connectWithWallet}
              disabled={loading}
            >
              {loading ? '🔄 Connecting...' : '🔗 Connect Wallet'}
            </button>
            <p style={{marginTop: '15px', textAlign: 'center', color: '#666', fontSize: '0.9em'}}>
              No wallet extension? Use test account below 👇
            </p>

            {showMock && (
              <div style={{marginTop: '15px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
                <p style={{marginBottom: '10px', fontWeight: 'bold', color: '#333'}}>
                  📋 Select Test Account (for testing):
                </p>
                {MOCK_ACCOUNTS.map((account, idx) => (
                  <button
                    key={idx}
                    onClick={() => connectWithMock(account)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: '#e8f4f8',
                      border: '1px solid #667eea',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85em',
                      textAlign: 'left',
                      wordBreak: 'break-all',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#d0e8f2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#e8f4f8'}
                  >
                    🧪 Test Account {idx + 1}: {account.slice(0, 20)}...
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="wallet-info">
            <div className="wallet-address">
              <label>✅ Connected Account:</label>
              <code>{address}</code>
              <p style={{fontSize: '0.85em', color: '#666', marginTop: '8px'}}>
                {address.includes('Y5HVY') || address.includes('Z4WYPA') || address.includes('4QCYA') 
                  ? '🧪 Test Account (Mock Wallet)' 
                  : '🔐 Real Wallet Connected'}
              </p>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectWallet;
