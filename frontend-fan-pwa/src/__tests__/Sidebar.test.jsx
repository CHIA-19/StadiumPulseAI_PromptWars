import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/layout/Sidebar';
import { vi } from 'vitest';

describe('Sidebar Component', () => {
  it('renders all sections', () => {
    render(<Sidebar active="home" setActive={() => {}} />);
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Fan Services')).toBeInTheDocument();
    expect(screen.getByText('Safety & Green')).toBeInTheDocument();
  });

  it('handles navigation clicks', () => {
    const setActive = vi.fn();
    render(<Sidebar active="home" setActive={setActive} />);
    const heatmapBtn = screen.getByRole('button', { name: /Crowd Heatmap/i });
    fireEvent.click(heatmapBtn);
    expect(setActive).toHaveBeenCalledWith('heatmap');
  });
});
