import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { vi } from 'vitest';

describe('Ops Dashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the dashboard shell correctly with KPIs', () => {
    render(<App />);
    expect(screen.getByText(/Pulse Command/i)).toBeInTheDocument();
    expect(screen.getByText(/CO₂ Saved Today/i)).toBeInTheDocument();
    expect(screen.getByText(/Gate C3 Congested/i)).toBeInTheDocument();
  });

  it('handles natural language queries to generate SQL and chart', () => {
    render(<App />);
    
    const textarea = screen.getByLabelText(/Ask Gemini in Natural Language:/i);
    fireEvent.change(textarea, { target: { value: 'Show total crowd attendance per gate' } });
    
    const btn = screen.getByRole('button', { name: /Submit natural language query/i });
    fireEvent.click(btn);

    // Fast-forward timers to complete simulation
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Check if SQL query compiled appears
    expect(screen.getByText(/SELECT gate_id, SUM/i)).toBeInTheDocument();
    // Check if AI Generated Visualization is rendered
    expect(screen.getByText(/AI Generated Visualization/i)).toBeInTheDocument();
  });

  it('allows resolving incidents and updating gate/system states', () => {
    render(<App />);

    const resolveBtn = screen.getByRole('button', { name: /Mark incident 101 as resolved/i });
    fireEvent.click(resolveBtn);

    // Gate C3 congestion incident should be removed
    expect(screen.queryByText('Gate C3 turnstile density jam (IoT Flagged)')).not.toBeInTheDocument();
    // Status should be optimal
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
  });
});
