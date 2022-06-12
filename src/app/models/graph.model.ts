export interface LineChart{
  x: number[];
  y: number[];
  type: string;
  mode: string;
  marker: {color: string, size: number};
  line: { color: string;
          width: string;
        };
}


export interface MarketChart{
  x: number[];
  y: number[];
  type: string;
  mode: string;
  marker: {color: string, size: number};
  hoverinfo: string;
  text: string[];
}
