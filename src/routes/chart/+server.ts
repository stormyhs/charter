import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { charts, type ChartData } from '../../stores'
import { broadcast } from "../../lib/wsServer";

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(charts)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const POST: RequestHandler = async ({ request }) => {
    const incomingData = await request.json()
    let currentData = get(charts)

    let newChart: ChartData = {
        id: incomingData.id || currentData.length,
        data: incomingData.data || [],
        markers: incomingData.markers || [],
        title: incomingData.title || undefined,
        color: incomingData.color || undefined
    }
    let chart = currentData.find(c => c.id === newChart.id)

    if(!chart) {
        // No chart to update, simply add the new chart
        currentData.push(newChart)
        broadcast({
            action: "postChart",
            chart: newChart
        })

        charts.set(currentData)
        return new Response(null, {status: 200})
    }

    // Ensure no duplicate timestamps
    for(let data of newChart.data){
        let existingData = chart.data.find(d => d.time === data.time)

        if(existingData){
            chart.data = chart.data.map(d => d.time === data.time ? data : d)
        } else {
            chart.data.push(data)
        }
    }

    for(let marker of newChart.markers){
        let existingMarker = chart.markers.find(m => m.time === marker.time)
        if(existingMarker){
            chart.markers = chart.markers.map(m => m.time === marker.time ? marker : m)
        } else {
            chart.markers.push(marker)
        }
    }

    if(newChart.title){
        chart.title = newChart.title
    }
    if(newChart.color){
        chart.color = newChart.color
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

export const PUT: RequestHandler = async ({ request }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    let chart = currentData.find(c => c.id === incomingData.id)
    if(chart) {
        if(incomingData.data){
            chart.data = incomingData.data
        }
        if(incomingData.markers){
            chart.markers = incomingData.markers
        }
        if(incomingData.title){
            chart.title = incomingData.title
        }
        if(incomingData.color){
            chart.color = incomingData.color
        }
    } else {
        currentData.push(incomingData)
    }

    broadcast({
        action: "putChart",
        chart: incomingData
    })

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async ({ request }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    let chart = currentData.find(c => c.id === incomingData.id)
    if(!chart){
        return new Response(null, {status: 404})
    }

    let index = currentData.findIndex(c => c.id === chart.id)
    currentData.splice(index, 1)

    broadcast({
        action: "deleteChart",
        chart: incomingData,
    })

    return new Response(null, {status: 200})
}
