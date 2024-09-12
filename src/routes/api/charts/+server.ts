import { get } from 'svelte/store'
import { charts, type ChartData } from '../../../stores'
import { broadcast } from "../../../lib/wsServer";

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(charts)

    return new Response(JSON.stringify(currentData), {status: 200})
}
