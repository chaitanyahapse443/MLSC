# AlgoKit / Deployment Integration

This folder documents how to use AlgoKit-style deployment for this project and provides a GitHub Actions workflow to compile and deploy the contract to an Algorand node.

Local quick steps

1. Create and activate a Python virtual environment:

```powershell
cd campus-expense-splitter
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Compile the PyTeal contract:

```powershell
python contracts/compile.py
```

3. Deploy the contract (this script will generate a temporary account if no `CREATOR_MNEMONIC` is set):

```powershell
python scripts/deploy_contract.py
```

Notes
- For real deployments set `CREATOR_MNEMONIC` in `.env` or pass it as an environment variable.
- The deployment script expects an Algorand node endpoint; the project defaults to `https://testnet-api.algonode.cloud`.

GitHub Actions

- The repository contains a workflow `.github/workflows/algokit-deploy.yml` that compiles contracts and runs the deploy script.
- To enable automatic deployment add the following repository secrets:
  - `ALGOD_ADDRESS` (e.g. `https://testnet-api.algonode.cloud`)
  - `ALGOD_TOKEN` (if required by your node)
  - `CREATOR_MNEMONIC` (deployer mnemonic)

Security
- Keep `CREATOR_MNEMONIC` secret — use GitHub Secrets for workflows. Do not commit mnemonics to the repo.
