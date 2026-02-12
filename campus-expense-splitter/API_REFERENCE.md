# Campus Expense Splitter - API Reference

## Frontend Components API

### ConnectWallet

Handles Algorand wallet connection using PeraWallet or MyAlgoConnect.

```jsx
<ConnectWallet onWalletConnected={(address) => handleConnect(address)} />
```

**Props:**
- `onWalletConnected`: Function called when wallet connects
  - Returns: User's Algorand address (string)

**Usage Example:**
```jsx
const [userAddress, setUserAddress] = useState('');

<ConnectWallet onWalletConnected={setUserAddress} />
```

---

### CreateGroup

Allows users to create expense-sharing groups.

```jsx
<CreateGroup 
  userAddress={userAddress}
  onGroupCreated={(group) => handleGroupCreated(group)}
/>
```

**Props:**
- `userAddress`: User's Algorand address (string)
- `onGroupCreated`: Callback when group is created
  - Returns: `{ name: string, members: string[] }`

**Data Structure:**
```javascript
{
  name: "Spring Break",
  members: [
    "AAAA...AAAA",
    "BBBB...BBBB"
  ]
}
```

---

### AddExpense

Component for recording new expenses.

```jsx
<AddExpense
  userAddress={userAddress}
  onExpenseAdded={(expense) => handleExpenseAdded(expense)}
/>
```

**Props:**
- `userAddress`: User's Algorand address
- `onExpenseAdded`: Callback when expense added
  - Returns: Expense object

**Expense Data Structure:**
```javascript
{
  description: "Gas",
  amount: 50.5,        // In ALGO
  paidBy: "AAAA...AAAA",
  splitBetween: [
    "AAAA...AAAA",
    "BBBB...BBBB",
    "CCCC...CCCC"
  ]
}
```

---

### SettleUp

Displays settlement calculations and processes payments.

```jsx
<SettleUp
  userAddress={userAddress}
  expenses={expensesList}
/>
```

**Props:**
- `userAddress`: User's Algorand address
- `expenses`: Array of expense objects

**Settlement Data Structure:**
```javascript
{
  from: "AAAA...AAAA",  // Debtor
  to: "BBBB...BBBB",    // Creditor
  amount: 75.25         // In ALGO
}
```

---

## Algorand Integration API

### Client Functions

**algodClient**
```javascript
import { algodClient } from '@/algorand/client';

// Get transaction parameters
const params = await algodClient.getTransactionParams().do();

// Get account info
const info = await algodClient.accountInformation(address).do();
```

**indexerClient**
```javascript
import { indexerClient } from '@/algorand/client';

// Search transactions
const txns = await indexerClient
  .searchForTransactions()
  .address(address)
  .do();
```

---

### Utility Functions

**isValidAlgorandAddress(address)**
```javascript
import { isValidAlgorandAddress } from '@/algorand/utils';

if (isValidAlgorandAddress(address)) {
  // Valid address
}
```

**formatAddress(address, length)**
```javascript
import { formatAddress } from '@/algorand/utils';

const shortened = formatAddress("AAAA...AAAA", 10);
// Returns: "AAAA...AAAA"
```

**algoToMicro(algo) / microToAlgo(microAlgo)**
```javascript
import { algoToMicro, microToAlgo } from '@/algorand/utils';

const microAlgo = algoToMicro(50.5);  // Returns: 50500000
const algo = microToAlgo(50500000);    // Returns: 50.5
```

**calculateSettlements(expenses)**
```javascript
import { calculateSettlements } from '@/algorand/utils';

const settlements = calculateSettlements(expenses);
// Returns: Array of settlement objects
```

**validateExpense(expense)**
```javascript
import { validateExpense } from '@/algorand/utils';

const { valid, errors } = validateExpense(expense);
if (!valid) {
  console.log('Errors:', errors);
}
```

---

## Smart Contract Methods

### create_group

Creates a new expense group.

**Parameters:**
- `group_name`: Name of the group (string)
- `members`: Member addresses (list of addresses)

**Example:**
```python
app_call(
  app_id=APP_ID,
  method="create_group",
  app_args=[
    b"create_group",
    b"Spring Break"
  ],
  foreign_accounts=member_addresses
)
```

**Cost:** 0.001 ALGO (network fee)

---

### add_expense

Records a new expense.

**Parameters:**
- `expense_data`: JSON with expense details
  - `description`: Expense description
  - `amount`: Amount in microAlgo
  - `paidBy`: Address of payer
  - `splitBetween`: List of addresses

**Example:**
```python
app_call(
  app_id=APP_ID,
  method="add_expense",
  app_args=[
    b"add_expense",
    json.dumps(expense_data).encode()
  ],
  foreign_accounts=split_addresses
)
```

**Cost:** 0.001 ALGO (network fee)

---

### settle_up

Records a settlement payment.

**Parameters:**
- `creditor`: Address of person receiving payment

**Example:**
```python
app_call(
  app_id=APP_ID,
  method="settle_up",
  app_args=[
    b"settle_up",
    creditor_address
  ],
  foreign_accounts=[creditor_address]
)
```

**Cost:** 0.001 + payment amount ALGO

---

## Configuration

### ALGORAND_CONFIG

Located in `frontend/src/algorand/config.js`

```javascript
export const ALGORAND_CONFIG = {
  server: 'https://testnet-api.algonode.cloud',
  port: 443,
  token: '',
  network: 'testnet',
  appId: 123456,
  creatorAddress: 'AAAA...AAAA'
};
```

### Environment Variables

**Frontend (.env)**
```
REACT_APP_ALGORAND_SERVER=https://testnet-api.algonode.cloud
REACT_APP_ALGORAND_PORT=443
REACT_APP_APP_ID=123456
REACT_APP_CREATOR_ADDRESS=AAAA...AAAA
```

**Backend (.env)**
```
ALGOD_ADDRESS=https://testnet-api.algonode.cloud
ALGOD_TOKEN=
CREATOR_MNEMONIC=word1 word2 word3...
APP_ID=123456
```

---

## Transaction Formats

### Payment Transaction

```javascript
// Create payment for settlement
const txn = algosdk.makePaymentTxnWithSuggestedParams(
  senderAddress,
  receiverAddress,
  amountInMicroAlgo,
  undefined,
  undefined,
  suggestedParams
);
```

### Application Call Transaction

```javascript
// Call smart contract
const txn = algosdk.makeApplicationNoOpTxn(
  senderAddress,
  appId,
  appArgs,           // Array of byte arrays
  accounts,          // Foreign accounts
  foreignAssets,     // []
  foreignApps,       // []
  boxes,             // []
  suggestedParams
);
```

---

## Error Handling

### Common Errors

**"Account not found"**
- Cause: Address doesn't exist on network
- Fix: Check address format, create account, get test ALGO

**"Insufficient funds"**
- Cause: Not enough ALGO for transaction
- Fix: Get testnet ALGO from faucet

**"App not available"**
- Cause: Smart contract not deployed
- Fix: Run deployment script

**"Invalid mnemonic"**
- Cause: Creator mnemonic in .env is wrong
- Fix: Verify 24-word recovery phrase

---

## Rate Limits

- **Testnet**: 100 requests per second
- **Transactions**: ~1 per second per account
- **Group transactions**: Up to 16 in a group

---

## Resources

- **Algorand SDK**: https://github.com/algorand/py-algorand-sdk
- **PyTeal Docs**: https://pyteal.readthedocs.io
- **Testnet Faucet**: https://testnet-dispenser.rand-labs.io
- **Explorer**: https://testnet.algoexplorer.io

---

**Last Updated:** February 2026
