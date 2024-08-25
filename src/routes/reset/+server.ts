import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { charts, loadingBar } from '../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ request }) => {
    charts.set([])
    loadingBar.set(0)

    return new Response(null, {status: 200})
}
