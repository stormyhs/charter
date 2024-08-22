import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store'

import type { LineData } from 'lightweight-charts';
import type { SeriesMarker, Time } from 'lightweight-charts';

export const primaryData: Writable<LineData[]> = writable([
]);
export const secondaryData: Writable<LineData[]> = writable([
]);
export const tertiaryData: Writable<LineData[]> = writable([
]);

export const primaryMarkers: Writable<SeriesMarker<Time>[]> = writable([]);
export const secondaryMarkers: Writable<SeriesMarker<Time>[]> = writable([]);
export const tertiaryMarkers: Writable<SeriesMarker<Time>[]> = writable([]);

export const primaryTitle = writable('Primary Chart');
export const secondaryTitle = writable('Secondary Chart');
export const tertiaryTitle = writable('Tertiary Chart');

export const loadingBar = writable(0);
