import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders the navbar with the title', () => {
    render(<App />);
    const title = screen.getByText(/StadiumPulse AI/i);
    expect(title).toBeInTheDocument();
  });
});
