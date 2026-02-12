"""
Campus Expense Splitter Smart Contract
PyTeal implementation for Algorand blockchain
"""

from pyteal import *

def approval_program():
    """Smart contract for managing group expenses and settlements"""
    
    # State variables
    group_count = Bytes("gc")
    expense_count = Bytes("ec")
    
    # Methods
    on_creation = Seq([
        Assert(Global.creator_address() == Txn.sender()),
        App.globalPut(group_count, Int(0)),
        App.globalPut(expense_count, Int(0)),
        Approve()
    ])
    
    create_group = Seq([
        Assert(Txn.application_args.length() >= Int(2)),
        App.globalPut(
            Concat(Bytes("group_"), Itob(App.globalGet(group_count))),
            Txn.application_args[1]
        ),
        App.globalPut(group_count, App.globalGet(group_count) + Int(1)),
        Approve()
    ])
    
    add_expense = Seq([
        Assert(Txn.application_args.length() >= Int(3)),
        App.localPut(
            Txn.sender(),
            Concat(Bytes("expense_"), Itob(App.globalGet(expense_count))),
            Txn.application_args[1]
        ),
        App.globalPut(expense_count, App.globalGet(expense_count) + Int(1)),
        Approve()
    ])
    
    settle_up = Seq([
        Assert(Txn.application_args.length() >= Int(2)),
        Assert(Txn.amount() > Int(0)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: Txn.accounts[1],
            TxnField.amount: Txn.amount(),
            TxnField.fee: Int(1000),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])
    
    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.DeleteApplication, Approve()],
        [Txn.on_completion() == OnComplete.UpdateApplication, Approve()],
        [Txn.application_args[0] == Bytes("create_group"), create_group],
        [Txn.application_args[0] == Bytes("add_expense"), add_expense],
        [Txn.application_args[0] == Bytes("settle_up"), settle_up],
    )
    
    return program

def clear_state_program():
    """Clear state program"""
    return Approve()
