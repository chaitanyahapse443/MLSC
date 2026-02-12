# MLSC — Campus Expense Splitter

This repository contains the Campus Expense Splitter application (smart contracts and frontend) used to demo splitting expenses using Algorand.

Contents:

- `campus-expense-splitter/` — application source, contracts, frontend, and docs.

See the full project README inside the project folder:

 - Campus app README: campus-expense-splitter/README.md

How to run (quick):

# MLSC

A curated workspace containing the Campus Expense Splitter project — an Algorand-based app that helps groups split and settle expenses.

Quick links
- Project: [campus-expense-splitter](campus-expense-splitter/README.md)

Highlights
- Smart contracts written in PyTeal and compiled to TEAL (see [campus-expense-splitter/contracts/expense_app.py](campus-expense-splitter/contracts/expense_app.py#L1)).
- React frontend with wallet integration and live UI ([campus-expense-splitter/frontend/src/App.jsx](campus-expense-splitter/frontend/src/App.jsx#L1)).

For judges / reviewers
- Start with the project README: [campus-expense-splitter/README.md](campus-expense-splitter/README.md).
- Key files to inspect:
	- [campus-expense-splitter/contracts/expense_app.py](campus-expense-splitter/contracts/expense_app.py#L1) — smart contract logic
	- [campus-expense-splitter/scripts/deploy_contract.py](campus-expense-splitter/scripts/deploy_contract.py#L1) — deployment helper
	- [campus-expense-splitter/frontend/src/algorand/client.js](campus-expense-splitter/frontend/src/algorand/client.js#L1) — blockchain client integration

Run quick demo (local)
```powershell
cd campus-expense-splitter
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd frontend
npm install
npm start
```



