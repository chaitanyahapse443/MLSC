// Create Group Component
// Allows users to create a new expense sharing group

import React, { useState } from 'react';

function CreateGroup({ userAddress, onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!userAddress) {
        setError('Please connect your wallet first');
        return;
      }

      if (!groupName.trim()) {
        setError('Please enter a group name');
        return;
      }

      if (!members.trim()) {
        setError('Please enter member addresses');
        return;
      }

      // Parse member addresses
      const memberList = members.split(',').map(m => m.trim()).filter(m => m);

      if (memberList.length === 0) {
        setError('Please enter at least one valid member address');
        return;
      }

      console.log('📝 Group creation data:', {
        groupName,
        members: memberList
      });

      setSuccess(`✅ Group "${groupName}" created successfully!`);
      setGroupName('');
      setMembers('');

      if (onGroupCreated) {
        onGroupCreated({ name: groupName, members: memberList });
      }

    } catch (err) {
      console.error('Error creating group:', err);
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group">
      <h2>💰 Create Group</h2>
      <form onSubmit={handleCreateGroup}>
        <div className="form-group">
          <label htmlFor="groupName">Group Name:</label>
          <input
            id="groupName"
            type="text"
            placeholder="e.g., Spring Trip"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="members">Members (comma-separated addresses):</label>
          <textarea
            id="members"
            placeholder="ALGO_ADDR_1, ALGO_ADDR_2, ALGO_ADDR_3"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            disabled={loading}
            rows="3"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Creating...' : '➕ Create Group'}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
