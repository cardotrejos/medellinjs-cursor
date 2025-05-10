// Example 2: JavaScript Callback Hell
// This demonstrates the "pyramid of doom" problem in asynchronous JavaScript code

function fetchUserData(userId, callback) {
  // Simulate API call with setTimeout
  setTimeout(() => {
    console.log('Fetching user data...');
    const userData = { id: userId, name: 'User ' + userId };
    callback(null, userData);
  }, 1000);
}

function fetchUserPosts(userId, callback) {
  setTimeout(() => {
    console.log('Fetching posts for user...');
    const posts = [
      { id: 1, title: 'First post', userId },
      { id: 2, title: 'Second post', userId }
    ];
    callback(null, posts);
  }, 1000);
}

function fetchPostComments(postId, callback) {
  setTimeout(() => {
    console.log('Fetching comments for post...');
    const comments = [
      { id: 1, text: 'Great post!', postId },
      { id: 2, text: 'I agree', postId }
    ];
    callback(null, comments);
  }, 1000);
}

// The "callback hell" begins here
function getUserActivity(userId) {
  fetchUserData(userId, (error, user) => {
    if (error) {
      console.error('Error fetching user:', error);
      return;
    }
    
    console.log('User found:', user);
    
    fetchUserPosts(user.id, (error, posts) => {
      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }
      
      console.log('Posts found:', posts);
      
      if (posts.length > 0) {
        fetchPostComments(posts[0].id, (error, comments) => {
          if (error) {
            console.error('Error fetching comments:', error);
            return;
          }
          
          console.log('Comments found:', comments);
          
          // Even more nested callbacks could go here...
          setTimeout(() => {
            console.log('Processing complete for user', userId);
            
            // More nested logic...
            setTimeout(() => {
              console.log('Sending notifications...');
              
              // And even more nesting...
              setTimeout(() => {
                console.log('Done!');
              }, 500);
            }, 500);
          }, 500);
        });
      }
    });
  });
}

// Usage
getUserActivity(123);
