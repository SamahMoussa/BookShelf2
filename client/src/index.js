import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <-- changed
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles.css';
import { WishlistProvider } from "./context/WishlistContext";
import { ReviewProvider } from "./context/ReviewContext";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter> 
      <AuthProvider>
        <WishlistProvider>
          <ReviewProvider>
            <App />
          </ReviewProvider>
        </WishlistProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
