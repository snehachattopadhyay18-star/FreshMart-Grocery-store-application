/**
 * api.mock.js - Legacy alias redirected to the live backend API client
 */
// Load the live API
if (typeof window.API === 'undefined') {
  const script = document.createElement('script');
  script.src = '/api.js';
  document.head.appendChild(script);
}
