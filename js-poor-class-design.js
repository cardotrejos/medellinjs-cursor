// Example 3: JavaScript Class with Poor Design
// This example demonstrates a class with poor encapsulation, repeated code,
// and other design issues that can be improved

function UserManager() {
  // Using a constructor function instead of class syntax
  this.users = [];
  this.loggedIn = {};
  
  // No private variables or methods
  this.addUser = function(id, name, email, role) {
    // No validation or error handling
    var newUser = {
      id: id,
      name: name,
      email: email,
      role: role,
      createdAt: new Date(),
      status: 'active'
    };
    
    this.users.push(newUser);
    return newUser;
  };
  
  this.findUserById = function(id) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        return this.users[i];
      }
    }
    return null;
  };
  
  this.findUserByEmail = function(email) {
    // Duplicated loop logic from findUserById
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].email === email) {
        return this.users[i];
      }
    }
    return null;
  };
  
  this.login = function(id, password) {
    // Insecure password handling with no hashing
    var user = this.findUserById(id);
    if (user && password === "password") { // Hardcoded password!
      this.loggedIn[id] = true;
      return true;
    }
    return false;
  };
  
  this.isLoggedIn = function(id) {
    return this.loggedIn[id] === true;
  };
  
  this.logout = function(id) {
    if (this.loggedIn[id]) {
      delete this.loggedIn[id];
      return true;
    }
    return false;
  };
  
  this.deleteUser = function(id) {
    var user = this.findUserById(id);
    if (!user) return false;
    
    // Duplicated loop logic again
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        this.users.splice(i, 1);
        // Forgetting to clean up logged in status
        return true;
      }
    }
    return false;
  };
  
  this.getUserRoles = function() {
    var roles = [];
    // Inefficient data processing
    for (var i = 0; i < this.users.length; i++) {
      var role = this.users[i].role;
      var found = false;
      for (var j = 0; j < roles.length; j++) {
        if (roles[j] === role) {
          found = true;
          break;
        }
      }
      if (!found) {
        roles.push(role);
      }
    }
    return roles;
  };
  
  // Global state modification with no access control
  this.disableAllUsers = function() {
    for (var i = 0; i < this.users.length; i++) {
      this.users[i].status = 'disabled';
    }
  };
}

// Usage
var manager = new UserManager();
manager.addUser(1, "John", "john@example.com", "admin");
manager.addUser(2, "Jane", "jane@example.com", "user");
console.log(manager.findUserById(1));
manager.login(1, "password");
console.log(manager.isLoggedIn(1));
console.log(manager.getUserRoles());
