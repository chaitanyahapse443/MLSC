# Campus Expense Splitter - Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### For First-Time Users

1. **Install dependencies:**
   ```bash
   python setup.py
   ```

2. **Get test ALGO from faucet:**
   - Visit: https://testnet-dispenser.rand-labs.io
   - Paste your Algorand address
   - Request test ALGO (repeat if needed)

3. **Deploy contract:**
   ```bash
   cd scripts
   python deploy_contract.py
   ```

4. **Start the app:**
   ```bash
   cd frontend
   npm start
   ```

5. **Open browser:**
   - Navigate to http://localhost:3000
   - Click "🔗 Connect Wallet"
   - Approve connection in wallet extension
   - Start creating groups and adding expenses!

---

## 🎯 Common Tasks

### Share a Trip Expense

1. Connect wallet
2. Create group: "Europe Trip 2024"
3. Add members' Algorand addresses
4. Add expenses:
   - Hotel: 900 ALGO ÷ 3 people
   - Flights: 500 ALGO ÷ 3 people
   - Food: 300 ALGO ÷ 3 people
5. Click "Settle Up" to see who owes whom
6. Process payments

### Debug Transactions

Check in browser console for:
- Transaction IDs
- Error messages
- Account balances

### Reset Everything

```bash
# Clear build files
rm -rf contracts/build/
rm -rf frontend/node_modules/

# Clear environment
rm -f .env
rm -f frontend/.env

# Reinstall
python setup.py
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Wallet won't connect | Install PeraWallet browser extension |
| "Insufficient funds" | Get test ALGO from faucet |
| Contract deploy fails | Check ALGOD_ADDRESS in .env |
| App shows blank | Clear browser cache, refresh |
| Transactions pending | Wait 5-10 seconds, refresh |

---

## 📊 Example Expenses

```
Group: "Spring Break Road Trip"

Sarah pays $100 for gas (split 4 ways)
→ Everyone owes: $25

Mike pays $240 for hotel (split 3 ways)  
→ Everyone owes: $80

Final settlement:
→ Sarah owes Mike: $55
→ John owes Mike: $80
→ Lisa owes Mike: $80
```

---

## 🔑 Getting Algorand Testnet Account

1. Install **PeraWallet** or **MyAlgoConnect** browser extension
2. Create a new account
3. Save your recovery phrase (12 words) - KEEP IT SAFE!
4. Get your public address (starts with A...)
5. Request test ALGO from faucet

---

## 📱 Saving Deployment Info

After running `python scripts/deploy_contract.py`:

1. Check for `frontend/.env.local`
2. Note the APP_ID and CREATOR_ADDRESS
3. Share APP_ID with other users
4. Update REACT_APP_APP_ID in frontend/.env

---

## 🚀 Production Deployment

Coming soon! For now, everything is on Algorand Testnet.

---

**Questions? Issues? Check the full README.md**
