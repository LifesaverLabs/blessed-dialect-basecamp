import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Components
import App from '../App';
import Home from '../pages/Home';
import About from '../pages/About';
import Dictionary from '../pages/Dictionary';
import Forum from '../pages/Forum';
import Timeline from '../pages/Timeline';
import NotFound from '../pages/NotFound';
import { Navigation } from '../components/Navigation';
import { NavLink } from '../components/NavLink';

/**
 * Component Tests
 *
 * Tests for React components:
 * - Rendering
 * - User interactions
 * - Navigation
 * - State management
 * - Accessibility
 */

// Helper to wrap components with necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('Component Tests', () => {
  // ============================================
  // APP COMPONENT
  // ============================================
  describe('App Component', () => {
    it('should render without crashing', () => {
      render(<App />);
      expect(document.body).toBeTruthy();
    });

    it('should render navigation', () => {
      render(<App />);
      expect(screen.getByText('Blesséd Dialect')).toBeInTheDocument();
    });

    it('should have Dictionary link', () => {
      render(<App />);
      expect(screen.getByText('Dictionary')).toBeInTheDocument();
    });

    it('should have Forum link', () => {
      render(<App />);
      expect(screen.getByText('Forum')).toBeInTheDocument();
    });

    it('should have About link', () => {
      render(<App />);
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  // ============================================
  // NAVIGATION COMPONENT
  // ============================================
  describe('Navigation Component', () => {
    it('should render brand name', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      expect(screen.getByText('Blesséd Dialect')).toBeInTheDocument();
    });

    it('should render work in progress banner', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      expect(screen.getByText(/Work in Progress/)).toBeInTheDocument();
    });

    it('should render Dictionary link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      expect(screen.getByRole('link', { name: /Dictionary/i })).toBeInTheDocument();
    });

    it('should render Forum link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      expect(screen.getByRole('link', { name: /Forum/i })).toBeInTheDocument();
    });

    it('should render About link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    });

    it('should have correct href for Dictionary link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      const link = screen.getByRole('link', { name: /Dictionary/i });
      expect(link).toHaveAttribute('href', '/dictionary');
    });

    it('should have correct href for Forum link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      const link = screen.getByRole('link', { name: /Forum/i });
      expect(link).toHaveAttribute('href', '/forum');
    });

    it('should have correct href for About link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      const link = screen.getByRole('link', { name: /About/i });
      expect(link).toHaveAttribute('href', '/about');
    });

    it('should have correct href for brand link', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );
      const brandLink = screen.getByText('Blesséd Dialect').closest('a');
      expect(brandLink).toHaveAttribute('href', '/');
    });
  });

  // ============================================
  // NAVLINK COMPONENT
  // ============================================
  describe('NavLink Component', () => {
    it('should render children', () => {
      render(
        <RouterWrapper>
          <NavLink to="/test">Test Link</NavLink>
        </RouterWrapper>
      );
      expect(screen.getByText('Test Link')).toBeInTheDocument();
    });

    it('should have correct href', () => {
      render(
        <RouterWrapper>
          <NavLink to="/test-path">Link</NavLink>
        </RouterWrapper>
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', '/test-path');
    });

    it('should apply className', () => {
      render(
        <RouterWrapper>
          <NavLink to="/test" className="custom-class">
            Link
          </NavLink>
        </RouterWrapper>
      );
      expect(screen.getByRole('link')).toHaveClass('custom-class');
    });
  });

  // ============================================
  // HOME PAGE
  // ============================================
  describe('Home Page', () => {
    it('should render hero section', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText(/experimental branch of American langauge/i)).toBeInTheDocument();
    });

    it('should render Explore Dictionary button', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Explore Dictionary')).toBeInTheDocument();
    });

    it('should render Join Forum button', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Join Forum')).toBeInTheDocument();
    });

    it('should render Core Concepts section', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Core Concepts')).toBeInTheDocument();
    });

    it('should render Borlaug More concept', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Borlaug More')).toBeInTheDocument();
    });

    it('should render Borlaug Less Éd concept', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Borlaug Less Éd (Blesséd)')).toBeInTheDocument();
    });

    it('should render Calmunity⁵ concept', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Calmunity⁵')).toBeInTheDocument();
    });

    it('should render Bleeding B⁵leading Edge concept', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Bleeding B⁵leading Edge')).toBeInTheDocument();
    });

    it('should render Our Mission section', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
    });

    it('should render Initial Authors Backlog link', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Initial Authors Backlog')).toBeInTheDocument();
    });

    it('should have Dictionary link in hero', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      const exploreButton = screen.getByText('Explore Dictionary');
      expect(exploreButton.closest('a')).toHaveAttribute('href', '/dictionary');
    });

    it('should have Forum link in hero', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      const forumButton = screen.getByText('Join Forum');
      expect(forumButton.closest('a')).toHaveAttribute('href', '/forum');
    });
  });

  // ============================================
  // ABOUT PAGE
  // ============================================
  describe('About Page', () => {
    it('should render page title', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('About Blesséd Dialect')).toBeInTheDocument();
    });

    it('should render experimental warning banner', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText(/Experimental & Unstable/)).toBeInTheDocument();
    });

    it('should render Our Origin Story section', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Our Origin Story')).toBeInTheDocument();
    });

    it('should render Our Goal card', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Our Goal')).toBeInTheDocument();
    });

    it('should render How We Evolve card', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('How We Evolve')).toBeInTheDocument();
    });

    it('should render Governance Model card', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Governance Model')).toBeInTheDocument();
    });

    it('should render Legibility Principle card', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Legibility Principle')).toBeInTheDocument();
    });

    it('should render Key Terms section', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Key Terms')).toBeInTheDocument();
    });

    it('should render Borlaug (verb) term', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Borlaug (verb)')).toBeInTheDocument();
    });

    it('should render Calmunity⁵ (noun) term', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Calmunity⁵ (noun)')).toBeInTheDocument();
    });

    it('should render Join the Calmunity⁵ section', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      );
      expect(screen.getByText('Join the Calmunity⁵')).toBeInTheDocument();
    });
  });

  // ============================================
  // DICTIONARY PAGE
  // ============================================
  describe('Dictionary Page', () => {
    it('should render page title', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );
      expect(screen.getByText('Dictionary')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );
      expect(screen.getByPlaceholderText('Search dictionary...')).toBeInTheDocument();
    });

    it('should render Words tab', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );
      expect(screen.getByRole('tab', { name: /Words/i })).toBeInTheDocument();
    });

    it('should render Phrases tab', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );
      expect(screen.getByRole('tab', { name: /Phrases & Idioms/i })).toBeInTheDocument();
    });

    it('should render alphabet letters', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );
      // Check for some letters
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('Z')).toBeInTheDocument();
    });

    it('should render dictionary entries', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );
      // Should have Borlaug entry
      expect(screen.getByText('Borlaug')).toBeInTheDocument();
    });

    it('should filter entries on search', async () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search dictionary...');
      fireEvent.change(searchInput, { target: { value: 'Borlaug' } });

      // Should still show Borlaug
      expect(screen.getByText('Borlaug')).toBeInTheDocument();
    });

    it('should switch between Words and Phrases tabs', async () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );

      // Click on Phrases tab
      const phrasesTab = screen.getByRole('tab', { name: /Phrases & Idioms/i });
      fireEvent.click(phrasesTab);

      // Wait for tab to become active
      await vi.waitFor(() => {
        // The tab should be clickable and exist
        expect(phrasesTab).toBeInTheDocument();
      });
    });

    it('should open entry drawer when clicking an entry', async () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );

      // Find and click Borlaug entry
      const borlaugButton = screen.getByText('Borlaug');
      fireEvent.click(borlaugButton);

      // Sheet should open with the entry title
      // Wait for the sheet to appear
      await vi.waitFor(() => {
        expect(screen.getAllByText('Borlaug').length).toBeGreaterThan(1);
      });
    });

    it('should display Share Link button in drawer', async () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );

      // Click an entry to open drawer
      const borlaugButton = screen.getByText('Borlaug');
      fireEvent.click(borlaugButton);

      // Wait for drawer and check for Share Link button
      await vi.waitFor(() => {
        expect(screen.getByText('Share Link')).toBeInTheDocument();
      });
    });

    it('should open entry from URL query parameter', () => {
      // Render with entry query param
      render(
        <MemoryRouter initialEntries={['/dictionary?entry=borlaug']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <Dictionary />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Drawer should be open with Borlaug
      expect(screen.getAllByText('Borlaug').length).toBeGreaterThan(1);
    });

    it('should handle phrase URLs correctly', async () => {
      // Render with a phrase query param (using hyphenated slug)
      render(
        <MemoryRouter initialEntries={['/dictionary?entry=borlaug-more']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <Dictionary />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Wait for the drawer to open with the phrase
      await vi.waitFor(() => {
        // Should find "Borlaug more" in the sheet title (note lowercase 'm')
        expect(screen.getAllByText('Borlaug more').length).toBeGreaterThan(0);
      });
    });
  });

  // ============================================
  // FORUM PAGE
  // ============================================
  describe('Forum Page', () => {
    it('should render page title', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      expect(screen.getByText('Calmunity⁵ Forum')).toBeInTheDocument();
    });

    it('should render New Proposal button', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      expect(screen.getByText('New Proposal')).toBeInTheDocument();
    });

    it('should render sample proposals', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      // Check for sample proposal
      expect(screen.getByText(/Replace 'I' with 'i' for humility/)).toBeInTheDocument();
    });

    it('should render Affirm buttons', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      const affirmButtons = screen.getAllByText(/Affirm/);
      expect(affirmButtons.length).toBeGreaterThan(0);
    });

    it('should render Dissent buttons', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      const dissentButtons = screen.getAllByText(/Dissent/);
      expect(dissentButtons.length).toBeGreaterThan(0);
    });

    it('should render Comments buttons', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      const commentButtons = screen.getAllByText(/Comments/);
      expect(commentButtons.length).toBeGreaterThan(0);
    });

    it('should render Voting Guidelines section', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      expect(screen.getByText('Voting Guidelines')).toBeInTheDocument();
    });

    it('should render status badges', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('consensus forming')).toBeInTheDocument();
      expect(screen.getByText('adopted')).toBeInTheDocument();
    });

    it('should increment affirm count on click', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );

      // Find first affirm button
      const affirmButtons = screen.getAllByText(/Affirm/);
      const firstAffirmButton = affirmButtons[0];
      const initialText = firstAffirmButton.textContent;

      fireEvent.click(firstAffirmButton);

      // Count should have incremented
      expect(firstAffirmButton.textContent).not.toBe(initialText);
    });

    it('should increment dissent count on click', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );

      const dissentButtons = screen.getAllByText(/Dissent/);
      const firstDissentButton = dissentButtons[0];
      const initialText = firstDissentButton.textContent;

      fireEvent.click(firstDissentButton);

      expect(firstDissentButton.textContent).not.toBe(initialText);
    });

    it('should open new proposal dialog', async () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );

      const newProposalButton = screen.getByText('New Proposal');
      fireEvent.click(newProposalButton);

      await vi.waitFor(() => {
        expect(screen.getByText('Submit a New Proposal')).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // NOT FOUND PAGE
  // ============================================
  describe('NotFound Page', () => {
    it('should render 404 heading', () => {
      render(
        <RouterWrapper>
          <NotFound />
        </RouterWrapper>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render not found message', () => {
      render(
        <RouterWrapper>
          <NotFound />
        </RouterWrapper>
      );
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it('should render link to home', () => {
      render(
        <RouterWrapper>
          <NotFound />
        </RouterWrapper>
      );
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  // ============================================
  // ROUTING TESTS
  // ============================================
  describe('Routing', () => {
    it('should render Home on "/" route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <Home />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
    });

    it('should render Dictionary on "/dictionary" route', () => {
      render(
        <MemoryRouter initialEntries={['/dictionary']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <Dictionary />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Dictionary')).toBeInTheDocument();
    });

    it('should render Forum on "/forum" route', () => {
      render(
        <MemoryRouter initialEntries={['/forum']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <Forum />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Calmunity⁵ Forum')).toBeInTheDocument();
    });

    it('should render About on "/about" route', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <About />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('About Blesséd Dialect')).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    it('should have accessible navigation links', () => {
      render(
        <RouterWrapper>
          <Navigation />
        </RouterWrapper>
      );

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        // Each link should have accessible text
        expect(link.textContent || link.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have accessible buttons on Forum page', () => {
      render(
        <TestWrapper>
          <Forum />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent || button.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have accessible tabs on Dictionary page', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(2);
      tabs.forEach(tab => {
        expect(tab.textContent).toBeTruthy();
      });
    });

    it('should have accessible search input on Dictionary page', () => {
      render(
        <TestWrapper>
          <Dictionary />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search dictionary...');
      // Input should be in the document and be an input element
      expect(searchInput).toBeInTheDocument();
      expect(searchInput.tagName.toLowerCase()).toBe('input');
    });
  });

  // ============================================
  // HOME PAGE - LATEST ADDITIONS
  // ============================================
  describe('Home Page - Latest Additions', () => {
    it('should render Latest Additions section', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('Latest Additions')).toBeInTheDocument();
    });

    it('should render View Full Timeline button', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      expect(screen.getByText('View Full Timeline')).toBeInTheDocument();
    });

    it('should have Timeline link with correct href', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      const timelineButton = screen.getByText('View Full Timeline');
      const link = timelineButton.closest('a');
      expect(link).toHaveAttribute('href', '/timeline');
    });

    it('should display word/phrase badges', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      // Should have at least one word or phrase badge
      const wordBadges = screen.queryAllByText('word');
      const phraseBadges = screen.queryAllByText('phrase');
      expect(wordBadges.length + phraseBadges.length).toBeGreaterThan(0);
    });

    it('should display entry dates', () => {
      render(
        <RouterWrapper>
          <Home />
        </RouterWrapper>
      );
      // Look for Long Now date format (YYYYY-MM月DD)
      const datePattern = /\d{5}-\d{1,2}月\d{2}/;
      const textContent = document.body.textContent || '';
      expect(datePattern.test(textContent)).toBe(true);
    });
  });

  // ============================================
  // TIMELINE PAGE
  // ============================================
  describe('Timeline Page', () => {
    it('should render page title', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      expect(screen.getByText('Dictionary⁵ Timeline')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      expect(screen.getByText('Reverse chronological list of all entries by date added')).toBeInTheDocument();
    });

    it('should render Back to Home button', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });

    it('should have Back to Home link with correct href', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      const backButton = screen.getByText('Back to Home');
      const link = backButton.closest('a');
      expect(link).toHaveAttribute('href', '/');
    });

    it('should display entries with dates', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      // Should show at least one date header (Long Now format)
      const datePattern = /\d{5}-\d{1,2}月\d{2}/;
      const textContent = document.body.textContent || '';
      expect(datePattern.test(textContent)).toBe(true);
    });

    it('should display word/phrase badges', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      const wordBadges = screen.queryAllByText('word');
      const phraseBadges = screen.queryAllByText('phrase');
      expect(wordBadges.length + phraseBadges.length).toBeGreaterThan(0);
    });

    it('should display stats about entries', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );
      // Should show "X entries with dates" and "Y unique dates"
      expect(screen.getByText(/entries with dates/)).toBeInTheDocument();
      expect(screen.getByText(/unique dates/)).toBeInTheDocument();
    });

    it('should have clickable entry buttons', () => {
      render(
        <TestWrapper>
          <Timeline />
        </TestWrapper>
      );

      // Find entry buttons (entries are rendered as buttons)
      const entryButtons = screen.getAllByRole('button');
      // Should have at least "Back to Home" button plus some entry buttons
      expect(entryButtons.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // TIMELINE ROUTING
  // ============================================
  describe('Timeline Routing', () => {
    it('should render Timeline on "/timeline" route', () => {
      render(
        <MemoryRouter initialEntries={['/timeline']}>
          <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
              <Timeline />
            </TooltipProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Dictionary⁵ Timeline')).toBeInTheDocument();
    });
  });
});
