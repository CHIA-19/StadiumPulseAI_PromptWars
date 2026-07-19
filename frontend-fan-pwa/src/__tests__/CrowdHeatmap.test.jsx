import { render, screen, fireEvent } from '@testing-library/react';
import CrowdHeatmap from '../pages/CrowdHeatmap';

describe('CrowdHeatmap Component', () => {
  it('renders all gates by default', () => {
    render(<CrowdHeatmap />);
    expect(screen.getByText('Gate A1 – North')).toBeInTheDocument();
    expect(screen.getByText('Gate C3 – South')).toBeInTheDocument();
  });

  it('filters gates to critical only', () => {
    render(<CrowdHeatmap />);
    const criticalBtn = screen.getByRole('button', { name: /CRITICAL/i });
    fireEvent.click(criticalBtn);
    
    // Gate A1 is calm, should not be in document
    expect(screen.queryByText('Gate A1 – North')).not.toBeInTheDocument();
    // Gate C3 is critical, should be in document
    expect(screen.getByText('Gate C3 – South')).toBeInTheDocument();
  });
});
