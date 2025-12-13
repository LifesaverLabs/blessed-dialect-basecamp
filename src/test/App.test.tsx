import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render without crashing', () => {
    // App includes BrowserRouter internally, so don't wrap it
    render(<App />);

    // App should render - this is a basic smoke test
    expect(document.body).toBeTruthy();
  });
});
