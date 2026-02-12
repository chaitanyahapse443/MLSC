# 🛠️ Development Guide

Complete guide for developers working on Campus Expense Splitter.

## Project Architecture

### Backend (Python)

```
contracts/
├── expense_app.py       # Smart contract (PyTeal)
├── compile.py           # TEAL compiler
└── build/              # Compiled TEAL output

scripts/
└── deploy_contract.py  # Deployment to Algorand
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── algorand/       # Blockchain integration
│   ├── App.jsx         # Main component
│   ├── index.js        # Entry point
│   └── styles.css      # Styling
├── public/             # Static files
└── package.json        # Dependencies
```

---

## Smart Contract Development

### PyTeal Basics

Smart contract located in `contracts/expense_app.py`

```python
from pyteal import *

def approval_program():
    # Contract logic here
    return program
```

### Common Operations

**Store data:**
```python
App.globalPut(key, value)      # Global state
App.localPut(txn.sender(), key, value)  # Local state
```

**Read data:**
```python
App.globalGet(key)
App.localGet(txn.sender(), key)
```

**Conditional logic:**
```python
Cond(
  [condition1, action1],
  [condition2, action2],
  [condition3, action3]
)
```

### Testing Smart Contract

```bash
# Compile contract
cd contracts
python compile.py

# Check output
cat build/approval.teal
```

### Deploying Changes

```bash
# 1. Modify contract
# Edit contracts/expense_app.py

# 2. Compile
python contracts/compile.py

# 3. Deploy
python scripts/deploy_contract.py

# 4. Update frontend
# Copy new APP_ID to frontend/.env
# Restart frontend
```

---

## Frontend Development

### React Component Structure

```jsx
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Run when component mounts/updates
  }, [dependencies]);
  
  return <div>Component JSX</div>;
}

export default MyComponent;
```

### Algorand Integration

```jsx
import { algodClient } from '@/algorand/client';
import { ALGORAND_CONFIG } from '@/algorand/config';

async function getAccountInfo(address) {
  const info = await algodClient.accountInformation(address).do();
  return info;
}
```

### State Management

For complex state, consider using React Context:

```jsx
const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
```

### Component Best Practices

```jsx
// Good: Functional component with hooks
function GoodComponent() {
  const [state, setState] = useState('');
  
  return <div>{state}</div>;
}

// Bad: Too much logic in render
function BadComponent() {
  // Lots of business logic mixed with UI
}

// Best: Separate concerns
function BestComponent() {
  const data = useCustomHook();
  return <UI data={data} />;
}
```

---

## Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Connect/disconnect wallet
- [ ] Create group with valid addresses
- [ ] Add expense to new group
- [ ] Verify settlements calculated correctly
- [ ] Process payment transaction
- [ ] Check transaction in explorer

### Debug Mode

Enable debug logging:

```javascript
// Add to any component
if (process.env.REACT_APP_DEBUG === 'true') {
  console.log('Debug:', value);
}
```

---

## Code Style Guide

### Python

Follow PEP 8:
```python
# Good
def create_transaction(sender, receiver, amount):
    """Create a transaction."""
    txn = make_transaction(sender, receiver, amount)
    return txn

# Bad
def createTransaction(sender,receiver,amount):
    txn=make_transaction(sender,receiver,amount)
    return txn
```

### JavaScript

Use consistent formatting:
```javascript
// Good
function handleClick() {
  console.log('Clicked!');
}

const items = array.map(item => item.value);

// Bad
function handleClick(){console.log("Clicked!")}
const items = array.map(item=>item.value)
```

### React Components

```jsx
// Good: Clear naming and structure
function ConnectWallet({ onWalletConnected }) {
  const [address, setAddress] = useState('');
  
  const handleConnect = async () => {
    // Implementation
  };
  
  return (
    <button onClick={handleConnect}>
      Connect Wallet
    </button>
  );
}

// Bad: Unclear naming
function Comp({ onClick }) {
  const [s, setS] = useState('');
  
  return <button onClick={onClick}>Connect</button>;
}
```

---

## Common Development Tasks

### Adding a New Component

1. Create file: `frontend/src/components/MyComponent.jsx`
2. Implement component with proper state
3. Export in App.jsx
4. Add styling to `styles.css`
5. Test integration

### Modifying Smart Contract

1. Edit `contracts/expense_app.py`
2. Test logic (if possible)
3. Run `python contracts/compile.py`
4. Verify TEAL output in `build/`
5. Deploy with `python scripts/deploy_contract.py`
6. Update APP_ID in frontend

### Debugging Transactions

```javascript
// In browser console
console.log('Transaction:', txn);

// Check specific fields
console.log('Sender:', txn.txn.snd);
console.log('App ID:', txn.appIndex);
console.log('Args:', txn.appArgs);
```

### Performance Optimization

```jsx
// Use memo for expensive components
const ExpensiveComponent = React.memo(function Component(props) {
  // Only re-renders if props change
  return <div>{props.value}</div>;
});

// Use callback to avoid recreating functions
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

---

## Deployment

### Development Environment
- Local Algorand node or testnet
- Hot reload with npm start
- Browser DevTools for debugging

### Staging Environment
- Algorand testnet
- Faucet for test ALGO
- Manual testing workflow

### Production Environment
- Algorand mainnet
- Real ALGO
- Security audit recommended
- Backup and recovery procedures

---

## Security Best Practices

### Smart Contract

```python
# Always validate inputs
Assert(Txn.amount() > Int(0), "Invalid amount")

# Check authorization
Assert(Txn.sender() == authorized_address)

# Prevent reentrancy
# Use InnerTxn carefully
```

### Frontend

```javascript
// Never expose private keys
// ✗ Don.localStoredPrivateKey
// ✓ Use wallet extension

// Validate addresses
if (!isValidAlgorandAddress(address)) {
  return error;
}

// Sanitize input
const description = userInput.trim();
```

---

## Troubleshooting Development Issues

### Smart Contract Won't Compile

```bash
# Check Python version
python --version  # Should be 3.8+

# Update PyTeal
pip install --upgrade pyteal

# Check for syntax errors
python -m py_compile contracts/expense_app.py
```

### Frontend Won't Start

```bash
# Clear cache
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Check Node version
node --version  # Should be 14+
```

### Transaction Always Fails

```javascript
// Check:
1. Account has sufficient balance
2. App ID is valid
3. Address is valid
4. Parameters are correct
5. Network is correct (testnet vs mainnet)
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-expense-filter

# Make changes
# Test thoroughly

# Commit with clear message
git commit -m "Add expense filter UI component"

# Push to remote
git push origin feature/add-expense-filter

# Create Pull Request
# Request review
# Merge after approval
```

---

## Documentation

### Code Comments

```python
def complex_calculation(x, y):
    """Calculate something complex.
    
    Args:
        x: First parameter
        y: Second parameter
        
    Returns:
        Calculated result
    """
    # Important detail
    result = x * y
    return result
```

### Inline Documentation

```markdown
# Feature Name

## Description
What this feature does

## Usage
```

---

## Resources

- **Algorand Python SDK**: https://github.com/algorand/py-algorand-sdk
- **PyTeal**: https://github.com/algorand/pyteal
- **React Hooks**: https://react.dev/reference/react
- **Algorand Docs**: https://developer.algorand.org

---

**Happy Coding! 💚**
