import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/layout/Navbar';
import { vi } from 'vitest';

describe('Navbar Component', () => {
  it('renders the branding correctly', () => {
    render(<Navbar lang="EN" dark={false} alertCount={0} />);
    expect(screen.getByText(/StadiumPulse AI/i)).toBeInTheDocument();
    expect(screen.getByText(/FIFA World Cup 2026/i)).toBeInTheDocument();
  });

  it('displays notification badges correctly', () => {
    render(<Navbar lang="EN" dark={false} alertCount={5} />);
    const badge = screen.getByLabelText(/5 unread notifications/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('5');
  });

  it('triggers language toggle', () => {
    const onLangClick = vi.fn();
    render(<Navbar lang="EN" dark={false} alertCount={0} onLangClick={onLangClick} />);
    const btn = screen.getByLabelText(/Change language, current is EN/i);
    fireEvent.click(btn);
    expect(onLangClick).toHaveBeenCalledTimes(1);
  });
});
