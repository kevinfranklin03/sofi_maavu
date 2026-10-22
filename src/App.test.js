import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
  global.fetch = jest.fn();
});

function fillEnquiry() {
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Test & Customer' } });
  fireEvent.change(screen.getByLabelText('Contact number'), { target: { value: '+91 9000000000' } });
  fireEvent.change(screen.getByLabelText('Your message'), { target: { value: 'Dosa & idly, please.\n20 kg?' } });
}

test('visitors can explore products and reach the enquiry form', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: 'Explore our batters' })).toHaveAttribute('href', '#products');
  expect(screen.getByText('Dosa Batter')).toBeInTheDocument();
  expect(screen.getByText('Vadai Batter')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Enquire about dosa batter' })).toHaveAttribute('href', '#contact');
  expect(screen.getByRole('button', { name: 'Send enquiry' })).toBeInTheDocument();
  expect(document.title).toBe('Amma Nana Foods | Fresh Batter, Familiar Comfort');
});

test('mobile menu supports dismissal and closes on navigation', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  fireEvent.click(screen.getByRole('link', { name: 'Our batters' }));
  expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('link', { name: 'Our batters' })).toHaveAttribute('aria-current', 'location');
});

test('submits the enquiry to the API and waits for delivery before reporting success', async () => {
  let complete;
  global.fetch.mockImplementation(() => new Promise(resolve => { complete = resolve; }));
  window.history.replaceState({}, '', '/contact');
  render(<App />);
  fillEnquiry();
  fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
  expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  expect(screen.getByLabelText('Your name')).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Sending your enquiry');
  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toBe('/api/enquiries');
  expect(JSON.parse(options.body)).toEqual({ name: 'Test & Customer', contact: '+91 9000000000', message: 'Dosa & idly, please.\n20 kg?', website: '' });
  fireEvent.submit(screen.getByRole('button', { name: 'Sending…' }).closest('form'));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  await act(async () => { complete({ ok: true, json: async () => ({ message: 'Thank you! Your enquiry has been sent.' }) }); });
  expect(screen.getByRole('status')).toHaveTextContent('Your enquiry has been sent');
  expect(screen.getByRole('button', { name: 'Enquiry sent' })).toBeDisabled();
});

test.each([
  ['SMTP failure', () => Promise.resolve({ ok: false, json: async () => ({ error: 'We could not send your enquiry.' }) })],
  ['network failure', () => Promise.reject(new Error('Failed to fetch'))],
])('%s preserves the message and allows a retry', async (_label, failure) => {
  global.fetch.mockImplementationOnce(failure).mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Sent successfully.' }) });
  window.history.replaceState({}, '', '/contact');
  render(<App />);
  fillEnquiry();
  fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
  expect(await screen.findByRole('alert')).not.toBeEmptyDOMElement();
  expect(screen.getByLabelText('Your message')).toHaveValue('Dosa & idly, please.\n20 kg?');
  fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Sent successfully.'));
});

test('enquiry rejects whitespace and invalid contact numbers before making requests', () => {
  window.history.replaceState({}, '', '/contact');
  render(<App />);
  fillEnquiry();
  const message = screen.getByLabelText('Your message');
  fireEvent.change(message, { target: { value: '   ' } });
  expect(message).toBeInvalid();
  fireEvent.submit(screen.getByRole('button', { name: 'Send enquiry' }).closest('form'));
  expect(global.fetch).not.toHaveBeenCalled();
  fireEvent.change(message, { target: { value: 'A valid enquiry' } });
  const phone = screen.getByLabelText('Contact number');
  for (const value of ['invalid', '-------', '123']) {
    fireEvent.change(phone, { target: { value } });
    expect(phone).toBeInvalid();
  }
});

test.each([
  ['/about', '#about'], ['/products', '#products'], ['/why-us', '#why-us'],
  ['/who-we-serve', '#who-we-serve'], ['/contact', '#contact'],
])('legacy URL %s opens the matching section on the single page', async (path, hash) => {
  window.history.replaceState({}, '', path);
  render(<App />);
  await waitFor(() => expect(window.location.hash).toBe(hash));
  expect(window.location.pathname).toBe('/');
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Good mornings');
  expect(document.querySelectorAll('main > section[id]')).toHaveLength(6);
});

test('unknown URLs return to the single-page home', () => {
  window.history.replaceState({}, '', '/missing');
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Good mornings');
});

test('section links scroll once, support repeated clicks, and move keyboard focus', async () => {
  render(<App />);
  const link = screen.getByRole('link', { name: 'Explore our batters' });
  fireEvent.click(link);
  await waitFor(() => expect(document.getElementById('products')).toHaveFocus());
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'smooth', block: 'start' });
  fireEvent.click(link);
  await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2));
  expect(window.location.hash).toBe('#products');
});

test('reduced-motion section navigation scrolls instantly', async () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn(query => ({ matches: query.includes('prefers-reduced-motion'), addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  try {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Explore our batters' }));
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'start' });
  } finally { window.matchMedia = original; }
});

test('the mobile menu closes when switching to a desktop viewport', () => {
  const original = window.matchMedia;
  let changed;
  const remove = jest.fn();
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: (_name, handler) => { changed = handler; }, removeEventListener: remove }));
  try {
    const view = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    act(() => changed({ matches: true }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    view.unmount();
    expect(remove).toHaveBeenCalled();
  } finally { window.matchMedia = original; }
});
