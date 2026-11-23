import { GraphResponse } from '../models/graph_response.model';
import { buildNetworkFigure } from './network-figure';

describe('buildNetworkFigure', () => {
  const red: [number, number, number] = [200, 0, 0];
  const blue: [number, number, number] = [0, 0, 200];

  // 1-2-3 form a red triangle, 4-5 a blue pair, 3-4 links the two, 6 is isolated.
  const network: GraphResponse = {
    users: {
      '1': { '2': 0.9, '3': 0.8 },
      '2': { '1': 0.9, '3': 0.7 },
      '3': { '1': 0.8, '2': 0.7, '4': 0.2 },
      '4': { '3': 0.2, '5': 0.6 },
      '5': { '4': 0.6 },
      '6': {},
    },
    positions: { '1': [0, 0], '2': [1, 0], '3': [0, 1], '4': [2, 2], '5': [3, 2], '6': [5, 5] },
    usernames: { '1': 'ana', '2': 'bob', '3': 'cat', '4': 'dan', '5': 'eve', '6': 'fay' },
    colors: { '1': red, '2': red, '3': red, '4': blue, '5': blue, '6': [0, 200, 0] },
  };

  const segments = (trace: any) => trace.x.filter((x: number | null) => x === null).length;

  it('groups edges by community and draws each edge once', () => {
    const figure = buildNetworkFigure(network);
    const lines = figure.data.filter(trace => trace.mode === 'lines');
    expect(lines.length).toBe(3);  // between, red, blue

    const redEdges = lines.find(trace => trace.line.color === 'rgba(200,0,0,0.55)');
    const blueEdges = lines.find(trace => trace.line.color === 'rgba(0,0,200,0.55)');
    const between = lines.find(trace => trace.line.color.startsWith('rgba(150'));
    expect(segments(redEdges)).toBe(3);
    expect(segments(blueEdges)).toBe(1);
    expect(segments(between)).toBe(1);
    expect(between.x).toEqual([0, 2, null]);
  });

  it('draws connected users coloured by community and hides isolated ones', () => {
    const figure = buildNetworkFigure(network);
    const nodes = figure.data[figure.data.length - 1];
    expect(nodes.mode).toBe('markers');
    expect(nodes.x.length).toBe(5);
    expect(figure.nodeCount).toBe(5);
    expect(figure.isolatedCount).toBe(1);
    expect(nodes.marker.color[0]).toBe('rgba(200,0,0,1)');
  });

  it('can show isolated users', () => {
    const figure = buildNetworkFigure(network, '', true);
    expect(figure.nodeCount).toBe(6);
    expect(figure.isolatedCount).toBe(0);
  });

  it('never shows usernames', () => {
    const figure = buildNetworkFigure(network, 'support network');
    const nodes = figure.data[figure.data.length - 1];
    expect(nodes.text).toEqual(['2 connections', '2 connections', '3 connections', '2 connections', '1 connection']);
    expect(JSON.stringify(figure)).not.toContain('ana');
    expect(figure.layout.title.text).toBe('support network');
  });

  it('handles an empty network', () => {
    const figure = buildNetworkFigure({ users: {}, positions: {}, usernames: {}, colors: {} });
    expect(figure.nodeCount).toBe(0);
    expect(figure.data.length).toBe(1);
  });
});
