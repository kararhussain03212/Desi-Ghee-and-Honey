import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OrderProvider } from './context/OrderProvider.jsx'
import { UserProvider } from './context/UserProvider.jsx'
import { ContentProvider } from './context/ContentProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ContentProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </ContentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
