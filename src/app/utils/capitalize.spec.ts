import { capitalizeFirst } from './capitalize';

describe('capitalizeFirst', () => {
  it('upper-cases only the first letter', () => {
    expect(capitalizeFirst('endorsements')).toBe('Endorsements');
    expect(capitalizeFirst('Number of proposals')).toBe('Number of proposals');
    expect(capitalizeFirst('área')).toBe('Área');
  });

  it('handles empty values', () => {
    expect(capitalizeFirst('')).toBe('');
    expect(capitalizeFirst(undefined)).toBe('');
  });
});
