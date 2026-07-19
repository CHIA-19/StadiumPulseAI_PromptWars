import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { vi } from 'vitest';

describe('Dashboard Component', () => {
  const mockSetActive = vi.fn();

  beforeEach(() => {
    mockSetActive.mockClear();
  });

  it('renders the main page title', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText(/Stadium Command Center/i)).toBeInTheDocument();
  });

  it('renders the subtitle with live match info', () => {
    render(<Dashboard setActive={mockSetActive} />);
    // MetLife Stadium appears in both the subtitle and match info box
    const metlifeEls = screen.getAllByText(/MetLife Stadium/i);
    expect(metlifeEls.length).toBeGreaterThan(0);
  });

  it('renders all 4 KPI stat cards', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText('Total Fans')).toBeInTheDocument();
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    expect(screen.getByText(/CO₂ Saved Today/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Gate Wait/i)).toBeInTheDocument();
  });

  it('renders the live match scoreboard', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByLabelText(/Score 2 to 1/i)).toBeInTheDocument();
  });

  it('renders the Gate Crowd Status section', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText('Gate Crowd Status')).toBeInTheDocument();
  });

  it('renders all 6 gate tiles from mock data', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
    expect(screen.getByText('C3')).toBeInTheDocument();
    expect(screen.getByText('D4')).toBeInTheDocument();
    expect(screen.getByText('E5')).toBeInTheDocument();
    expect(screen.getByText('F6')).toBeInTheDocument();
  });

  it('navigates to heatmap when View All is clicked', () => {
    render(<Dashboard setActive={mockSetActive} />);
    const viewAllBtn = screen.getAllByText(/View All/i)[0];
    fireEvent.click(viewAllBtn);
    expect(mockSetActive).toHaveBeenCalledWith('heatmap');
  });

  it('navigates to concierge when Ask AI button is clicked', () => {
    render(<Dashboard setActive={mockSetActive} />);
    const askAIBtn = screen.getByText(/Ask AI/i);
    fireEvent.click(askAIBtn);
    expect(mockSetActive).toHaveBeenCalledWith('concierge');
  });

  it('renders the Transit Planner quick action', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText(/Plan My Route Home/i)).toBeInTheDocument();
  });

  it('navigates to transit when Plan My Route Home is clicked', () => {
    render(<Dashboard setActive={mockSetActive} />);
    const btn = screen.getByText(/Plan My Route Home/i);
    fireEvent.click(btn);
    expect(mockSetActive).toHaveBeenCalledWith('transit');
  });

  it('renders the AI Concierge preview section', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByText(/AI Concierge · Gemini 2.0/i)).toBeInTheDocument();
  });

  it('renders the MiniChat quick chips', () => {
    render(<Dashboard setActive={mockSetActive} />);
    expect(screen.getByRole('button', { name: /Ask: 🚻 Restroom\?/i })).toBeInTheDocument();
  });

  it('allows typing in the MiniChat input', () => {
    render(<Dashboard setActive={mockSetActive} />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium/i);
    fireEvent.change(input, { target: { value: 'Where is gate A1?' } });
    expect(input.value).toBe('Where is gate A1?');
  });
});
