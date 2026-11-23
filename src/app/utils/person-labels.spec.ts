import { withUniqueLabels } from './person-labels';

describe('withUniqueLabels', () => {
  it('gives every person a distinct, non-empty label', () => {
    // Regression: blank names (deleted accounts) and namesakes shared one bar in the chart.
    const people = [
      { id: '1', name: 'Ivan', comments: 9 },
      { id: '2', name: '', comments: 8 },
      { id: '3', name: '  ', comments: 7 },
      { id: '4', name: 'Maria', comments: 6 },
      { id: '5', name: 'Maria', comments: 5 },
    ];
    const labels = withUniqueLabels(people, 'Unnamed participant').map(p => p.label);
    expect(labels).toEqual(['Ivan', 'Unnamed participant #2', 'Unnamed participant #3', 'Maria #4', 'Maria #5']);
    expect(new Set(labels).size).toBe(people.length);
  });

  it('keeps the other fields', () => {
    expect(withUniqueLabels([{ id: 7, name: 'Ana', comments: 3 }], 'x')[0]).toEqual(
      { id: 7, name: 'Ana', comments: 3, label: 'Ana' });
  });
});
