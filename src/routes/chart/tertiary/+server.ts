import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { tertiaryData } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(tertiaryData)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const POST: RequestHandler = async ({ request }) => {
    const newPoint = await request.json()
    const currentData = get(tertiaryData)

    const pointExists = currentData.some(point => point.time === newPoint.time)
    if (pointExists) {
        tertiaryData.update(d => d.map(point => point.time === newPoint.time ? newPoint : point))
    } else {
        tertiaryData.update(d => [...d, newPoint])
    }

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    const newData = await request.json()

    tertiaryData.set(newData)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    tertiaryData.set([])
    return new Response(null, {status: 200})
}
