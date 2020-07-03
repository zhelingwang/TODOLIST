// 1.how to serve content from cache when user is offline.
// way : when fetch failed , throw and catch the error , then response a fallback content such as offline/404.html from cache

// 2.caching critical resources for offline user and notifying user that they may go offline and enjoy the same experience

// 3.move appShellFiles to server , load it from server and parse as json and add files to cache