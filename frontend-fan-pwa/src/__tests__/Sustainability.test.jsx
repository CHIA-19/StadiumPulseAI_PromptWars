import { render, screen } from '@testing-library/react';
import Sustainability from '../pages/Sustainability';

describe('Sustainability Component', () => {
  it('renders the page title', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Sustainability Hub/i)).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Track your carbon footprint/i)).toBeInTheDocument();
  });

  it('renders the Your Impact section', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Your Impact/i)).toBeInTheDocument();
  });

  it('renders the personal CO₂ savings', () => {
    render(<Sustainability />);
    expect(screen.getByText('2.7 kg')).toBeInTheDocument();
    expect(screen.getByText(/CO₂ saved vs driving/i)).toBeInTheDocument();
  });

  it('renders the Green Fan badge tier', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Green Fan Bronze/i)).toBeInTheDocument();
  });

  it('renders the next tier progression', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Next Tier: Silver/i)).toBeInTheDocument();
  });

  it('renders the Stadium Impact section', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Stadium Impact Today/i)).toBeInTheDocument();
  });

  it('renders solar power percentage', () => {
    render(<Sustainability />);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText(/Powered by onsite solar/i)).toBeInTheDocument();
  });

  it('renders waste diversion rate', () => {
    render(<Sustainability />);
    expect(screen.getByText('89%')).toBeInTheDocument();
    expect(screen.getByText(/Waste diverted from landfill/i)).toBeInTheDocument();
  });

  it('renders the Fan Leaderboard section', () => {
    render(<Sustainability />);
    expect(screen.getByText(/Fan Leaderboard/i)).toBeInTheDocument();
  });

  it('renders all 5 leaderboard entries', () => {
    render(<Sustainability />);
    expect(screen.getByText('Björn Larsson')).toBeInTheDocument();
    expect(screen.getByText('Anika Patel')).toBeInTheDocument();
    expect(screen.getByText('Gabriel Costa')).toBeInTheDocument();
    expect(screen.getByText('Yuki Tanaka')).toBeInTheDocument();
    expect(screen.getByText('Lena Müller')).toBeInTheDocument();
  });

  it('renders CO₂ values for leaderboard entries', () => {
    render(<Sustainability />);
    expect(screen.getByLabelText(/0.2 kg of Carbon dioxide/i)).toBeInTheDocument();
  });

  it('renders leaderboard ranks', () => {
    render(<Sustainability />);
    expect(screen.getByLabelText(/Rank 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rank 5/i)).toBeInTheDocument();
  });

  it('renders leaderboard as a list with accessible role', () => {
    render(<Sustainability />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });
});
