import { json } from '@sveltejs/kit';
import { get } from 'svelte/store'
import { charts } from '../../stores'

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const currentData = get(charts)

    return new Response(JSON.stringify(currentData), {status: 200})
}

export const POST: RequestHandler = async ({ request }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    let chart = currentData.find(c => c.id === incomingData.id)
    if(chart) {
        if(incomingData.data != null){
            if(!chart.data){
                chart.data = []
            }
            for(let data of incomingData.data){
                let existingData = chart.data.find(d => d.time === data.time)
                if(existingData){
                    chart.data = chart.data.map(d => d.time === data.time ? data : d)
                } else {
                    chart.data.push(data)
                }
            }
        }

        if(incomingData.markers != null){
            if(!chart.markers){
                chart.markers = []
            }
            chart.markers = chart.markers.concat(incomingData.markers)
        }

        if(incomingData.title){
            chart.title = incomingData.title
        }
        if(incomingData.color){
            chart.color = incomingData.color
        }
    } else {
        if(!incomingData.title){
            incomingData.title = `Chart ${incomingData.id}`
        }
        currentData.push(incomingData)
    }

    return new Response(null, {status: 200})
}

export const PUT: RequestHandler = async ({ request }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    let chart = currentData.find(c => c.id === incomingData.id)
    if(chart) {
        chart.data = incomingData.data
        chart.markers = incomingData.markers
        chart.title = incomingData.title
    } else {
        currentData.push(incomingData)
    }

    return new Response(null, {status: 200})
}

export const DELETE: RequestHandler = async ({ request }) => {
    const incomingData = await request.json()
    const currentData = get(charts)

    for(const chart of incomingData) {
        let currentChart = currentData.find(c => c.id === chart.id)
        if(currentChart) {
            currentChart.data = []
            currentChart.markers = []
            currentChart.title = `Chart ${chart.id}`
        }
    }

    return new Response(null, {status: 200})
}
