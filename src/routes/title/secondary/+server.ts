import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { secondaryTitle } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export function GET() {
    const currentData = get(secondaryTitle)
    return new Response(currentData, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    let newTitle = await request.text()
    newTitle = newTitle.trim()
    secondaryTitle.set(newTitle)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    secondaryTitle.set('No Title')
    return new Response(null, {status: 200})
}
