import { get } from 'svelte/store'
import { tertiaryMarkers } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const currentData = get(tertiaryMarkers)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const POST: RequestHandler = async ({ request }) => {
    const newMarker = await request.json()
    const currentData = get(tertiaryMarkers)
    
    const markerExists = currentData.some(marker => marker.time === newMarker.time)
    if (markerExists) {
        tertiaryMarkers.update(d => d.map(marker => marker.time === newMarker.time ? newMarker : marker))
    } else {
        tertiaryMarkers.update(d => [...d, newMarker])
    }

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    const newMarkers = await request.json()

    tertiaryMarkers.set(newMarkers)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    tertiaryMarkers.set([])
    return new Response(null, {status: 200})
}
