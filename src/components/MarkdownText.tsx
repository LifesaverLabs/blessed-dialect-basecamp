import ReactMarkdown from 'react-markdown';

interface MarkdownTextProps {
  children: string;
  className?: string;
}

/**
 * Renders markdown text with proper styling for dictionary entries.
 * Supports inline links [text](url) and basic formatting.
 * Links open in new tabs for external URLs.
 */
export const MarkdownText = ({ children, className = '' }: MarkdownTextProps) => {
  return (
    <span className={className}>
      <ReactMarkdown
        components={{
          // Style links to be visible and open in new tab
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          // Keep paragraphs inline-friendly
          p: ({ children }) => <span>{children}</span>,
        }}
      >
        {children}
      </ReactMarkdown>
    </span>
  );
};
