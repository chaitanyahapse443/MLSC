"""
Example Test Data and Scenarios
For testing Campus Expense Splitter
"""

# Example test expenses grouped by scenario
TEST_SCENARIOS = {
    "simple_trip": {
        "name": "Weekend Hiking Trip",
        "members": [
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY",
            "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBZ4WYPA",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC4QCYA",
        ],
        "expenses": [
            {
                "description": "Gas for rental car",
                "amount": 60,
                "paid_by": 0,
                "split_between": [0, 1, 2],
            },
            {
                "description": "Grocery supplies",
                "amount": 90,
                "paid_by": 1,
                "split_between": [0, 1, 2],
            },
            {
                "description": "Campsite reservation",
                "amount": 45,
                "paid_by": 2,
                "split_between": [0, 1, 2],
            },
        ]
    },
    
    "complex_trip": {
        "name": "Spring Break Europe",
        "members": [
            "AAAAAAAAAAAA000000000000000000000000000000000000000AAAA",
            "BBBBBBBBBBBB000000000000000000000000000000000000000BBBB",
            "CCCCCCCCCC00000000000000000000000000000000000000CCCCCCCC",
            "DDDDDDDDDD00000000000000000000000000000000000000DDDDDDDD",
        ],
        "expenses": [
            {
                "description": "Air tickets",
                "amount": 400,
                "paid_by": 0,
                "split_between": [0, 1, 2, 3],
            },
            {
                "description": "Hotel room 1",
                "amount": 150,
                "paid_by": 0,
                "split_between": [0, 1],
            },
            {
                "description": "Hotel room 2",
                "amount": 150,
                "paid_by": 1,
                "split_between": [2, 3],
            },
            {
                "description": "Dinner at restaurant",
                "amount": 80,
                "paid_by": 2,
                "split_between": [0, 1, 2, 3],
            },
            {
                "description": "Tour booking",
                "amount": 120,
                "paid_by": 3,
                "split_between": [0, 1, 2, 3],
            },
        ]
    },
    
    "uneven_split": {
        "name": "Birthday Dinner",
        "members": [
            "PERSON_A_ADDRESS",
            "PERSON_B_ADDRESS",
            "PERSON_C_ADDRESS",
            "BIRTHDAY_PERSON_ADDRESS",
        ],
        "expenses": [
            {
                "description": "Birthday cake",
                "amount": 50,
                "paid_by": 0,
                "split_between": [1, 2, 3],  # Only 3 people split
            },
            {
                "description": "Dinner for 4",
                "amount": 200,
                "paid_by": 1,
                "split_between": [0, 1, 2, 3],  # Everyone splits
            },
            {
                "description": "Gift for birthday person",
                "amount": 100,
                "paid_by": 2,
                "split_between": [0, 2],  # Only 2 people
            },
        ]
    }
}

def get_scenario(name):
    """Get a test scenario by name"""
    return TEST_SCENARIOS.get(name)

def get_all_scenarios():
    """Get all available scenarios"""
    return list(TEST_SCENARIOS.keys())

def calculate_settlements(expenses, members):
    """
    Calculate who owes whom given a list of expenses
    
    Args:
        expenses: List of expense dicts
        members: List of member addresses
        
    Returns:
        List of settlement tuples: (payer, payee, amount)
    """
    balances = {i: 0 for i in range(len(members))}
    
    # Calculate balances
    for expense in expenses:
        paid_by = expense["paid_by"]
        amount = expense["amount"]
        split_between = expense["split_between"]
        
        # Person who paid gets the full amount
        balances[paid_by] += amount
        
        # Each person in split pays their share
        per_person = amount / len(split_between)
        for person in split_between:
            balances[person] -= per_person
    
    # Generate settlements
    settlements = []
    for debtor, debt in balances.items():
        if debt < -0.01:  # Person owes money
            for creditor, credit in balances.items():
                if credit > 0.01 and debt < -0.01:
                    settlement = min(abs(debt), credit)
                    settlements.append({
                        "from": members[debtor],
                        "to": members[creditor],
                        "amount": settlement
                    })
                    balances[debtor] += settlement
                    balances[creditor] -= settlement
                    if abs(debt) < 0.01:
                        break
    
    return settlements

if __name__ == "__main__":
    # Example usage
    print("Available test scenarios:")
    for scenario in get_all_scenarios():
        print(f"  - {scenario}")
    
    # Calculate settlements for simple trip
    scenario = get_scenario("simple_trip")
    settlements = calculate_settlements(scenario["expenses"], scenario["members"])
    
    print(f"\n🏕️ {scenario['name']} Settlements:")
    for settlement in settlements:
        print(f"  {settlement['from'][:10]}... owes "
              f"{settlement['to'][:10]}... "
              f"${settlement['amount']:.2f}")
