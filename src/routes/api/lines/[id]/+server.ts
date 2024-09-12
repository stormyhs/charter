import { get } from 'svelte/store'
import { charts, type ChartData } from '../../../../stores'
import { broadcast } from "../../../../lib/wsServer";

import type { RequestHandler } from '@sveltejs/kit';

// TODO: Send back only lines of a specified chart.
export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(charts)

    return new Response(JSON.stringify(currentData), {status: 200})
}

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
        colors: incomingData.colors || [],
        data: incomingData.data || [],
        markers: incomingData.markers || [],
    }

    let chart = currentData.find(c => c.id === newChart.id)

    if(!chart) {
        currentData.push(newChart)
        broadcast({
            action: "postChart",
            chart: newChart
        })

        currentData.push(newChart)
        return new Response(null, {status: 200})
    }

    for(let seriesIndex = 0; seriesIndex < newChart.data.length; seriesIndex++){
        for(let pointIndex = 0; pointIndex < newChart.data[seriesIndex].length; pointIndex++){
            if(!chart.data[seriesIndex]){
                chart.data[seriesIndex] = []
            }

            let newPoint = newChart.data[seriesIndex][pointIndex]
            let existingPoint = chart.data[seriesIndex].find(p => p.time=== newPoint.time)
            if(existingPoint){
                chart.data[seriesIndex] = chart.data[seriesIndex].map(p => p.time=== newPoint.time? newPoint : p)
            } else {
                chart.data[seriesIndex].push(newPoint)
            }
        }
    }

    for(let i = 0; i < newChart.colors.length; i++){
        let color = newChart.colors[i]
        if(color != null && color != "") {
            chart.colors[i] = color
        }
    }

    broadcast({
        action: "postChart",
        chart: newChart
    })
    
    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request, params }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    let id = currentData.length
    if(params.id != undefined) {
        id = parseInt(params.id)
    }

    let chart = currentData.find(c => c.id === id)

    let newChart: ChartData = {
        id: id,
        title: incomingData.title || undefined,
        colors: incomingData.colors || undefined,
        data: incomingData.data || undefined,
        markers: incomingData.markers || undefined,
    }

    if(chart) {
        if(incomingData.data){
            chart.data = incomingData.data
        }
        for(let i = 0; i < newChart.colors.length; i++){
            let color = newChart.colors[i]
            if(color != null && color != "") {
                chart.colors[i] = color
            }
        }
    } else {
        currentData.push(newChart)
    }

    broadcast({
        action: "putChart",
        chart: newChart
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
        },
    })

    return new Response(null, {status: 200})
}

