// Main App Component
// Root component for the campus expense splitter application

import React, { useState, useEffect } from 'react';
import './styles.css';
import ConnectWallet from './components/ConnectWallet';
import CreateGroup from './components/CreateGroup';
import AddExpense from './components/AddExpense';
import SettleUp from './components/SettleUp';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('🔄 App mounted - loading data from localStorage...');
    
    try {
      // Try new keys first
      const savedGroups = localStorage.getItem('campus_groups');
      const savedExpenses = localStorage.getItem('campus_expenses');

      console.log('📦 Saved groups (campus_groups):', savedGroups);
      console.log('📦 Saved expenses (campus_expenses):', savedExpenses);

      // Helper to try parsing different possible keys (migration/fallback)
      const tryParse = (value) => {
        try {
          return value ? JSON.parse(value) : null;
        } catch (e) {
          return null;
        }
      };

      let loadedGroups = tryParse(savedGroups);
      let loadedExpenses = tryParse(savedExpenses);

      // Fallback keys (in case of older versions or origin differences)
      const fallbackGroupKeys = ['expenseGroups', 'groups', 'my_groups'];
      const fallbackExpenseKeys = ['expenses', 'my_expenses', 'expense_list'];

      if (!loadedGroups) {
        for (const k of fallbackGroupKeys) {
          const v = localStorage.getItem(k);
          if (v) {
            loadedGroups = tryParse(v);
            console.log(`⚙️ Migrated groups from key: ${k}`);
            break;
          }
        }
      }

      if (!loadedExpenses) {
        for (const k of fallbackExpenseKeys) {
          const v = localStorage.getItem(k);
          if (v) {
            loadedExpenses = tryParse(v);
            console.log(`⚙️ Migrated expenses from key: ${k}`);
            break;
          }
        }
      }

      if (loadedGroups) {
        console.log('✅ Loaded groups:', loadedGroups);
        setGroups(loadedGroups);
      }

      if (loadedExpenses) {
        console.log('✅ Loaded expenses:', loadedExpenses);
        setExpenses(loadedExpenses);
      }
      
      setDataLoaded(true);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setDataLoaded(true);
    }
  }, []);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (!dataLoaded) return; // Don't save before data is loaded
    
    try {
      console.log('💾 Saving groups:', groups);
      const json = JSON.stringify(groups);
      localStorage.setItem('campus_groups', json);
      // write a backup copy to help recover after unexpected resets
      localStorage.setItem('campus_groups_backup', json);
      console.log('✅ Groups saved successfully');
    } catch (error) {
      console.error('❌ Error saving groups:', error);
    }
  }, [groups, dataLoaded]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!dataLoaded) return; // Don't save before data is loaded
    
    try {
      console.log('💾 Saving expenses:', expenses);
      const json = JSON.stringify(expenses);
      localStorage.setItem('campus_expenses', json);
      // write a backup copy to help recover after unexpected resets
      localStorage.setItem('campus_expenses_backup', json);
      console.log('✅ Expenses saved successfully');
    } catch (error) {
      console.error('❌ Error saving expenses:', error);
    }
  }, [expenses, dataLoaded]);

  const restoreFromBackup = () => {
    const groupsBackup = localStorage.getItem('campus_groups_backup');
    const expensesBackup = localStorage.getItem('campus_expenses_backup');
    if (!groupsBackup && !expensesBackup) {
      alert('No backup found in localStorage.');
      return;
    }

    if (groupsBackup) {
      try { setGroups(JSON.parse(groupsBackup)); console.log('✅ Restored groups from backup'); } catch (e) { console.error(e); }
    }
    if (expensesBackup) {
      try { setExpenses(JSON.parse(expensesBackup)); console.log('✅ Restored expenses from backup'); } catch (e) { console.error(e); }
    }
    alert('Restored data from backup.');
  };

  const handleWalletConnected = (address) => {
    setUserAddress(address);
    console.log('👤 User address:', address);
  };

  const handleGroupCreated = (group) => {
    // Add timestamp and id to group
    const newGroup = {
      ...group,
      id: Date.now(),
      createdAt: new Date().toLocaleString()
    };
    console.log('📝 Creating new group:', newGroup);
    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup);
  };

  const handleExpenseAdded = (expense) => {
    // Add timestamp and id to expense
    const newExpense = {
      ...expense,
      id: Date.now(),
      createdAt: new Date().toLocaleString()
    };
    console.log('📝 Creating new expense:', newExpense);
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteGroup = (groupId) => {
    console.log('🗑️ Deleting group:', groupId);
    setGroups(groups.filter(g => g.id !== groupId));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    console.log('🗑️ Deleting expense:', expenseId);
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  const checkStorage = () => {
    console.log('📊 === STORAGE CHECK ===');
    console.log('Groups in state:', groups.length);
    console.log('Expenses in state:', expenses.length);
    console.log('Groups in localStorage:', localStorage.getItem('campus_groups'));
    console.log('Expenses in localStorage:', localStorage.getItem('campus_expenses'));
    console.log('========================');
  };

  if (!dataLoaded) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🏫 Campus Expense Splitter</h1>
          <p style={{ margin: '10px 0', opacity: 0.8 }}>⏳ Loading data...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏫 Campus Expense Splitter</h1>
        <p className="subtitle">Blockchain-powered group expense management</p>
      </header>

      <main className="main-container">
        <div className="container">
          {/* Wallet Connection Section */}
          <section className="section">
            <ConnectWallet onWalletConnected={handleWalletConnected} />
          </section>

          {/* Main Content */}
          {userAddress ? (
            <>
              {/* Create Group Section */}
              <section className="section">
                <CreateGroup 
                  userAddress={userAddress}
                  onGroupCreated={handleGroupCreated}
                />
              </section>

              {/* Active Groups Display */}
              {groups.length > 0 && (
                <section className="section">
                  <h2>👥 Active Groups ({groups.length})</h2>
                  <div className="groups-list">
                    {groups.map((group, idx) => (
                      <div 
                        key={group.id} 
                        className="group-card"
                        onClick={() => setSelectedGroup(group)}
                      >
                        <h3>{group.name}</h3>
                        <p>{group.members.length} members</p>
                        <p style={{fontSize: '0.8em', color: '#999'}}>
                          Created: {group.createdAt}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                          style={{
                            marginTop: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Add Expense Section */}
              <section className="section">
                <AddExpense 
                  userAddress={userAddress}
                  selectedGroup={selectedGroup}
                  onExpenseAdded={handleExpenseAdded}
                />
              </section>

              {/* Settle Up Section */}
              <section className="section">
                <SettleUp 
                  userAddress={userAddress}
                  expenses={expenses}
                  onSettlementPaid={handleExpenseAdded}
                />
              </section>

              {/* Expense History */}
              {expenses.length > 0 && (
                <section className="section">
                  <h2>📊 Expense History ({expenses.length})</h2>
                  <div className="expenses-list">
                    {expenses.map((expense, idx) => (
                      <div key={expense.id} className="expense-item">
                        <div>
                          <strong>{expense.description}</strong>
                          <p>Paid by: {expense.paidBy.slice(0, 10)}...</p>
                          <p style={{fontSize: '0.85em', color: '#666'}}>
                            {expense.createdAt}
                          </p>
                        </div>
                        <div className="expense-amount">
                          {expense.amount.toFixed(3)} ALGO
                        </div>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Storage Info */}
              <section className="section" style={{backgroundColor: '#f0f8ff'}}>
                <h3 style={{color: '#667eea', marginBottom: '10px'}}>💾 Data Storage</h3>
                <p style={{margin: '5px 0', fontSize: '0.9em', color: '#666'}}>
                  ✅ Groups: {groups.length}
                </p>
                <p style={{margin: '5px 0', fontSize: '0.9em', color: '#666'}}>
                  ✅ Expenses: {expenses.length}
                </p>
                <p style={{margin: '10px 0', fontSize: '0.85em', color: '#999'}}>
                  📌 Data is automatically saved in your browser. Refresh the page to verify!
                </p>
                <button
                  onClick={() => checkStorage()}
                  style={{
                    marginRight: '10px',
                    marginTop: '10px',
                    padding: '8px 15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  📊 Check Storage (see Console)
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Restore data from backup? This will overwrite current state.')) {
                      restoreFromBackup();
                    }
                  }}
                  style={{
                    marginRight: '10px',
                    marginTop: '10px',
                    padding: '8px 15px',
                    backgroundColor: '#ffb74d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  ♻️ Restore Backup
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all data?')) {
                      setGroups([]);
                      setExpenses([]);
                      localStorage.removeItem('campus_groups');
                      localStorage.removeItem('campus_expenses');
                      alert('All data cleared!');
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '8px 15px',
                    backgroundColor: '#ff9999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  🗑️ Clear All Data
                </button>
              </section>
            </>
          ) : (
            <section className="section info-section">
              <div className="welcome-box">
                <h2>Welcome to Campus Expense Splitter 🎓</h2>
                <p>Connect your wallet to get started managing group expenses.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>🔗 Built with React | 💚 Open Source | 💾 Data persists in browser storage</p>
      </footer>
    </div>
  );
}

export default App;
