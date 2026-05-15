import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#e5e2e1',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#C9A84C', secondary: '#0D0D0D' },
            },
            error: {
              iconTheme: { primary: '#ffb4ab', secondary: '#0D0D0D' },
            },
          }}
        />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
