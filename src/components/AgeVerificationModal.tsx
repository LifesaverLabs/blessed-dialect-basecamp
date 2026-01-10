import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAgeVerification, MIN_AGE } from '@/contexts/AgeVerificationContext';

export function AgeVerificationModal() {
  const { showVerificationModal, setShowVerificationModal, verifyAge } = useAgeVerification();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const year = parseInt(birthYear, 10);
    const month = parseInt(birthMonth, 10);
    const day = parseInt(birthDay, 10);

    // Validate inputs
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setError('Please enter a valid date');
      return;
    }

    if (month < 1 || month > 12) {
      setError('Month must be between 1 and 12');
      return;
    }

    if (day < 1 || day > 31) {
      setError('Day must be between 1 and 31');
      return;
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      setError(`Year must be between 1900 and ${currentYear}`);
      return;
    }

    const birthDate = new Date(year, month - 1, day);

    // Check if date is valid (e.g., not Feb 30)
    if (birthDate.getMonth() !== month - 1) {
      setError('Invalid date for the given month');
      return;
    }

    const verified = verifyAge(birthDate);

    if (!verified) {
      setError(`You must be at least ${MIN_AGE} years old to access this content.`);
    }
  };

  const handleClose = () => {
    setShowVerificationModal(false);
    setError('');
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
  };

  return (
    <Dialog open={showVerificationModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Age Verification Required</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              The Adult Sektion contains content related to intimate relationships,
              sexuality, and safewords that require age-appropriate access.
            </p>
            <p>
              Please enter your birthday to verify you are at least {MIN_AGE} years old.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Note: Age {MIN_AGE} aligns with puberty timing and protects the 7% of youth
              with early experiences. Sex edukation must koördinate with puberty⁵ population
              penetrance. This content diskourages sexual activity under age 16 while
              equipping youth with safeword resisdænce. For jurisdictional adjustments
              or concerns, please contact{'team@lifesaverlabs.org'}
              <a
                href="mailto:team@lifesaverlabs.org"
                className="text-primary hover:underline"
              >
                team@lifesaverlabs.org
              </a>
            </p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="birthYear">Year</Label>
                <Input
                  id="birthYear"
                  type="number"
                  placeholder="YYYY"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthMonth">Month</Label>
                <Input
                  id="birthMonth"
                  type="number"
                  placeholder="MM"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  min="1"
                  max="12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDay">Day</Label>
                <Input
                  id="birthDay"
                  type="number"
                  placeholder="DD"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  min="1"
                  max="31"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Verify Age</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
