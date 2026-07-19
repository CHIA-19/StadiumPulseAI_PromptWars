import { render, screen, fireEvent } from '@testing-library/react';
import IncidentFeed from '../pages/IncidentFeed';

describe('IncidentFeed Component', () => {
  it('renders the page title', () => {
    render(<IncidentFeed />);
    expect(screen.getByText(/Live Incident Feed/i)).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<IncidentFeed />);
    expect(screen.getByText(/AI-Triaged reports from Volunteers/i)).toBeInTheDocument();
  });

  it('renders all 5 incidents by default (all filter)', () => {
    render(<IncidentFeed />);
    expect(screen.getByText('Spilled liquid hazard')).toBeInTheDocument();
    expect(screen.getByText('Gate C3 – Critical congestion')).toBeInTheDocument();
    expect(screen.getByText('Medical assistance needed')).toBeInTheDocument();
    expect(screen.getByText('Lost child reported')).toBeInTheDocument();
    expect(screen.getByText('Barrier malfunction')).toBeInTheDocument();
  });

  it('renders filter buttons for all severity levels', () => {
    render(<IncidentFeed />);
    expect(screen.getByRole('button', { name: /^ALL$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^HIGH$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^MED$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^LOW$/i })).toBeInTheDocument();
  });

  it('ALL filter is active by default', () => {
    render(<IncidentFeed />);
    const allBtn = screen.getByRole('button', { name: /^ALL$/i });
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('filters to HIGH severity incidents only', () => {
    render(<IncidentFeed />);
    const highBtn = screen.getByRole('button', { name: /^HIGH$/i });
    fireEvent.click(highBtn);

    expect(screen.getByText('Gate C3 – Critical congestion')).toBeInTheDocument();
    expect(screen.queryByText('Spilled liquid hazard')).not.toBeInTheDocument();
    expect(screen.queryByText('Lost child reported')).not.toBeInTheDocument();
  });

  it('filters to MED severity incidents only', () => {
    render(<IncidentFeed />);
    const medBtn = screen.getByRole('button', { name: /^MED$/i });
    fireEvent.click(medBtn);

    expect(screen.getByText('Medical assistance needed')).toBeInTheDocument();
    expect(screen.getByText('Lost child reported')).toBeInTheDocument();
    expect(screen.queryByText('Spilled liquid hazard')).not.toBeInTheDocument();
    expect(screen.queryByText('Gate C3 – Critical congestion')).not.toBeInTheDocument();
  });

  it('filters to LOW severity incidents only', () => {
    render(<IncidentFeed />);
    const lowBtn = screen.getByRole('button', { name: /^LOW$/i });
    fireEvent.click(lowBtn);

    expect(screen.getByText('Spilled liquid hazard')).toBeInTheDocument();
    expect(screen.getByText('Barrier malfunction')).toBeInTheDocument();
    expect(screen.queryByText('Gate C3 – Critical congestion')).not.toBeInTheDocument();
    expect(screen.queryByText('Medical assistance needed')).not.toBeInTheDocument();
  });

  it('returns to ALL incidents when ALL filter is clicked again', () => {
    render(<IncidentFeed />);
    fireEvent.click(screen.getByRole('button', { name: /^HIGH$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^ALL$/i }));

    expect(screen.getByText('Spilled liquid hazard')).toBeInTheDocument();
    expect(screen.getByText('Barrier malfunction')).toBeInTheDocument();
  });

  it('renders assigned responders for each incident', () => {
    render(<IncidentFeed />);
    expect(screen.getByText(/Assigned: Cleaning Team 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned: Security Lead/i)).toBeInTheDocument();
  });

  it('renders "View Details" buttons for incidents', () => {
    render(<IncidentFeed />);
    const viewBtns = screen.getAllByText(/View Details/i);
    expect(viewBtns.length).toBe(5); // One per incident
  });

  it('renders incident time information', () => {
    render(<IncidentFeed />);
    expect(screen.getByText('2 min ago')).toBeInTheDocument();
    expect(screen.getByText('8 min ago')).toBeInTheDocument();
  });

  it('has proper accessibility attributes for the filter group', () => {
    render(<IncidentFeed />);
    const group = screen.getByRole('group', { name: /Filter incidents by severity/i });
    expect(group).toBeInTheDocument();
  });
});
