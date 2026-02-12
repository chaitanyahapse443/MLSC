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
# 🏫 Campus Expense Splitter

An Algorand-based group expense manager built for quick demos and hackathons. This repository contains the smart contract (PyTeal), deployment scripts, and a React frontend wired to Algorand wallets for a non-custodial experience.

Why this project
- Demonstrates end-to-end dApp flow: smart contract → deployment → frontend wallet interactions.
- Clean UX for groups to add expenses and settle on-chain.

Implemented (what to look for)
- ✅ Wallet integration (PeraWallet / MyAlgoConnect)
- ✅ Create groups and store members in app state
- ✅ Add expenses and split logic
- ✅ Settlement calculations and transaction flow
- ✅ PyTeal contract compiled to TEAL (compiled files in `contracts/build/`)

Remaining / Nice-to-have
- ⚪ Gas/fee pooling for cheaper multi-payments
- ⚪ UI polish and accessibility improvements
- ⚪ End-to-end automated tests for contract + frontend

Important files (for reviewers)
- `contracts/expense_app.py` — core PyTeal contract logic ([open](campus-expense-splitter/contracts/expense_app.py#L1))
- `contracts/compile.py` — compile helper to generate TEAL
- `scripts/deploy_contract.py` — deploys the contract to Algorand
- `frontend/src/algorand/client.js` — Algorand client and provider wiring
- `frontend/src/components` — key UI pieces: `CreateGroup`, `AddExpense`, `SettleUp`

Quick demo (local)
1. Create Python venv and install dependencies
```powershell
cd campus-expense-splitter
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
2. Install and start frontend
```powershell
cd frontend
npm install
npm start
```
3. Compile & deploy contract (optional — for running full flow)
```powershell
cd ../contracts
python compile.py
python ../scripts/deploy_contract.py
```

Notes for judges
- Use a Testnet account (faucet) and PeraWallet or MyAlgoConnect to interact with the UI.
- If you're short on time, you can still review contract logic in `contracts/expense_app.py` and run the frontend in mock mode by configuring `frontend/.env`.

How to run tests (if available)
- Frontend: `cd frontend && npm test`
- Contract unit tests: none currently; recommend manual review of `contracts/expense_app.py`.

Contributing
- Fork → branch → PR. See root README for quick links.

License
- MIT

Thank you — if you'd like, I can push these doc updates to a branch and open a PR for review.
