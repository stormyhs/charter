import { get } from 'svelte/store'
import { primaryMarkers } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const currentData = get(primaryMarkers)

    return new Response(JSON.stringify(currentData), {status: 200})
}

/*
 * Example marker object:
{
    time: '1724347499',
    position: 'aboveBar',
    color: 'green',
    shape: 'arrowDown',
    text: 'Bought',
    size: 2,
},
*/

export const POST: RequestHandler = async ({ request }) => {
    const newMarker = await request.json()
    const currentData = get(primaryMarkers)
    
    primaryMarkers.update(d => [...d, newMarker])

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    const newMarkers = await request.json()

    primaryMarkers.set(newMarkers)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    primaryMarkers.set([])
    return new Response(null, {status: 200})
}
