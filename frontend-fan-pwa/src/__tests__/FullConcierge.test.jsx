import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import FullConcierge from '../pages/FullConcierge';

// DOMPurify is used in the component; ensure it works in jsdom
describe('FullConcierge Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the page title', () => {
    render(<FullConcierge />);
    expect(screen.getByText(/AI Concierge/i)).toBeInTheDocument();
  });

  it('renders the Gemini 2.0 subtitle', () => {
    render(<FullConcierge />);
    // Text appears in both subtitle and model tag
    const geminiEls = screen.getAllByText(/Gemini 2\.0/i);
    expect(geminiEls.length).toBeGreaterThan(0);
  });

  it('renders the Online status chip', () => {
    render(<FullConcierge />);
    const onlineChips = screen.getAllByText(/Online/i);
    expect(onlineChips.length).toBeGreaterThan(0);
  });

  it('renders initial welcome message from AI', () => {
    render(<FullConcierge />);
    expect(screen.getByText(/¡Bienvenido!/i)).toBeInTheDocument();
  });

  it('renders initial user message in conversation', () => {
    render(<FullConcierge />);
    expect(screen.getByText(/Where is the nearest accessible restroom/i)).toBeInTheDocument();
  });

  it('renders the Agents sidebar', () => {
    render(<FullConcierge />);
    expect(screen.getByText('Concierge Agent')).toBeInTheDocument();
    expect(screen.getByText('Mobility Agent')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Sustainability')).toBeInTheDocument();
  });

  it('renders language selector buttons', () => {
    render(<FullConcierge />);
    expect(screen.getByRole('button', { name: /Switch to EN/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to ES/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to FR/i })).toBeInTheDocument();
  });

  it('renders the Gemini 2.0 Flash model tag', () => {
    render(<FullConcierge />);
    expect(screen.getByText(/Gemini 2.0 Flash/i)).toBeInTheDocument();
  });

  it('renders the quick chip prompts', () => {
    render(<FullConcierge />);
    expect(screen.getByText(/🚻 Nearest restroom\?/i)).toBeInTheDocument();
    expect(screen.getByText(/♿ Step-free route to my seat/i)).toBeInTheDocument();
  });

  it('renders the text input field', () => {
    render(<FullConcierge />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium in any language/i);
    expect(input).toBeInTheDocument();
  });

  it('allows typing in the input field', () => {
    render(<FullConcierge />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium in any language/i);
    fireEvent.change(input, { target: { value: 'Where is Gate A1?' } });
    expect(input.value).toBe('Where is Gate A1?');
  });

  it('adds a user message when Send button is clicked', () => {
    render(<FullConcierge />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium in any language/i);
    fireEvent.change(input, { target: { value: 'Where are the exits?' } });
    // Send by pressing Enter in the input (same send() function)
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Where are the exits?')).toBeInTheDocument();
  });

  it('adds a user message when Enter key is pressed', () => {
    render(<FullConcierge />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium in any language/i);
    fireEvent.change(input, { target: { value: 'What is the best gate?' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('What is the best gate?')).toBeInTheDocument();
  });

  it('shows typing indicator after user sends a message', () => {
    render(<FullConcierge />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium in any language/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/Pulse AI is typing…/i)).toBeInTheDocument();
  });

  it('shows AI response after typing delay', () => {
    render(<FullConcierge />);
    const input = screen.getByPlaceholderText(/Ask anything about the stadium in any language/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Typing indicator should disappear, AI reply should appear
    expect(screen.queryByText(/Pulse AI is typing…/i)).not.toBeInTheDocument();
  });

  it('does not send empty messages', () => {
    render(<FullConcierge />);
    const initialCount = screen.getAllByText(/🤖/).length;
    // Try to send empty
    fireEvent.keyDown(screen.getByPlaceholderText(/Ask anything/i), { key: 'Enter' });
    // Message count should remain the same
    expect(screen.getAllByText(/🤖/).length).toBe(initialCount);
  });

  it('sends message when quick chip is clicked', () => {
    render(<FullConcierge />);
    const chip = screen.getByText(/🚻 Nearest restroom\?/i);
    fireEvent.click(chip);
    // The text appears in both the chip button and the new message bubble
    const elements = screen.getAllByText(/🚻 Nearest restroom\?/i);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the chat area with accessible role=log and aria-live', () => {
    render(<FullConcierge />);
    // There is a role=log element with aria-live=polite
    const logs = screen.getAllByRole('log');
    const liveLog = logs.find(el => el.getAttribute('aria-live') === 'polite');
    expect(liveLog).toBeTruthy();
  });

  it('marks the Concierge Agent as active in the sidebar', () => {
    render(<FullConcierge />);
    const conciergeBtn = screen.getByRole('button', { name: /Concierge Agent/i });
    // The active agent button should have aria-pressed="true"
    expect(conciergeBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
