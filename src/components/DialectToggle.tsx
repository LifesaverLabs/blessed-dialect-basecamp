import { useDialect } from '@/contexts/DialectContext';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Languages } from 'lucide-react';

/**
 * Toggle between Blesséd Dialekt and American Standard definitions.
 *
 * Like Norway's Bokmål (book language, based on Danish) and Nynorsk (New Norwegian,
 * based on rural dialects), we offer two written forms:
 * - American Standard: The prevailing written form, familiar to all English speakers
 * - Blesséd Dialekt: An experimental branch emphasizing intentional spelling changes
 *   that encode meaning, resist harmful patterns, and evolve toward human flourishing
 */
export function DialectToggle() {
  const { dialectMode, toggleDialectMode } = useDialect();

  const isBlessed = dialectMode === 'blessed';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDialectMode}
          className="gap-2 font-medium"
        >
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isBlessed ? 'Blesséd' : 'American'}
          </span>
          <span className="sm:hidden">
            {isBlessed ? 'BD' : 'AS'}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-4">
        <p className="font-semibold mb-2">
          {isBlessed ? 'Blesséd Dialekt' : 'American Standard'}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          {isBlessed
            ? 'Experimental spelling with intentional changes that encode meaning and resist harmful patterns.'
            : 'Prevailing American English spelling, familiar to all readers.'}
        </p>
        <p className="text-xs text-muted-foreground italic border-t pt-2">
          Like Norway's Bokmål and Nynorsk: two written forms of the same language.
          Bokmål evolved from Danish colonial influence; Nynorsk was created from
          rural Norwegian dialects to reclaim linguistic identity. Blesséd Dialekt
          is our Nynorsk—an intentional evolution toward human flourishing.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
