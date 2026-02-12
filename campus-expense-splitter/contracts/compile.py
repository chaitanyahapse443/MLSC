"""
Smart Contract Compilation Script
Compiles PyTeal contracts to TEAL for Algorand
"""

import os
from pyteal import compileTeal, Mode
from expense_app import approval_program, clear_state_program

def compile_contract():
    """Compile the PyTeal smart contract to TEAL"""
    
    try:
        print("📝 Compiling approval program...")
        # Compile approval program
        approval_teal = compileTeal(approval_program(), Mode.Application, version=8)
        
        print("📝 Compiling clear state program...")
        # Compile clear state program
        clear_state_teal = compileTeal(clear_state_program(), Mode.Application, version=8)
        
        # Create output directory if it doesn't exist
        os.makedirs("build", exist_ok=True)
        
        # Write compiled contracts
        with open("build/approval.teal", "w") as f:
            f.write(approval_teal)
        
        with open("build/clear.teal", "w") as f:
            f.write(clear_state_teal)
        
        print("\n✅ Contract compiled successfully!")
        print("📁 Approval program: build/approval.teal")
        print("📁 Clear state program: build/clear.teal")
        print(f"📊 Approval size: {len(approval_teal)} bytes")
        print(f"📊 Clear size: {len(clear_state_teal)} bytes")
        
        return approval_teal, clear_state_teal
        
    except Exception as e:
        print(f"❌ Compilation error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    compile_contract()
