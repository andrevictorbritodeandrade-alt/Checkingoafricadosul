import React from 'react';

export type ThemeColor = 'green' | 'gold' | 'red' | 'blue' | 'black' | 'white';

export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  themeColor: ThemeColor;
  gradientClass: string;
  textColor?: string; 
  bgColor: string; // Nova propriedade para o fundo sólido do card
}

export interface CurrencyRates {
  USD: number;
  BRL: number;
  ZAR: number;
  lastUpdated: number;
}

export type CurrencyCode = 'USD' | 'BRL' | 'ZAR';