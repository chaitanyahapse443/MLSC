# 🚀 Running Campus Expense Splitter

Complete guide to running the application locally.

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 14 or higher  
- **npm**: 6 or higher
- **RAM**: 2GB minimum
- **Disk**: 500MB free space
- **Browser**: Chrome, Firefox, Safari, Edge (latest)
- **OS**: Windows, macOS, Linux

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

```bash
cd e:\MLSC\campus-expense-splitter
```

### Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `algosdk` - Algorand Python SDK
- `pyteal` - Smart contract language
- `python-dotenv` - Environment configuration
- `requests` - HTTP library

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

This may take 2-3 minutes. Wait for completion.

### Step 4: Configure Environment Variables

**Backend (.env in root directory):**

```bash
# For testnet (recommended for testing)
ALGOD_ADDRESS=https://testnet-api.algonode.cloud
ALGOD_TOKEN=
CREATOR_MNEMONIC=YOUR_MNEMONIC_PHRASE_HERE
NETWORK=testnet
APP_ID=0
```

**Frontend (frontend/.env):**

```bash
# Algorand Network Configuration
REACT_APP_ALGORAND_SERVER=https://testnet-api.algonode.cloud
REACT_APP_ALGORAND_PORT=443
REACT_APP_NETWORK=testnet

# Will be updated after deployment
REACT_APP_APP_ID=0
REACT_APP_CREATOR_ADDRESS=
```

### Step 5: Compile Smart Contract

```bash
cd contracts
python compile.py
cd ..
```

Expected output:
```
✅ Contract compiled successfully!
📁 Approval program: build/approval.teal
📁 Clear state program: build/clear.teal
```

### Step 6: Deploy Smart Contract (Optional but Recommended)

```bash
python scripts/deploy_contract.py
```

**Prerequisites:**
- Have CREATOR_MNEMONIC in .env (your wallet's recovery phrase)
- Have test ALGO in your account (get from faucet: https://testnet-dispenser.rand-labs.io)

**After Deployment:**
- Save the App ID shown in output
- Update `REACT_APP_APP_ID` in `frontend/.env`

### Step 7: Start Frontend Development Server

```bash
cd frontend
npm start
```

Expected output:
```
✔ Compiled successfully!

You can now view campus-expense-splitter in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 8: Open in Browser

The app should automatically open at **http://localhost:3000**

If not, manually navigate to: **http://localhost:3000**

---

## 🎮 Using the Application

### 1. Connect Wallet

1. Click **"🔗 Connect Wallet"** button
2. Install **PeraWallet** or **MyAlgoConnect** if not already installed
3. Approve the connection request
4. Your wallet address will appear

### 2. Create a Group

1. Click **"💰 Create Group"**
2. Enter group name (e.g., "Road Trip")
3. Add member addresses (one per line)
4. Click **"➕ Create Group"**

### 3. Add an Expense

1. Click **"➕ Add Expense"**
2. Enter description (e.g., "Gas")
3. Enter amount in ALGO
4. List people who should split this expense
5. Click **"💾 Add Expense"**

### 4. Settle Up

1. Check **"🤝 Settle Up"** section
2. See calculated settlements
3. Click **"✔️ Pay Now"** to process payment
4. Confirm transaction in wallet

---

## 🐛 Troubleshooting

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

Then restart the server.

### Issue: Wallet Won't Connect

**Checklist:**
- [ ] Wallet extension installed
- [ ] On correct network (testnet)
- [ ] Browser console shows no errors
- [ ] Try incognito/private window
- [ ] Restart browser

### Issue: "Cannot find module 'pyteal'"

**Solution:**
```bash
pip install --upgrade pyteal
```

### Issue: Deployment Fails with "No account found"

**Solution:**
1. Get test ALGO from faucet
2. Wait 5-10 seconds for confirmation
3. Update CREATOR_MNEMONIC in .env
4. Retry deployment

### Issue: Transaction Pending

**Solution:**
- Wait 5-10 seconds
- Refresh browser
- Check transaction status in explorer
- Testnet sometimes has delays

### Issue: "REACT_APP_APP_ID is 0"

**Solution:**
1. Run `python scripts/deploy_contract.py`
2. Note the App ID from output
3. Update `REACT_APP_APP_ID` in `frontend/.env`
4. Restart npm start

---

## 🔍 Viewing Transactions

### Testnet Explorer

View your transactions at:
- **AlgoExplorer**: https://testnet.algoexplorer.io
- **AlgoScan**: https://testnet.algoscan.app

### In Browser

1. Open Developer Console: `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Look for transaction IDs and logs
4. Paste transaction ID in explorer to verify

---

## 🛑 Stopping the Server

### Normal Stop
```
Press Ctrl+C in the terminal running 'npm start'
```

### Force Stop (if needed)

**Windows:**
```bash
taskkill /F /IM node.exe
```

**macOS/Linux:**
```bash
killall node
```

---

## 📊 Development Workflow

### Making Changes

1. Edit React files in `frontend/src/`
2. Browser automatically refreshes
3. Changes appear instantly

### Debugging

```javascript
// Add to any component
console.log('Debug message:', variable);

// Check Algorand client
import { algodClient } from './algorand/client';
algodClient.suggestedParams().then(params => console.log(params));
```

### Testing Smart Contract

```bash
cd contracts
python -c "from expense_app import approval_program; print(approval_program())"
cd ..
```

---

## ⚡ Quick Commands Reference

```bash
# Install dependencies
npm install                          # Frontend
pip install -r requirements.txt      # Backend

# Compile contract
python contracts/compile.py

# Deploy contract
python scripts/deploy_contract.py

# Start frontend
npm start                            # from frontend directory

# Stop frontend
Ctrl+C

# Update frontend/.env after deployment
# then restart npm start

# View test ALGO faucet
https://testnet-dispenser.rand-labs.io

# View transactions
https://testnet.algoexplorer.io
```

---

## 💡 Tips & Tricks

### Faster Development
- Use browser DevTools for debugging
- Keep browser console open
- Use React DevTools extension
- Edit contract without full redeploy (if possible)

### Testing Multiple Accounts
1. Create 2-3 accounts in wallet
2. Switch accounts to test group functionality
3. Transfer test ALGO between accounts

### Debugging Transactions
```javascript
// In browser console
const txn = // your transaction
console.log('Transaction:', txn)
console.log('App ID:', txn.appIndex)
console.log('Sender:', txn.txn.snd)
```

### Checking Account Balance
```javascript
import { getAccountInfo } from './algorand/client';
getAccountInfo('ALGO_ADDRESS')
  .then(info => console.log('Balance:', info.amount / 1e6))
```

---

## 🚀 Next Steps After Setup



## 📝 Environment Checklist

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for common tasks
2. ✅ Check [README.md](README.md) for full documentation  
3. ✅ Explore smart contract code in `contracts/`
4. ✅ Customize UI in `frontend/src/`
5. ✅ Deploy to production (coming soon)

---

## ✅ Real-Time Testing Guide (Data Persistence)

### Quick Test - Verify Data Saves and Persists

**Step 1: Open the App**
- Navigate to `http://localhost:3000`
- Wait for "⏳ Loading data..." message to disappear
- Press `F12` to open Developer Console

**Step 2: Connect Wallet**
- Click "Connect Wallet" button
- Select any test account (3 accounts available)
- Verify console shows: `👤 User address: [address]`

**Step 3: Create a Test Group**
- Click "Create a Group"
- Enter group name: `Test Group` 
- Enter member addresses (3-4 test addresses shown)
- Click "Create Group"
- In console, verify: `📝 Creating new group: {...}`

**Step 4: Add an Expense**
- Select the group from "Active Groups" list
- Click "Add an Expense"
- Description: `Lunch`
- Amount: `10` ALGO
- Payer: Select connected address
- Members: Check all members
- Click "Add Expense"
- In console, verify: `📝 Creating new expense: {...}`

**Step 5: Check Storage Contents**
- Click "📊 Check Storage (see Console)" button
- In console, you'll see:
  ```
  Groups in state: 1
  Expenses in state: 1
  Groups in localStorage: [...]
  Expenses in localStorage: [...]
  ```

**Step 6: **THE REAL TEST** - Refresh Page**
- Press `Ctrl + R` (or Cmd + R on Mac) to refresh
- Wait for "⏳ Loading data..." message
- **✅ SUCCESS**: Your group and expense should still be there!
- In console you should see: `🔄 App mounted - loading data from localStorage...`

**Step 7: Verify Multiple Refreshes**
- Add 2-3 more expenses
- Refresh page again
- All expenses should persist
- Click "Check Storage" after each refresh

### Troubleshooting Real-Time Issues

| Problem | Solution |
|---------|----------|
| Data disappeared after refresh | Click "Check Storage" button to see console logs. Data should show in localStorage |
| "Loading data..." stuck forever | Close browser console, refresh page, check for JavaScript errors in console |
| Groups created but not showing | Make sure `dataLoaded` state is true - wait for loading to complete |
| Multiple refreshes lose data | Check localStorage keys are `campus_groups` and `campus_expenses` (not old names) |
| Console shows undefined | Verify test account is selected before creating group/expense |

### Browser Storage Inspection (Advanced)

**Chrome/Edge/Firefox Developer Tools:**

1. Press `F12` → Go to "Application" tab (Chrome/Edge) or "Storage" tab (Firefox)
2. Click "Local Storage" → Select `http://localhost:3000`
3. You'll see two keys:
   - `campus_groups` - contains your group data as JSON
   - `campus_expenses` - contains your expense data as JSON

**Clear All Data (if needed):**
- On the app, scroll to "💾 Data Storage" section
- Click "🗑️ Clear All Data" button
- Or in DevTools Storage tab, select and delete `campus_groups` and `campus_expenses` keys

### Manual Console Testing

In browser console (F12 → Console tab), run:

```javascript
// Check what's in localStorage
console.log(JSON.parse(localStorage.getItem('campus_groups')));
console.log(JSON.parse(localStorage.getItem('campus_expenses')));

// Check storage size
console.log('Storage size:', new Blob(Object.values(localStorage)).size, 'bytes');

// Manually add test data
localStorage.setItem('campus_groups', JSON.stringify([{
  id: Date.now(),
  name: 'Test Group',
  members: ['AAAA...Y5HVY'],
  createdAt: new Date().toLocaleString()
}]));

// Refresh to see it load
location.reload();
```

---

## 📝 Environment Checklist
Before running, verify:
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node 14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Created .env file with ALGOD_ADDRESS
- [ ] Created frontend/.env file
- [ ] Downloaded test ALGO from faucet
- [ ] PeraWallet or MyAlgoConnect installed
- [ ] Port 3000 is free

---

## 🤝 Getting Help

If you encounter issues:

1. Check console for error messages
2. Review troubleshooting section above
3. Check Algorand docs: https://developer.algorand.org
4. Review PyTeal docs: https://pyteal.readthedocs.io
5. Check browser DevTools

---

**Happy Building! 💚**
