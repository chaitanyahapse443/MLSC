# 🏫 Campus Expense Splitter

A **blockchain-based application** for splitting and managing group expenses on a college campus using **Algorand smart contracts**. Built with React, PyTeal, and Algorand SDK.

## 🌟 Features

- ✅ **Connect Wallet**: Secure Algorand wallet integration (PeraWallet/MyAlgoConnect)
- ✅ **Create Groups**: Form expense-sharing groups with multiple members
- ✅ **Add Expenses**: Track expenses with descriptions, amounts, and split details
- ✅ **Automatic Settlement**: Smart calculations to determine who owes whom
- ✅ **Blockchain Verification**: All transactions recorded on Algorand blockchain
- ✅ **Real-time Updates**: Live state management with React hooks
- ✅ **Responsive Design**: Mobile-friendly UI with gradient design

## 📁 Project Structure

```
campus-expense-splitter/
├── contracts/                  # Smart contracts (PyTeal)
│   ├── expense_app.py         # Main contract logic
│   ├── compile.py             # PyTeal to TEAL compiler
│   └── build/                 # Compiled TEAL files
├── frontend/                   # React UI
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ConnectWallet.jsx
│   │   │   ├── CreateGroup.jsx
│   │   │   ├── AddExpense.jsx
│   │   │   └── SettleUp.jsx
│   │   ├── algorand/          # Blockchain integration
│   │   │   ├── client.js      # Algorand client setup
│   │   │   └── config.js      # Configuration
│   │   ├── App.jsx            # Main app component
│   │   ├── index.js           # React entry point
│   │   └── styles.css         # Styling
│   ├── package.json
│   └── .env.example           # Environment template
├── scripts/
│   ├── deploy_contract.py     # Smart contract deployment
│   └── build/                 # Compiled contracts
├── requirements.txt           # Python dependencies
├── .env.example               # Python env template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**
- **Algorand Testnet Account** (with test ALGO)
- **Wallet Extension** (PeraWallet or MyAlgoConnect)

### 1️⃣ Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3️⃣ Configure Environment Variables

**Backend (.env)**
```bash
cp .env.example .env
# Edit .env with your Algorand configuration
```

**Frontend (frontend/.env)**
```bash
cp frontend/.env.example frontend/.env
# Edit with Algorand network details
```

### 4️⃣ Compile Smart Contract

```bash
cd contracts
python compile.py
cd ..
```

Output:
- ✅ `build/approval.teal` - Approval program
- ✅ `build/clear.teal` - Clear state program

### 5️⃣ Deploy Smart Contract

```bash
python scripts/deploy_contract.py
```

The deployment will:
- Compile PyTeal code to TEAL
- Deploy to Algorand testnet
- Save app ID to `frontend/.env.local`

### 6️⃣ Start Frontend

```bash
cd frontend
npm start
```

The app will open at **http://localhost:3000**

## 💻 Usage

### 1. Connect Wallet
- Click "🔗 Connect Wallet"
- Approve connection in wallet extension
- Your address will be displayed

### 2. Create a Group
- Enter group name (e.g., "Spring Break Trip")
- Add member Algorand addresses
- Click "➕ Create Group"

### 3. Add Expenses
- Describe expense (e.g., "Gas for rental car")
- Enter amount in ALGO
- Specify who should share this expense
- Click "💾 Add Expense"

### 4. Settle Up
- Review calculated settlements
- Click "✔️ Pay Now" to transfer ALGO
- Transactions recorded on blockchain

## 🔧 Smart Contract Methods

### `create_group`
Creates a new expense group
- **Args**: Group name, member addresses
- **Cost**: 0.001 ALGO (transaction fee)

### `add_expense`
Records a new expense
- **Args**: Description, amount, paid by, split between
- **Cost**: 0.001 ALGO (transaction fee)

### `settle_up`
Records a settlement payment
- **Args**: Creditor address
- **Cost**: Varies based on payment amount + 0.001 ALGO fee

## 📊 Example Workflow

```
User A, B, C create group "Dinner"
│
├─ User A adds: "Pizza" - 30 ALGO (split equally)
│  → Each pays 10 ALGO
│
├─ User B adds: "Drinks" - 15 ALGO (A, B only)
│  → Each pays 7.5 ALGO
│
└─ Settlement:
   → A owes B: 7.5 ALGO
   → C pays A: 10 ALGO
```

## 🔐 Security Considerations

- ✅ **Non-custodial**: Private keys never leave your wallet
- ✅ **Blockchain verified**: All transactions on Algorand chain
- ✅ **Group permissions**: Only members can view/modify expenses
- ✅ **Immutable records**: Transactions cannot be altered

## 🛠️ Development

### Build for Production

```bash
cd frontend
npm run build
```

### Run Tests

```bash
cd frontend
npm test
```

### Contract Development

Edit `contracts/expense_app.py` and recompile:
```bash
cd contracts
python compile.py
python ../scripts/deploy_contract.py
```

## 📝 API Reference

### ConnectWallet Component
```jsx
<ConnectWallet onWalletConnected={(address) => {}} />
```

### CreateGroup Component
```jsx
<CreateGroup 
  userAddress="ALGO_ADDRESS"
  onGroupCreated={(group) => {}} 
/>
```

### AddExpense Component
```jsx
<AddExpense 
  userAddress="ALGO_ADDRESS"
  onExpenseAdded={(expense) => {}} 
/>
```

### SettleUp Component
```jsx
<SettleUp 
  userAddress="ALGO_ADDRESS"
  expenses={[]} 
/>
```

## 🐛 Troubleshooting

### Wallet Won't Connect
- ✅ Ensure browser extension is installed
- ✅ Check if you're on testnet
- ✅ Clear browser cache and reload

### Insufficient Funds
- ✅ Transfer test ALGO from faucet: [testnet-dispenser.rand-labs.io](https://testnet-dispenser.rand-labs.io)
- ✅ Each transaction costs ~0.001 ALGO

### App Not Displaying
- ✅ Check browser console for errors
- ✅ Verify `.env` configuration
- ✅ Ensure smart contract is deployed

### Contract Compilation Error
- ✅ Update PyTeal: `pip install --upgrade pyteal`
- ✅ Check Python version (3.8+)
- ✅ Review error message for syntax issues

## 📚 Resources

- **Algorand Docs**: [developer.algorand.org](https://developer.algorand.org)
- **PyTeal Docs**: [pyteal.readthedocs.io](https://pyteal.readthedocs.io)
- **React Docs**: [react.dev](https://react.dev)
- **Algorand SDK**: [github.com/algorand/py-algorand-sdk](https://github.com/algorand/py-algorand-sdk)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the **MIT License** - see LICENSE file for details.

## ✨ Built With

- **React 18** - UI framework
- **PyTeal** - Smart contract language
- **Algorand SDK** - Blockchain interaction
- **Algorand** - Layer 1 blockchain
- **CSS3** - Styling

## 🎓 Hackathon Note

This application was developed for educational and hackathon purposes. It demonstrates:
- ✅ Smart contract development with PyTeal
- ✅ Blockchain integration with React
- ✅ Financial calculations and settlements
- ✅ User-friendly DeFi interface
- ✅ Production-ready code patterns

---

**Made with 💚 for the Algorand Community**
