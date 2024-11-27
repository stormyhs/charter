import { broadcast } from '$lib/wsServer';
import { charts, type Chart, type Line } from '../../../../stores';
import type { RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';

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

    const providedChartId = params.chartId;
    if(!providedChartId) {
        let payload = JSON.stringify({
            error: 'no chartId provided'
        })

        return new Response(payload, {status: 400})
    }

    let chartId: number;
    try {
        chartId = parseInt(providedChartId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid chartId provided: chartId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const providedLineId = params.lineId;
    if(!providedLineId) {
        let payload = JSON.stringify({
            error: 'no lineId provided'
        })

        return new Response(payload, {status: 400})
    }

    let lineId: number;
    try {
        lineId = parseInt(providedLineId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid lineId provided: lineId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const allCharts = get(charts);
    const chart: Chart | undefined = allCharts.find(chart => chart.id === chartId);

    if(!chart) {
        let newChart: Chart = {
            id: chartId,
            lines: []
        }

        charts.update(charts => [...charts, newChart]);
    }

    const existingChart = get(charts).find(chart => chart.id === chartId);
    if(!existingChart) {
        let payload = JSON.stringify({
            error: 'unable to get / create chart - this error should not happen, please call stormy an idot'
        })

        return new Response(payload, {status: 500})
    }

    if(req.points != undefined) {
        const existingLine = existingChart.lines[lineId];
        if(!existingLine) {
            for(let i = 0; i <= lineId; i++) {
                if(!existingChart.lines[i]) {
                    existingChart.lines[i] = {
                        points: [],
                        markers: []
                    }
                }
            }
        }

        existingChart.lines[lineId].points = [
            ...existingChart.lines[lineId].points,
            ...req.points
        ];

        existingChart.lines[lineId].points = Array.from(
            existingChart.lines[lineId].points.reduce((map, item) => map.set(item.time, item), new Map()).values()
        );

    }

    if(req.markers != undefined) {
        const existingLine = existingChart.lines[lineId];
        if(!existingLine) {
            for(let i = 0; i <= lineId; i++) {
                if(!existingChart.lines[i]) {
                    existingChart.lines[i] = {
                        points: [],
                        markers: []
                    }
                }
            }
        }

        existingChart.lines[lineId].markers = [
            ...existingChart.lines[lineId].markers,
            ...req.markers
        ];

        existingChart.lines[lineId].markers = Array.from(
            existingChart.lines[lineId].markers.reduce((map, item) => map.set(item.time, item), new Map()).values()
        );
    }

    existingChart.lines[lineId].color = req.color || existingChart.lines[lineId].color;

    broadcast({
        type: 'postLines',
        payload: existingChart
    })

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request, params }) => {
    let req: any;
    try {
        req = await request.json();
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid body provided: body must be a JSON object'
        })

        return new Response(payload, {status: 400})
    }

    const providedChartId = params.chartId;
    if(!providedChartId) {
        let payload = JSON.stringify({
            error: 'no chartId provided'
        })

        return new Response(payload, {status: 400})
    }

    let chartId: number;
    try {
        chartId = parseInt(providedChartId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid chartId provided: chartId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const providedLineId = params.lineId;
    if(!providedLineId) {
        let payload = JSON.stringify({
            error: 'no lineId provided'
        })

        return new Response(payload, {status: 400})
    }

    let lineId: number;
    try {
        lineId = parseInt(providedLineId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid lineId provided: lineId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const allCharts = get(charts);
    const chart: Chart | undefined = allCharts.find(chart => chart.id === chartId);

    if(!chart) {
        let newChart: Chart = {
            id: chartId,
            lines: []
        }

        charts.update(charts => [...charts, newChart]);
    }

    const existingChart = get(charts).find(chart => chart.id === chartId);
    if(!existingChart) {
        let payload = JSON.stringify({
            error: 'unable to get / create chart - this error should not happen, please call stormy an idot'
        })

        return new Response(payload, {status: 500})
    }

    const existingLine = existingChart.lines[lineId];
    if(!existingLine) {
        for(let i = 0; i <= lineId; i++) {
            if(!existingChart.lines[i]) {
                existingChart.lines[i] = {
                    points: [],
                    markers: []
                }
            }
        }
    }

    if(req.points != undefined) {
        existingChart.lines[lineId].points = req.points;
    }
    if(req.markers != undefined) {
        existingChart.lines[lineId].markers = req.markers;
    }
    if(req.color != undefined) {
        existingChart.lines[lineId].color = req.color;
    }

    broadcast({
        type: 'postLines',
        payload: existingChart
    })

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async ({ request, params}) => {
    const providedChartId = params.chartId;
    if(!providedChartId) {
        let payload = JSON.stringify({
            error: 'no chartId provided'
        })

        return new Response(payload, {status: 400})
    }

    let chartId: number;
    try {
        chartId = parseInt(providedChartId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid chartId provided: chartId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const providedLineId = params.lineId;
    if(!providedLineId) {
        let payload = JSON.stringify({
            error: 'no lineId provided'
        })

        return new Response(payload, {status: 400})
    }

    let lineId: number;
    try {
        lineId = parseInt(providedLineId);
    } catch(e) {
        let payload = JSON.stringify({
            error: 'invalid lineId provided: lineId must be a number'
        })

        return new Response(payload, {status: 400})
    }

    const allCharts = get(charts);
    const chart: Chart | undefined = allCharts.find(chart => chart.id === chartId);

    if(!chart) {
        let payload = JSON.stringify({
            error: "no chart with such id"
        })
        return new Response(payload, {status: 404})
    }

    if(!chart.lines[lineId]) {
        let payload = JSON.stringify({
            error: "no line with such id"
        })
        return new Response(payload, {status: 404})
    }

    chart.lines[lineId].points = [];
    chart.lines[lineId].markers = [];

    broadcast({
        type: 'deleteLine',
        payload: {
            chartId: chartId,
            lineId: lineId
        }
    })

    return new Response(null, {status: 200})
}
