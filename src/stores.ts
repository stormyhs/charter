import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store'

import type { LineData, IChartApi, ISeriesApi } from 'lightweight-charts';
import type { SeriesMarker, Time } from 'lightweight-charts';

export interface ChartData {
	id: number;
	title: string;

	series?: ISeriesApi<'Line'>[];

	markers: SeriesMarker<Time>[];
	data: LineData[][];

	colors: string[];
}
export const charts: Writable<ChartData[]> = writable([]);

export const loadingBar = writable(0);
