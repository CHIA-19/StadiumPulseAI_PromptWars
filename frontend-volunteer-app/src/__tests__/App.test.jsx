import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Volunteer App', () => {
  it('renders the app shell correctly', () => {
    render(<App />);
    const title = screen.getByText(/PulseAssist/i);
    expect(title).toBeInTheDocument();
  });
});
