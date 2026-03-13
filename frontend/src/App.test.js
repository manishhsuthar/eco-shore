import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => [],
    })
  );

  Object.defineProperty(global.navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: jest.fn(),
    },
  });

  window.scrollTo = jest.fn();
  window.location.hash = '';
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders beach pages navigation', async () => {
  render(<App />);
  expect(await screen.findByText(/Beachfront editorial/i)).toBeInTheDocument();
  expect(screen.getByText(/Ecoshore/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Atlas' })).toBeInTheDocument();
});
