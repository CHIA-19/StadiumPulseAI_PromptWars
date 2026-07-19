import { render, screen, fireEvent } from '@testing-library/react';
import TransitPlanner from '../pages/TransitPlanner';

describe('TransitPlanner Component', () => {
  it('renders the page title', () => {
    render(<TransitPlanner />);
    expect(screen.getByText(/Smart Transit Planner/i)).toBeInTheDocument();
  });

  it('renders the subtitle with agent info', () => {
    render(<TransitPlanner />);
    expect(screen.getByText(/Mobility Agent/i)).toBeInTheDocument();
    expect(screen.getByText(/Low-carbon routing/i)).toBeInTheDocument();
  });

  it('renders all 4 transit options from mock data', () => {
    render(<TransitPlanner />);
    // Names appear in both transit list and carbon comparison, so use getAllByText
    expect(screen.getAllByText('Metro Line 3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bus 47X Express').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Walk – East Gate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rideshare \/ Uber/i).length).toBeGreaterThan(0);
  });

  it('shows Metro Line 3 as AI Pick', () => {
    render(<TransitPlanner />);
    expect(screen.getByText(/✓ AI Pick/i)).toBeInTheDocument();
  });

  it('renders CO₂ values for all transit options', () => {
    render(<TransitPlanner />);
    // Multiple CO₂ values may appear (transit list + carbon comparison)
    const co2Elements = screen.getAllByText(/CO₂/);
    expect(co2Elements.length).toBeGreaterThan(0);
  });

  it('renders the Surge Predictions section', () => {
    render(<TransitPlanner />);
    expect(screen.getByText(/Surge Predictions/i)).toBeInTheDocument();
  });

  it('renders surge prediction times', () => {
    render(<TransitPlanner />);
    expect(screen.getByText('21:30')).toBeInTheDocument();
    expect(screen.getByText('21:45')).toBeInTheDocument();
    expect(screen.getByText('22:00')).toBeInTheDocument();
    expect(screen.getByText('22:20')).toBeInTheDocument();
  });

  it('renders the Carbon Comparison section', () => {
    render(<TransitPlanner />);
    expect(screen.getByText(/Carbon Comparison/i)).toBeInTheDocument();
  });

  it('selects a transit option when clicked', () => {
    render(<TransitPlanner />);
    // Bus option is a listbox option role
    const options = screen.getAllByRole('option');
    const busOption = options.find(o => o.textContent.includes('Bus 47X Express'));
    fireEvent.click(busOption);
    expect(busOption).toHaveAttribute('aria-selected', 'true');
  });

  it('updates the Start Navigation button when a transit is selected', () => {
    render(<TransitPlanner />);
    const options = screen.getAllByRole('option');
    const busOption = options.find(o => o.textContent.includes('Bus 47X Express'));
    fireEvent.click(busOption);
    expect(screen.getByText(/Start Navigation — Bus 47X Express/i)).toBeInTheDocument();
  });

  it('allows keyboard selection via Enter key', () => {
    render(<TransitPlanner />);
    const options = screen.getAllByRole('option');
    const walkOption = options.find(o => o.textContent.includes('Walk'));
    fireEvent.keyDown(walkOption, { key: 'Enter' });
    expect(walkOption).toHaveAttribute('aria-selected', 'true');
  });

  it('renders the best departure time', () => {
    render(<TransitPlanner />);
    const departureTimes = screen.getAllByText('21:47');
    expect(departureTimes.length).toBeGreaterThan(0);
  });
});
