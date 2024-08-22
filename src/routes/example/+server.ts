import { get } from 'svelte/store'
import {
    primaryData, secondaryData, tertiaryData,
    primaryMarkers, secondaryMarkers, tertiaryMarkers,
    primaryTitle, secondaryTitle, tertiaryTitle,
    loadingBar,
} from '../../stores'

import type { LineData, UTCTimestamp, Time, SeriesMarker } from 'lightweight-charts';

import type { RequestHandler } from '@sveltejs/kit';

const examplePrimaryData: LineData[]  = [
    { time: 1724347499 as UTCTimestamp, value: 123.701 },
    { time: 1724347559 as UTCTimestamp, value: 122.983 },
    { time: 1724347619 as UTCTimestamp, value: 124.517 },
    { time: 1724347679 as UTCTimestamp, value: 125.103 },
    { time: 1724347739 as UTCTimestamp, value: 122.761 },
    { time: 1724347799 as UTCTimestamp, value: 123.682 },
    { time: 1724347859 as UTCTimestamp, value: 120.213 },
    { time: 1724347919 as UTCTimestamp, value: 123.975 },
    { time: 1724347979 as UTCTimestamp, value: 125.441 },
    { time: 1724348039 as UTCTimestamp, value: 124.095 }
]

const exampleSecondaryData: LineData[] = [
    { time: 1 as UTCTimestamp, value: 1 },
    { time: 2 as UTCTimestamp, value: 2 },
    { time: 3 as UTCTimestamp, value: 4 },
    { time: 4 as UTCTimestamp, value: 8 },
    { time: 5 as UTCTimestamp, value: 16 },
    { time: 6 as UTCTimestamp, value: 32 },
    { time: 7 as UTCTimestamp, value: 20 },
    { time: 8 as UTCTimestamp, value: 10 },
    { time: 9 as UTCTimestamp, value: 7 },
    { time: 10 as UTCTimestamp, value: 7 },
    { time: 11 as UTCTimestamp, value: 20 },
    { time: 12 as UTCTimestamp, value: 35 },
    { time: 13 as UTCTimestamp, value: 47 },
    { time: 14 as UTCTimestamp, value: 64 },
]

const exampleTertiaryData: LineData[] = [
    { time: 1724347859 as UTCTimestamp, value: 120.213 },
    { time: 1724347919 as UTCTimestamp, value: 110.975 },
    { time: 1724347979 as UTCTimestamp, value: 155.441 },
    { time: 1724348039 as UTCTimestamp, value: 200.095 },
    { time: 1724348041 as UTCTimestamp, value: 220.095 },
    { time: 1724348042 as UTCTimestamp, value: 195.095 },
    { time: 1724348043 as UTCTimestamp, value: 195.095 },
    { time: 1724348044 as UTCTimestamp, value: 175.095 },
    { time: 1724348045 as UTCTimestamp, value: 150.095 },
    { time: 1724348046 as UTCTimestamp, value: 112.095 },
]

const examplePrimaryMarkers: SeriesMarker<Time>[] = [
    { time: 1724347859 as UTCTimestamp, position: 'aboveBar', color: 'green', shape: 'arrowDown', text: 'Bought', size: 2 },
    { time: 1724348039 as UTCTimestamp, position: 'belowBar', color: 'red', shape: 'arrowUp', text: 'Sold', size: 2 },
]

const exampleSecondaryMarkers: SeriesMarker<Time>[] = [
    { time: 6 as UTCTimestamp, position: 'aboveBar', color: 'orange', shape: 'circle', text: 'To Be Examined', size: 2 },
]

export const PUT: RequestHandler = async () => {
    
    primaryData.set(examplePrimaryData)
    secondaryData.set(exampleSecondaryData)
    tertiaryData.set(exampleTertiaryData)
    
    primaryMarkers.set(examplePrimaryMarkers)
    secondaryMarkers.set(exampleSecondaryMarkers)
    tertiaryMarkers.set([])
    
    primaryTitle.set('$POOPCOIN')
    secondaryTitle.set('Precision')
    tertiaryTitle.set('Total Value Locked')

    loadingBar.set(87)
    
    return new Response(null, {status: 200})

}
