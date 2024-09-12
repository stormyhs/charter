import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { charts, loadingBar } from '../../../stores'
import { broadcast } from "../../../lib/wsServer";

import type { RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ request }) => {
    charts.set([])
    loadingBar.set(0)

    broadcast({
        action: "reset"
    })

    return new Response(null, {status: 200})
}
