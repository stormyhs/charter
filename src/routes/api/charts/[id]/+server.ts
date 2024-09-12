import { get } from 'svelte/store'
import { charts, type ChartData } from '../../../../stores'
import { broadcast } from "../../../../lib/wsServer";

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
    const incomingData = await request.json()
    let currentData = get(charts)

    let id = currentData.length
    if(params.id != undefined) {
        id = parseInt(params.id)
    }

    let newChart: ChartData = {
        id: id || currentData.length,
        title: incomingData.title || undefined,
        data: [],
        colors: [],
        markers: [],
    }
    let chart = currentData.find(c => c.id === newChart.id)

    if(!chart) {
        currentData.push(newChart)
        broadcast({
            action: "postChart",
            chart: newChart
        })

        charts.set(currentData)
        return new Response(null, {status: 200})
    }

    if(newChart.title){
        chart.title = newChart.title
    }

    // Update server-side store
    let storedChart = currentData.find(c => c.id === newChart.id)
    if(storedChart){
        currentData = currentData.map(c => c.id === newChart.id ? chart : c)
        charts.set(currentData)
    } else {
        charts.set([...currentData, chart])
    }

    broadcast({
        action: "postChart",
        chart: chart
    })

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async ({ request, params }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    let id = currentData.length
    if(params.id != undefined) {
        id = parseInt(params.id)
    }

    let chart = currentData.find(c => c.id === id)
    if(!chart){
        return new Response(null, {status: 404})
    }

    let index = currentData.findIndex(c => c.id === chart.id)
    currentData.splice(index, 1)

    broadcast({
        action: "deleteChart",
        chart: {
            id: id
        }
    })

    return new Response(null, {status: 200})
}
