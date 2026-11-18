import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { CurrencyProvider } from './i18n/CurrencyContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </LanguageProvider>
  </React.StrictMode>
);
