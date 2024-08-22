import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { tertiaryTitle } from '../../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export function GET() {
    const currentData = get(tertiaryTitle)
    return new Response(currentData, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    let newTitle = await request.text()
    newTitle = newTitle.trim()
    tertiaryTitle.set(newTitle)

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    tertiaryTitle.set('No Title')
    return new Response(null, {status: 200})
}
