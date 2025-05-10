// Example 4: JavaScript code ripe for TypeScript conversion
// This demonstrates code that would benefit greatly from type safety

// A utility function library with no type safety
const DataProcessor = {
  // No parameter types, return types, or documentation
  process(data, options) {
    if (!data) return [];
    
    let results = [];
    const defaultOptions = {
      filter: item => true,
      transform: item => item,
      sort: true,
      limit: null
    };
    
    // Merge options with defaults
    options = Object.assign({}, defaultOptions, options || {});
    
    // Process the data
    results = data.filter(options.filter);
    results = results.map(options.transform);
    
    if (options.sort) {
      // Sort might be a boolean or a function
      if (typeof options.sort === 'function') {
        results.sort(options.sort);
      } else {
        results.sort();
      }
    }
    
    if (options.limit && typeof options.limit === 'number') {
      results = results.slice(0, options.limit);
    }
    
    return results;
  },
  
  // Function that works with complex nested data
  extractValues(obj, path) {
    if (!obj || !path) return null;
    
    const parts = typeof path === 'string' ? path.split('.') : path;
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[parts[i]];
    }
    
    return current;
  },
  
  // Function handling multiple types with different behaviors
  merge(target, source) {
    // No type safety leads to complex conditionals
    if (!target) return source;
    if (!source) return target;
    
    if (Array.isArray(target) && Array.isArray(source)) {
      return target.concat(source);
    }
    
    if (typeof target === 'object' && typeof source === 'object') {
      const result = Object.assign({}, target);
      
      for (const key in source) {
        if (
          typeof source[key] === 'object' && 
          source[key] !== null && 
          typeof target[key] === 'object' && 
          target[key] !== null
        ) {
          result[key] = this.merge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
      
      return result;
    }
    
    // Default fallback - might not be what the caller expects
    return source;
  }
};

// Usage examples with different data types and structures
const users = [
  { id: 1, name: 'John', roles: ['admin'], metadata: { active: true } },
  { id: 2, name: 'Jane', roles: ['user'], metadata: { active: false } },
  { id: 3, name: 'Bob', roles: ['user', 'editor'], metadata: { active: true } }
];

// Different ways to call the functions, some potentially problematic
const activeUsers = DataProcessor.process(users, {
  filter: user => DataProcessor.extractValues(user, 'metadata.active'),
  transform: user => ({ id: user.id, name: user.name })
});

const adminName = DataProcessor.extractValues(
  users.find(u => u.roles.includes('admin')), 
  'name'
);

// Function calls that could be problematic without type checking
const merged = DataProcessor.merge(
  { a: 1, b: { c: 2 } },
  { b: { d: 3 }, e: 4 }
);

console.log(activeUsers);
console.log(adminName);
console.log(merged);

// This call might cause runtime errors that TypeScript would catch
const problematicCall = DataProcessor.process(null, { sort: 'name' });
