#!/usr/bin/env python3
"""
Campus Expense Splitter - Setup and Testing Script
Automates initial setup and testing of the application
"""

import os
import sys
import subprocess
import platform

class SetupManager:
    """Manages setup and deployment"""
    
    def __init__(self):
        self.os_type = platform.system()
        self.project_root = os.path.dirname(os.path.abspath(__file__))
    
    def run_command(self, cmd, cwd=None, shell=True):
        """Run a shell command"""
        try:
            print(f"🔧 Running: {cmd}")
            result = subprocess.run(cmd, cwd=cwd, shell=shell, capture_output=True, text=True)
            if result.stdout:
                print(result.stdout)
            if result.returncode != 0:
                if result.stderr:
                    print(f"❌ Error: {result.stderr}")
                return False
            return True
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            return False
    
    def check_python_requirements(self):
        """Check if Python packages are installed"""
        print("\n📦 Checking Python dependencies...")
        required = ['pyteal', 'algosdk', 'python-dotenv']
        
        try:
            import pyteal
            import algosdk
            import dotenv
            print("✅ All Python packages found")
            return True
        except ImportError:
            print("❌ Missing Python packages")
            print("   Installing from requirements.txt...")
            self.run_command(f"{sys.executable} -m pip install -r requirements.txt")
            return True
    
    def check_node_dependencies(self):
        """Check if Node packages are installed"""
        print("\n📦 Checking Node dependencies...")
        
        frontend_path = os.path.join(self.project_root, 'frontend')
        node_modules = os.path.join(frontend_path, 'node_modules')
        
        if not os.path.exists(node_modules):
            print("❌ node_modules not found")
            print("   Installing from package.json...")
            self.run_command("npm install", cwd=frontend_path)
            return True
        else:
            print("✅ Node packages already installed")
            return True
    
    def compile_contract(self):
        """Compile smart contract"""
        print("\n🔨 Compiling smart contract...")
        
        contracts_path = os.path.join(self.project_root, 'contracts')
        
        # Add contracts path to Python path
        env = os.environ.copy()
        env['PYTHONPATH'] = f"{contracts_path}:{env.get('PYTHONPATH', '')}"
        
        result = self.run_command(
            f"{sys.executable} compile.py",
            cwd=contracts_path
        )
        
        if result:
            print("✅ Smart contract compiled successfully")
            print("   📁 Output: build/approval.teal, build/clear.teal")
        else:
            print("❌ Failed to compile contract")
        
        return result
    
    def deploy_contract(self):
        """Deploy smart contract to testnet"""
        print("\n🚀 Deploying smart contract...")
        print("   NOTE: Ensure ALGOD_ADDRESS and CREATOR_MNEMONIC are set in .env")
        
        scripts_path = os.path.join(self.project_root, 'scripts')
        
        response = input("   Continue with deployment? (y/n): ")
        if response.lower() != 'y':
            print("   ⏭️  Skipping deployment")
            return False
        
        result = self.run_command(
            f"{sys.executable} deploy_contract.py",
            cwd=scripts_path
        )
        
        if result:
            print("✅ Contract deployed successfully")
        else:
            print("❌ Deployment failed - check .env configuration")
        
        return result
    
    def start_frontend(self):
        """Start React development server"""
        print("\n🚀 Starting Frontend Development Server...")
        
        frontend_path = os.path.join(self.project_root, 'frontend')
        
        if self.os_type == 'Windows':
            os.startfile(frontend_path)
            print("   Opening frontend directory in explorer...")
        
        print(f"   📂 Frontend path: {frontend_path}")
        print("   Run: cd frontend && npm start")
        
        return True
    
    def setup_env_files(self):
        """Create .env files from templates"""
        print("\n📄 Setting up environment files...")
        
        backend_env = os.path.join(self.project_root, '.env')
        backend_template = os.path.join(self.project_root, '.env.example')
        
        frontend_env = os.path.join(self.project_root, 'frontend', '.env')
        frontend_template = os.path.join(self.project_root, 'frontend', '.env.example')
        
        if not os.path.exists(backend_env) and os.path.exists(backend_template):
            import shutil
            shutil.copy(backend_template, backend_env)
            print(f"✅ Created .env from template")
        
        if not os.path.exists(frontend_env) and os.path.exists(frontend_template):
            import shutil
            shutil.copy(frontend_template, frontend_env)
            print(f"✅ Created frontend/.env from template")
    
    def run_setup(self, skip_deploy=True):
        """Run complete setup"""
        print("=" * 60)
        print("🏫 CAMPUS EXPENSE SPLITTER - SETUP")
        print("=" * 60)
        
        # Setup environment files
        self.setup_env_files()
        
        # Check dependencies
        if not self.check_python_requirements():
            print("❌ Failed to install Python dependencies")
            return False
        
        if not self.check_node_dependencies():
            print("❌ Failed to install Node dependencies")
            return False
        
        # Compile contract
        if not self.compile_contract():
            print("❌ Failed to compile contract")
            return False
        
        # Deploy contract (optional)
        if not skip_deploy:
            if not self.deploy_contract():
                print("⚠️  Deployment skipped or failed")
        else:
            print("\n⏭️  Skipping contract deployment")
            print("   Run manually later with: python scripts/deploy_contract.py")
        
        print("\n" + "=" * 60)
        print("✅ SETUP COMPLETE!")
        print("=" * 60)
        print("\n📋 NEXT STEPS:")
        print("   1. Update .env with your Algorand configuration")
        print("   2. Deploy contract: python scripts/deploy_contract.py")
        print("   3. Update frontend/.env with APP_ID")
        print("   4. Start frontend: cd frontend && npm start")
        print("   5. Connect wallet and start managing expenses!")
        print("\n" + "=" * 60)
        
        return True

def main():
    """Main entry point"""
    setup = SetupManager()
    
    # Parse arguments
    skip_deploy = '--skip-deploy' in sys.argv or '-s' in sys.argv
    
    success = setup.run_setup(skip_deploy=skip_deploy)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
