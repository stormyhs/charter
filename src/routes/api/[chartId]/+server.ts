import { broadcast } from '$lib/wsServer';
import { charts, type Chart, type Line } from '../../../stores';
import type { RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const GET: RequestHandler = async ({ params }) => {
    const providedId = params.chartId;

    if(!providedId) {
        let payload = JSON.stringify({
            error: 'no chartId provided'
        })

        return new Response(payload, {status: 400})
    }

    let chartId: number;
    try {
        chartId = parseInt(providedId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid chartId provided: chartId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const allCharts = get(charts);
    const chart: Chart | undefined = allCharts.find(chart => chart.id === chartId);

    if(!chart) {
        let payload = JSON.stringify({
            error: 'chart not found'
        })

        return new Response(payload, {status: 404})
    }

    return new Response(JSON.stringify(chart), {status: 200})
}

export const POST: RequestHandler = async ({ request, params }) => {
    let req: any;
    try {
        req = await request.json();
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid body provided: body must be a JSON object'
        })

        return new Response(payload, {status: 400})
    }

    const providedId = params.chartId;

    if(!providedId) {
        let payload = JSON.stringify({
            error: 'no chartId provided'
        })

        return new Response(payload, {status: 400})
    }

    let chartId: number;
    try {
        chartId = parseInt(providedId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid chartId provided: chartId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const allCharts = get(charts);
    const chart: Chart | undefined = allCharts.find(chart => chart.id === chartId);

    if(!chart) {
        let newChart: Chart = {
            id: chartId,
            title: req.title != undefined ? req.title : 'Untitled Chart',
            color: req.color != undefined ? req.color : 'white',
            lines: []
        }

        charts.update(charts => [...charts, newChart])

        broadcast({
            type: 'postChart',
            payload: newChart
        })

        return new Response(null, {status: 200})
    }

    chart.title = req.title || chart.title;
    chart.color = req.color || chart.color;

    broadcast({
        type: 'postChart',
        payload: chart
    })

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async ({ request, params }) => {
    const providedId = params.chartId;

    if(!providedId) {
        let payload = JSON.stringify({
            error: 'no chartId provided'
        })

        return new Response(payload, {status: 400})
    }

    let chartId: number;
    try {
        chartId = parseInt(providedId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid chartId provided: chartId must be a number'
        })

        return new Response(payload, {status: 400})
    }
    
    charts.update(charts => charts.filter(chart => chart.id !== chartId))

    broadcast({
        type: 'deleteChart',
        payload: {
            chartId: chartId
        }
    })

    return new Response(null, {status: 200})
}

