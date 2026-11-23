import { GraphResponse } from '../models/graph_response.model';

export interface NetworkFigure {
  data: any[];
  layout: any;
  /** Users drawn, and users left out because they have no connection. */
  nodeCount: number;
  isolatedCount: number;
}

/** Approximate plot pixels per layout unit: the layout fills the unit disc, often only ~375 px across. */
const PIXELS_PER_UNIT = 180;

/**
 * Marker diameter in pixels. The back end keeps drawn nodes at least
 * `min_node_distance` apart (0.06, about 11 px, unless the network is too big
 * for that); markers take three quarters of it, between 3 and 8 px, so they do
 * not overlap.
 */
export function markerSize(network: GraphResponse): number {
  const spacing = network.parameters?.min_node_distance;
  if (!spacing) {
    return 8;
  }
  return Math.max(3, Math.min(8, Math.floor(spacing * PIXELS_PER_UNIT * 0.75)));
}

function rgba(color: number[], alpha: number): string {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

/**
 * Plotly traces for a network: one line trace per community for the edges
 * inside it (in the community colour), one grey trace for the edges between
 * communities, and one marker trace for the users. Grouping keeps the number
 * of traces small; one trace per edge does not scale.
 *
 * Users without any connection are left out unless showIsolated is set: in a
 * network picture they only add noise, and the legend already counts them.
 * Tooltips show the number of connections, never usernames.
 */
export function buildNetworkFigure(network: GraphResponse, title = '', showIsolated = false): NetworkFigure {
  const degree = (id: string) => Object.keys(network.users[id] || {}).length;

  const withinCommunity = new Map<string, { color: number[], x: (number | null)[], y: (number | null)[] }>();
  const between = { x: [] as (number | null)[], y: [] as (number | null)[] };

  for (const a of Object.keys(network.users)) {
    for (const b of Object.keys(network.users[a])) {
      if (!(a < b)) {
        continue;  // the adjacency lists every edge twice
      }
      const pa = network.positions[a];
      const pb = network.positions[b];
      if (!pa || !pb) {
        continue;
      }
      const ca = network.colors[a];
      const cb = network.colors[b];
      let target = between;
      if (ca && cb && ca.join() === cb.join()) {
        const key = ca.join();
        if (!withinCommunity.has(key)) {
          withinCommunity.set(key, { color: ca, x: [], y: [] });
        }
        target = withinCommunity.get(key)!;
      }
      target.x.push(pa[0], pb[0], null);
      target.y.push(pa[1], pb[1], null);
    }
  }

  const data: any[] = [];
  if (between.x.length) {
    data.push({
      type: 'scatter', mode: 'lines', x: between.x, y: between.y,
      line: { color: 'rgba(150,150,150,0.35)', width: 0.8 }, hoverinfo: 'skip',
    });
  }
  for (const edges of withinCommunity.values()) {
    data.push({
      type: 'scatter', mode: 'lines', x: edges.x, y: edges.y,
      line: { color: rgba(edges.color, 0.55), width: 1 }, hoverinfo: 'skip',
    });
  }

  const nodes = { x: [] as number[], y: [] as number[], color: [] as string[], text: [] as string[] };
  let isolatedCount = 0;
  for (const id of Object.keys(network.positions)) {
    const connections = degree(id);
    if (connections === 0 && !showIsolated) {
      isolatedCount += 1;
      continue;
    }
    const position = network.positions[id];
    nodes.x.push(position[0]);
    nodes.y.push(position[1]);
    nodes.color.push(network.colors[id] ? rgba(network.colors[id], 1) : 'rgb(80,80,80)');
    nodes.text.push(connections === 1 ? '1 connection' : `${connections} connections`);
  }
  data.push({
    type: 'scatter', mode: 'markers', x: nodes.x, y: nodes.y,
    marker: { color: nodes.color, size: markerSize(network), line: { color: 'white', width: 0.5 } },
    text: nodes.text, hoverinfo: 'text',
  });

  const hiddenAxis = { visible: false, showgrid: false, zeroline: false };
  return {
    data,
    layout: {
      title: title ? { text: title } : undefined,
      showlegend: false,
      hovermode: 'closest',
      autosize: true,
      margin: { l: 10, r: 10, b: 10, t: title ? 50 : 10 },
      xaxis: hiddenAxis,
      yaxis: { ...hiddenAxis, scaleanchor: 'x' },  // keep the layout's proportions
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    },
    nodeCount: nodes.x.length,
    isolatedCount,
  };
}
