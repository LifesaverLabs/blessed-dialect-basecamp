import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownText } from './MarkdownText';

describe('MarkdownText Component', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================
  describe('Basic Rendering', () => {
    it('should render plain text', () => {
      render(<MarkdownText>Hello world</MarkdownText>);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('should apply className to wrapper span', () => {
      const { container } = render(
        <MarkdownText className="text-lg font-bold">Test</MarkdownText>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('text-lg');
      expect(wrapper.className).toContain('font-bold');
    });

    it('should render without className', () => {
      const { container } = render(<MarkdownText>Test</MarkdownText>);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe('SPAN');
    });
  });

  // ============================================
  // LINK RENDERING
  // ============================================
  describe('Link Rendering', () => {
    it('should render markdown links as anchor tags', () => {
      render(<MarkdownText>[Click here](https://example.com)</MarkdownText>);
      const link = screen.getByRole('link', { name: 'Click here' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should open links in new tab', () => {
      render(<MarkdownText>[External](https://example.com)</MarkdownText>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should have noopener noreferrer for security', () => {
      render(<MarkdownText>[Secure Link](https://example.com)</MarkdownText>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should style links with primary color', () => {
      render(<MarkdownText>[Styled](https://example.com)</MarkdownText>);
      const link = screen.getByRole('link');
      expect(link.className).toContain('text-primary');
      expect(link.className).toContain('hover:underline');
    });

    it('should render multiple links', () => {
      render(
        <MarkdownText>
          Check [link one](https://one.com) and [link two](https://two.com)
        </MarkdownText>
      );
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://one.com');
      expect(links[1]).toHaveAttribute('href', 'https://two.com');
    });
  });

  // ============================================
  // TEXT WITH MIXED CONTENT
  // ============================================
  describe('Mixed Content', () => {
    it('should render text with embedded link', () => {
      render(
        <MarkdownText>
          See the [documentation](https://docs.example.com) for details.
        </MarkdownText>
      );
      expect(screen.getByText(/See the/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'documentation' })).toBeInTheDocument();
      expect(screen.getByText(/for details/)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      render(<MarkdownText>Special: é, ñ, ü, ⁵</MarkdownText>);
      expect(screen.getByText(/Special: é, ñ, ü, ⁵/)).toBeInTheDocument();
    });

    it('should handle URLs with query parameters', () => {
      render(
        <MarkdownText>
          [Video](https://youtube.com/watch?v=abc123&t=60)
        </MarkdownText>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://youtube.com/watch?v=abc123&t=60');
    });
  });

  // ============================================
  // PARAGRAPH HANDLING
  // ============================================
  describe('Paragraph Handling', () => {
    it('should render paragraphs as inline spans', () => {
      const { container } = render(<MarkdownText>A paragraph</MarkdownText>);
      // ReactMarkdown wraps text in <p>, but our component converts to <span>
      const paragraphElements = container.querySelectorAll('p');
      expect(paragraphElements.length).toBe(0);
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const { container } = render(<MarkdownText>{''}</MarkdownText>);
      expect(container.textContent).toBe('');
    });

    it('should handle string with only whitespace', () => {
      render(<MarkdownText>{'   '}</MarkdownText>);
      // Whitespace should be preserved
    });

    it('should handle brackets without being a link', () => {
      render(<MarkdownText>Use [brackets] for emphasis</MarkdownText>);
      const links = screen.queryAllByRole('link');
      expect(links).toHaveLength(0);
      expect(screen.getByText(/\[brackets\]/)).toBeInTheDocument();
    });
  });
});
