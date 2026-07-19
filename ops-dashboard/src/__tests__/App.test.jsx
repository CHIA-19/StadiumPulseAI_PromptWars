import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Ops Dashboard', () => {
  it('renders the command shell correctly', () => {
    render(<App />);
    const title = screen.getByText(/Pulse Command Dashboard/i);
    expect(title).toBeInTheDocument();
  });
});
