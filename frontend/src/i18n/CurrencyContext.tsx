import React, { createContext, useContext, useState } from 'react';

export type Currency = 'MGA' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatAmount: (amountInUsd: number, options?: { compact?: boolean }) => string;
  formatMgaAmount: (amountInMga: number) => string;
  toMga: (amountInUsd: number) => number;
}

export const MGA_PER_USD = 4600;

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('arovoly_currency');
    return saved === 'USD' ? 'USD' : 'MGA';
  });

  const setCurrency = (nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
    localStorage.setItem('arovoly_currency', nextCurrency);
  };

  const toggleCurrency = () => setCurrency(currency === 'MGA' ? 'USD' : 'MGA');

  const toMga = (amountInUsd: number) => amountInUsd * MGA_PER_USD;

  const formatAmount = (amountInUsd: number, options?: { compact?: boolean }) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: options?.compact ? 1 : 0,
        notation: options?.compact ? 'compact' : 'standard',
      }).format(amountInUsd);
    }

    const amountInMga = toMga(amountInUsd);
    if (options?.compact) {
      if (Math.abs(amountInMga) >= 1_000_000_000) {
        return `${(amountInMga / 1_000_000_000).toFixed(2)} Mds Ar`;
      }
      if (Math.abs(amountInMga) >= 1_000_000) {
        return `${(amountInMga / 1_000_000).toFixed(2)} M Ar`;
      }
    }

    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    }).format(amountInMga)} Ar`;
  };

  const formatMgaAmount = (amountInMga: number) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amountInMga / MGA_PER_USD);
    }

    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    }).format(amountInMga)} Ar`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, toggleCurrency, formatAmount, formatMgaAmount, toMga }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};
