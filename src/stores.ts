import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store'

import type { ChartOptions, SeriesMarker, Time, LineData, ISeriesApi } from 'lightweight-charts';

export interface Chart{
	id: number;
	title?: string;
	color?: string;
	lines: Line[];
}

export interface Line{
	color?: string;
	points: Point[];
	markers: SeriesMarker<Time>[];
}

export interface Point {
	time: number;
	value: number;
}

export const charts: Writable<Chart[]> = writable([]);

export const loadingBar = writable(0);
