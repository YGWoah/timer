import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/components/SEO', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/FocusSession', () => ({
  __esModule: true,
  default: () => <div data-testid="focus-session">Focus Session</div>,
}));

const renderDashboard = () => {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    
    renderDashboard();
    
    expect(screen.getByLabelText('Loading dashboard')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    
    renderDashboard();
    
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('renders dashboard content for authenticated user', () => {
    const user = { displayName: 'John Doe' };
    mockUseAuth.mockReturnValue({ user, loading: false });
    
    renderDashboard();
    
    expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Track your focus sessions and stay productive.')).toBeInTheDocument();
    expect(screen.getByTestId('focus-session')).toBeInTheDocument();
  });

  it('shows "User" as fallback when displayName is not available', () => {
    const user = { displayName: null };
    mockUseAuth.mockReturnValue({ user, loading: false });
    
    renderDashboard();
    
    expect(screen.getByText('Welcome back, User')).toBeInTheDocument();
  });
});