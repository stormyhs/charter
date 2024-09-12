import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { loadingBar } from '../../../stores'
import { broadcast } from "../../../lib/wsServer";

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(loadingBar)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    let newData = await request.text()
    let newProgress: number = 0;
    try {
        newProgress = parseInt(newData)
        if (newProgress < 0 || newProgress > 100) {
            return new Response("Invalid value received. Please provide a number between 0 and 100.", {status: 400})
        }
    } catch {
        return new Response("Invalid value received. Please provide a number between 0 and 100.", {status: 400})
    }

    loadingBar.set(newProgress)

    broadcast({
        action: "putLoadingBar",
        progress: newProgress
    })

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async () => {
    loadingBar.set(0)

    broadcast({
        action: "putLoadingBar",
        progress: 0
    })

    return new Response(null, {status: 200})
}
