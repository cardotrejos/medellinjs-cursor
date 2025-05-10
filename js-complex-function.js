// Example 1: Complex JavaScript function with multiple code smells
// This demonstrates a function that does too many things, has unclear naming,
// and uses old JavaScript patterns

function doStuff(a, b, flag, items) {
  // Process data based on conditions
  var result = 0;
  var tmp = [];
  
  // Check if items is valid
  if (!items) {
    items = [];
  }
  
  // Process based on flag
  if (flag == true) {
    // Add all items together if flag is true
    for (var i = 0; i < items.length; i++) {
      if (typeof items[i] === 'number') {
        result = result + items[i];
      } else {
        // Try to convert to number
        var n = parseInt(items[i]);
        if (!isNaN(n)) {
          result = result + n;
        }
      }
    }
    // Add the first two parameters
    result = result + a + b;
  } else {
    // If flag is false, we do something else
    if (a > b) {
      // Filter out non-numbers from items
      for (var i = 0; i < items.length; i++) {
        if (typeof items[i] === 'number' && items[i] > 0) {
          tmp.push(items[i]);
        }
      }
      result = a - b;
    } else {
      // Different logic for when a <= b
      for (var i = 0; i < items.length; i++) {
        if (typeof items[i] === 'number' && items[i] < 0) {
          tmp.push(Math.abs(items[i]));
        }
      }
      result = b - a;
    }
  }
  
  // Some more processing
  if (tmp.length > 0) {
    var total = 0;
    for (var i = 0; i < tmp.length; i++) {
      total = total + tmp[i];
    }
    result = result * total;
  }
  
  return result;
}

// Example usage
console.log(doStuff(5, 10, true, [1, 2, '3', 4])); // Adds all values
console.log(doStuff(10, 5, false, [1, -2, 3, -4])); // Different behavior based on flag
