import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Suppress common browser extension runtime errors (like Adobe Acrobat or password managers)
// that bubble up uncaught message channel exceptions into the website's console.
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    event.reason.message &&
    (event.reason.message.includes('A listener indicated an asynchronous response') ||
     event.reason.message.includes('message channel closed before a response was received'))
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
