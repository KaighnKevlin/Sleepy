import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserLookup from '../UserLookup';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('UserLookup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search form', () => {
    render(<UserLookup />);
    
    expect(screen.getByText('User Lookup')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Sleeper username...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('disables search button when input is empty', () => {
    render(<UserLookup />);
    
    const searchButton = screen.getByText('Search');
    expect(searchButton).toBeDisabled();
  });

  it('enables search button when input has value', () => {
    render(<UserLookup />);
    
    const input = screen.getByPlaceholderText('Enter Sleeper username...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'testuser' } });
    expect(searchButton).not.toBeDisabled();
  });

  it('searches for user and displays results', async () => {
    const mockData = {
      user: {
        user_id: '123',
        username: 'testuser',
        display_name: 'Test User',
        avatar: ''
      },
      leagues: [
        {
          league_id: 'league1',
          name: 'Test League',
          season: '2024',
          total_rosters: 12,
          roster_positions: { QB: 1, RB: 2, WR: 3 },
          scoring_settings: {}
        }
      ]
    };

    mockApiService.getUserLeagues.mockResolvedValue(mockData);
    
    render(<UserLookup />);
    
    const input = screen.getByPlaceholderText('Enter Sleeper username...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('@testuser')).toBeInTheDocument();
      expect(screen.getByText('Test League')).toBeInTheDocument();
      expect(screen.getByText('Season: 2024')).toBeInTheDocument();
      expect(screen.getByText('Teams: 12')).toBeInTheDocument();
    });
  });

  it('displays error when user not found', async () => {
    mockApiService.getUserLeagues.mockRejectedValue(new Error('User not found'));
    
    render(<UserLookup />);
    
    const input = screen.getByPlaceholderText('Enter Sleeper username...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'nonexistent' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('User not found or has no leagues')).toBeInTheDocument();
    });
  });

  it('shows loading state during search', async () => {
    mockApiService.getUserLeagues.mockImplementation(() => new Promise(() => {}));
    
    render(<UserLookup />);
    
    const input = screen.getByPlaceholderText('Enter Sleeper username...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(searchButton);
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
});