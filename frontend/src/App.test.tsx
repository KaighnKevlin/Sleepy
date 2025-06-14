import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  expect(screen.getByText('Sleepy')).toBeInTheDocument();
  expect(screen.getByText('Fantasy Assistant')).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  render(<App />);
  expect(screen.getByText('Trending Players')).toBeInTheDocument();
  expect(screen.getByText('User Lookup')).toBeInTheDocument();
});

test('renders trending players by default', () => {
  render(<App />);
  expect(screen.getAllByText(/Trending/)).toHaveLength(3); // 2 components + 1 tab
});
