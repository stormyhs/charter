
import { broadcast } from '$lib/wsServer';
import { charts, type Chart } from '../../../stores';
import type { RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const GET: RequestHandler = async ({ request, params }) => {
    let payload: any = get(charts)
    try {
        payload = JSON.stringify(payload)
    } catch(e) {
        return new Response(JSON.stringify({
            error: 'failed to stringify charts - this probably means bad JSON was provided at some point'
        }), {status: 500})
    }

    return new Response(payload, {status: 200})
}

export const DELETE: RequestHandler = async ({ request, params }) => {
    charts.update(charts => [])

    broadcast({
        type: 'deleteAllCharts',
        payload: undefined
    })

    return new Response(null, {status: 200})
}
