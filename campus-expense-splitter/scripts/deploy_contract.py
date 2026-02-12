"""
Smart Contract Deployment Script
Deploys compiled contracts to Algorand testnet
"""

import os
import sys
from dotenv import load_dotenv
from algosdk.v2client import algod
from algosdk.transaction import *
from algosdk.account import generate_account
from algosdk.encoding import decode_address
import base64

# Load environment variables
load_dotenv()

# Algorand configuration
ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "http://localhost:4001")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
CREATOR_MNEMONIC = os.getenv("CREATOR_MNEMONIC", "")

class ContractDeployer:
    """Deploy smart contract to Algorand"""
    
    def __init__(self):
        self.client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
        if CREATOR_MNEMONIC:
            from algosdk.mnemonic import to_private_key
            self.private_key = to_private_key(CREATOR_MNEMONIC)
            self.creator_address = account.address_from_private_key(self.private_key)
        else:
            self.private_key, self.creator_address = generate_account()
            print(f"🔑 Generated Account: {self.creator_address}")
    
    def read_contract(self, filename):
        """Read compiled contract from file"""
        with open(filename, "r") as f:
            return f.read()
    
    def compile_teal(self, teal_code):
        """Compile TEAL code on-chain"""
        response = self.client.compile(teal_code)
        return base64.b64decode(response["result"])
    
    def deploy(self):
        """Deploy the smart contract"""
        try:
            # Read compiled contracts
            print("📂 Reading compiled contracts...")
            approval_teal = self.read_contract("../contracts/build/approval.teal")
            clear_teal = self.read_contract("../contracts/build/clear.teal")
            
            # Compile on AlgoNode
            print("🔨 Compiling contracts on-chain...")
            approval_program = self.compile_teal(approval_teal)
            clear_program = self.compile_teal(clear_teal)
            
            # Get suggested parameters
            params = self.client.suggested_params()
            
            # Create application transaction
            print("📝 Creating application...")
            txn = ApplicationCreateTxn(
                sender=self.creator_address,
                index=0,
                approval_program=approval_program,
                clear_program=clear_program,
                global_schema=StateSchema(num_uints=2, num_byte_slices=0),
                local_schema=StateSchema(num_uints=0, num_byte_slices=0),
                foreign_assets=[],
                foreign_accounts=[],
                sp=params
            )
            
            # Sign transaction
            print("🔐 Signing transaction...")
            signed_txn = txn.sign(self.private_key)
            
            # Send transaction
            print("📤 Sending transaction to Algorand...")
            tx_id = self.client.send_transaction(signed_txn)
            
            # Wait for confirmation
            print(f"⏳ Waiting for confirmation (TX ID: {tx_id})...")
            response = wait_for_confirmation(self.client, tx_id, 4)
            
            # Extract app ID
            app_id = response["application-index"]
            print(f"\n✅ Contract deployed successfully!")
            print(f"📱 App ID: {app_id}")
            print(f"👤 Creator: {self.creator_address}")
            
            # Save deployment info
            self.save_deployment_info(app_id)
            
            return app_id
            
        except Exception as e:
            print(f"❌ Deployment failed: {str(e)}")
            sys.exit(1)
    
    def save_deployment_info(self, app_id):
        """Save deployment information"""
        with open(".env.local", "w") as f:
            f.write(f"REACT_APP_APP_ID={app_id}\n")
            f.write(f"REACT_APP_CREATOR_ADDRESS={self.creator_address}\n")
        print("💾 Deployment info saved to .env.local")

def wait_for_confirmation(client, transaction_id, timeout=4):
    """Wait for transaction confirmation"""
    start_round = client.status()["last-round"] + 1
    current_round = start_round
    
    while current_round < start_round + timeout:
        try:
            pending_txn = client.pending_transaction_info(transaction_id)
            if pending_txn["confirmed-round"] is not None and pending_txn["confirmed-round"] > 0:
                return pending_txn
        except Exception:
            pass
        
        current_round += 1
    
    raise Exception("Transaction not confirmed within timeout")

def deploy_contract():
    """Main deployment function"""
    deployer = ContractDeployer()
    app_id = deployer.deploy()
    return app_id

if __name__ == "__main__":
    deploy_contract()
