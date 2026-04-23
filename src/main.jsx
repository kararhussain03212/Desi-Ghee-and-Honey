import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OrderProvider } from './context/OrderProvider.jsx'
import { UserProvider } from './context/UserProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
