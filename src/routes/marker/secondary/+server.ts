import { get } from 'svelte/store'
import { secondaryMarkers } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const currentData = get(secondaryMarkers)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const POST: RequestHandler = async ({ request }) => {
    const newMarker = await request.json()
    const currentData = get(secondaryMarkers)
    
    const markerExists = currentData.some(marker => marker.time === newMarker.time)
    if (markerExists) {
        secondaryMarkers.update(d => d.map(marker => marker.time === newMarker.time ? newMarker : marker))
    } else {
        secondaryMarkers.update(d => [...d, newMarker])
    }

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    const newMarkers = await request.json()

    secondaryMarkers.set(newMarkers)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    secondaryMarkers.set([])
    return new Response(null, {status: 200})
}
