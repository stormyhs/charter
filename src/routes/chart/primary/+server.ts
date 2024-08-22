import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { primaryData } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(primaryData)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const POST: RequestHandler = async ({ request }) => {
    const newPoint = await request.json()
    const currentData = get(primaryData)

    const pointExists = currentData.some(point => point.time === newPoint.time)
    if (pointExists) {
        primaryData.update(d => d.map(point => point.time === newPoint.time ? newPoint : point))
    } else {
        primaryData.update(d => [...d, newPoint])
    }

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    const newData = await request.json()

    primaryData.set(newData)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    primaryData.set([])
    return new Response(null, {status: 200})
}
