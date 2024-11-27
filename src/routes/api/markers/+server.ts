import { broadcast } from '$lib/wsServer';
import { charts, type Chart } from '../../../stores';
import type { RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const DELETE: RequestHandler = async ({ request, params }) => {
    // In each chart, in each line, remove all markers

    let chartsData = get(charts)

    for(let chart of chartsData) {
        for(let line of chart.lines) {
            line.markers = []
        }
    }

    charts.update(charts => chartsData)

    broadcast({
        type: 'deleteAllMarkers',
        payload: undefined
    })

    return new Response(null, {status: 200})
}
