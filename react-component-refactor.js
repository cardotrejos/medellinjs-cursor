// Example 5: React Component with Refactoring Opportunities
// This demonstrates a React component with various code smells and improvement possibilities

import React from 'react';

// A large monolithic React component with multiple responsibilities
class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      isLoading: false,
      error: null,
      searchTerm: '',
      sortBy: 'name',
      sortDirection: 'asc',
      selectedUser: null,
      showUserModal: false,
      newUserData: { name: '', email: '', role: 'user' },
      showAddUserForm: false,
      pageSize: 10,
      currentPage: 1
    };
    
    // Binding methods manually
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleUserSelect = this.handleUserSelect.bind(this);
    this.handleUserModalClose = this.handleUserModalClose.bind(this);
    this.handleAddUserClick = this.handleAddUserClick.bind(this);
    this.handleNewUserChange = this.handleNewUserChange.bind(this);
    this.handleAddUserSubmit = this.handleAddUserSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  
  componentDidMount() {
    // Fetch data when component mounts
    this.setState({ isLoading: true });
    
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', lastLogin: '2023-05-10' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', lastLogin: '2023-05-15' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'editor', lastLogin: '2023-05-12' },
        // More users would be here...
      ];
      
      this.setState({
        users: mockUsers,
        filteredUsers: mockUsers,
        isLoading: false
      });
    }, 1000);
  }
  
  componentDidUpdate(prevProps, prevState) {
    // Filter and sort users when search term or sort options change
    if (
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.sortDirection !== this.state.sortDirection
    ) {
      this.filterAndSortUsers();
    }
  }
  
  // Complex method that does filtering and sorting
  filterAndSortUsers() {
    const { users, searchTerm, sortBy, sortDirection } = this.state;
    
    // Filter users based on search term
    let filtered = users;
    if (searchTerm) {
      filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort users based on selected field and direction
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (sortBy === 'role') {
        comparison = a.role.localeCompare(b.role);
      } else if (sortBy === 'lastLogin') {
        const dateA = new Date(a.lastLogin);
        const dateB = new Date(b.lastLogin);
        comparison = dateA - dateB;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.setState({ filteredUsers: filtered });
  }
  
  // Event handlers for search, sort, pagination, etc.
  handleSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }
  
  handleSortChange(field) {
    const { sortBy, sortDirection } = this.state;
    
    if (sortBy === field) {
      // Toggle direction if same field is clicked
      this.setState({
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Set new sort field with default ascending direction
      this.setState({
        sortBy: field,
        sortDirection: 'asc'
      });
    }
  }
  
  handleUserSelect(user) {
    this.setState({
      selectedUser: user,
      showUserModal: true
    });
  }
  
  handleUserModalClose() {
    this.setState({
      selectedUser: null,
      showUserModal: false
    });
  }
  
  handleAddUserClick() {
    this.setState({ showAddUserForm: true });
  }
  
  handleNewUserChange(e) {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newUserData: {
        ...prevState.newUserData,
        [name]: value
      }
    }));
  }
  
  handleAddUserSubmit(e) {
    e.preventDefault();
    
    const { users, newUserData } = this.state;
    const newUser = {
      id: users.length + 1,
      ...newUserData,
      lastLogin: new Date().toISOString().split('T')[0]
    };
    
    // Add new user to the list
    const updatedUsers = [...users, newUser];
    
    this.setState({
      users: updatedUsers,
      showAddUserForm: false,
      newUserData: { name: '', email: '', role: 'user' }
    }, () => {
      // After state update, filter and sort again
      this.filterAndSortUsers();
    });
  }
  
  handlePageChange(page) {
    this.setState({ currentPage: page });
  }
  
  handlePageSizeChange(e) {
    this.setState({
      pageSize: parseInt(e.target.value, 10),
      currentPage: 1 // Reset to first page when changing page size
    });
  }
  
  deleteUser(userId) {
    const { users } = this.state;
    const updatedUsers = users.filter(user => user.id !== userId);
    
    this.setState({ users: updatedUsers }, () => {
      this.filterAndSortUsers();
    });
  }
  
  renderUserTable() {
    const { filteredUsers, sortBy, sortDirection, currentPage, pageSize } = this.state;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return (
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => this.handleSortChange('name')}>
                Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => this.handleSortChange('email')}>
                Email {sortBy === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => this.handleSortChange('role')}>
                Role {sortBy === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => this.handleSortChange('lastLogin')}>
                Last Login {sortBy === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} onClick={() => this.handleUserSelect(user)}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin}</td>
                <td>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    this.handleUserSelect(user);
                  }}>
                    View
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    this.deleteUser(user.id);
                  }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {this.renderPagination()}
      </div>
    );
  }
  
  renderPagination() {
    const { filteredUsers, currentPage, pageSize } = this.state;
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    
    return (
      <div className="pagination">
        <button 
          disabled={currentPage === 1}
          onClick={() => this.handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        
        <span>
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          disabled={currentPage === totalPages}
          onClick={() => this.handlePageChange(currentPage + 1)}
        >
          Next
        </button>
        
        <select
          value={pageSize}
          onChange={this.handlePageSizeChange}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    );
  }
  
  renderUserModal() {
    const { showUserModal, selectedUser } = this.state;
    
    if (!showUserModal || !selectedUser) {
      return null;
    }
    
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>User Details</h2>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>
          <button onClick={this.handleUserModalClose}>Close</button>
        </div>
      </div>
    );
  }
  
  renderAddUserForm() {
    const { showAddUserForm, newUserData } = this.state;
    
    if (!showAddUserForm) {
      return null;
    }
    
    return (
      <div className="add-user-form">
        <h2>Add New User</h2>
        <form onSubmit={this.handleAddUserSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newUserData.name}
              onChange={this.handleNewUserChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={newUserData.email}
              onChange={this.handleNewUserChange}
              required
            />
          </div>
          <div>
            <label>Role:</label>
            <select
              name="role"
              value={newUserData.role}
              onChange={this.handleNewUserChange}
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <button type="submit">Add User</button>
            <button type="button" onClick={() => this.setState({ showAddUserForm: false })}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  render() {
    const { isLoading, error, searchTerm } = this.state;
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    
    return (
      <div className="user-dashboard">
        <h1>User Management Dashboard</h1>
        
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
          <button onClick={this.handleAddUserClick}>
            Add New User
          </button>
        </div>
        
        {this.renderUserTable()}
        {this.renderUserModal()}
        {this.renderAddUserForm()}
      </div>
    );
  }
}

export default UserDashboard;
