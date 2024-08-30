import type { DeepPartial, ChartOptions, LineSeriesOptions } from 'lightweight-charts';

export const chartOptions: DeepPartial<ChartOptions> = {
	layout: {
		background: {
			color: '#171b26',
		},
		textColor: '#d1d4dc',
		fontSize: 14,
	},
	grid: {
		vertLines: {
			color: '#313a4d',
		},
		horzLines: {
			color: '#313a4d',
		},
	},
	timeScale: {
		timeVisible: true,
	}
}

export const lineSeriesOptions: DeepPartial<LineSeriesOptions> = {
	lastPriceAnimation: 2,
	priceFormat: {
		precision: 3
	}
}
