import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { vi } from 'vitest';

describe('Volunteer App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the app shell correctly', () => {
    render(<App />);
    expect(screen.getByText(/PulseAssist/i)).toBeInTheDocument();
    expect(screen.getByText(/Volunteer Reporting Portal/i)).toBeInTheDocument();
    expect(screen.getByText('On Duty')).toBeInTheDocument();
  });

  it('handles mock photo selection and simulates Gemini Vision triage', async () => {
    render(<App />);
    
    // Choose Spilled Drink mock photo
    const btn = screen.getByRole('button', { name: /Select mock photo of Spilled Drink/i });
    fireEvent.click(btn);

    // Expect status of analysis
    expect(screen.getByText(/Gemini Vision AI is analyzing photo/i)).toBeInTheDocument();

    // Fast-forward timers to complete simulation
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Check if auto-generated summary and details appear
    expect(screen.getByText(/Gemini AI Drafted Summary & Triage/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Liquid spill/i).length).toBeGreaterThan(0);

    // Check if input value is populated
    const textarea = screen.getByLabelText(/Incident Details/i);
    expect(textarea.value).toContain('Liquid spill detected near section 102 exit');
  });

  it('allows submission of custom reports', () => {
    render(<App />);

    const textarea = screen.getByLabelText(/Incident Details/i);
    fireEvent.change(textarea, { target: { value: 'Something happened at gate 2.' } });

    const submitBtn = screen.getByRole('button', { name: /Submit incident to dispatch/i });
    fireEvent.click(submitBtn);

    // Should appear in reported incidents list
    expect(screen.getByText('Something happened at gate 2.')).toBeInTheDocument();
  });
});
