import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TrendingPlayers from '../TrendingPlayers';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('TrendingPlayers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockApiService.getTrendingPlayers.mockImplementation(() => new Promise(() => {}));
    
    render(<TrendingPlayers />);
    
    expect(screen.getByText('Trending Adds')).toBeInTheDocument();
    // Check for loading skeleton instead of text
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders trending players data', async () => {
    const mockData = {
      type: 'add' as const,
      hours: 12,
      players: [
        {
          player_id: '1',
          name: 'John Doe',
          position: 'RB',
          team: 'NYG',
          count: 100
        },
        {
          player_id: '2',
          name: 'Jane Smith',
          position: 'WR',
          team: 'LAR',
          count: 75
        }
      ]
    };

    mockApiService.getTrendingPlayers.mockResolvedValue(mockData);
    
    render(<TrendingPlayers />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('RB')).toBeInTheDocument();
      expect(screen.getByText('WR')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    mockApiService.getTrendingPlayers.mockRejectedValue(new Error('API Error'));
    
    render(<TrendingPlayers />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch trending players')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('renders correct title for drops', async () => {
    const mockData = {
      type: 'drop' as const,
      hours: 12,
      players: []
    };

    mockApiService.getTrendingPlayers.mockResolvedValue(mockData);
    
    render(<TrendingPlayers type="drop" />);
    
    await waitFor(() => {
      expect(screen.getByText('Trending Drops')).toBeInTheDocument();
    });
  });

  it('renders empty state when no players found', async () => {
    const mockData = {
      type: 'add' as const,
      hours: 12,
      players: []
    };

    mockApiService.getTrendingPlayers.mockResolvedValue(mockData);
    
    render(<TrendingPlayers />);
    
    await waitFor(() => {
      expect(screen.getByText('No trending players found')).toBeInTheDocument();
    });
  });
});