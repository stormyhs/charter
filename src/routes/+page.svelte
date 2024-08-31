<style>
:global(.chart-container) {
    aspect-ratio: 16 / 9;
    width: 80%;
    margin: auto;
    background-color: black;
}
</style>

<script lang="ts">
    import { onDestroy } from 'svelte';
    import { browser } from "$app/environment";

    import { Chart, LineSeries } from "svelte-lightweight-charts";
    import type { LineData, IChartApi, ISeriesApi, SeriesMarker, Time } from "lightweight-charts";

    import { chartOptions, lineSeriesOptions } from '../global';
    import Container from '../components/Container.svelte';
    import LoadingBar from '../components/LoadingBar.svelte';
    import Grid from '../components/Grid.svelte';

    interface ChartData {
        id: number;
        api: IChartApi | null;
        series: ISeriesApi<'Line'> | null;
        markers: SeriesMarker<Time>[];
        title?: string;
        color?: string;
    }

    let charts: ChartData[] = [];
    let themedChartIds: number[] = [];

    let loadingBar: number = 0;

    function appendData(
        chart: {id: number, data: LineData[], markers: SeriesMarker<Time>[], title?: string, color?: string},
        mode: 'append' | 'replace' = 'append'
    ) {
        console.log('Appending data', chart);
        let existingChart = charts.find(c => c.id === chart.id);
        if(existingChart) {
            if(mode === 'replace') {
                existingChart.series?.setData(chart.data);
                existingChart.series?.setMarkers(chart.markers);
                if(chart.title) { existingChart.title = chart.title }
                if(chart.color) { existingChart.color = chart.color }
            } else {
                let newData = existingChart.series?.data().map(d => d) as LineData[];
                // Add the new data to the existing data, overwriting any duplicates
                for(let data of chart.data) {
                    let existingData = newData?.find(d => d.time === data.time);
                    if(existingData) {
                        existingData = data;
                    } else {
                        newData.push(data);
                    }
                }

                let newMarkers = existingChart.series?.markers().map(m => m) as SeriesMarker<Time>[];
                for(let marker of chart.markers) {
                    let existingMarker = newMarkers?.find(m => m.time === marker.time);
                    if(existingMarker) {
                        existingMarker = marker;
                    } else {
                        newMarkers.push(marker);
                    }
                }

                existingChart.series?.setData(newData);
                existingChart.series?.setMarkers(newMarkers);
                if(chart.title) { existingChart.title = chart.title }
                if(chart.color) { existingChart.color = chart.color }
            }
        } else {
            charts.push({
                id: chart.id,
                api: null,
                series: null,
                markers: chart.markers,
                title: chart.title || `Chart ${chart.id}`,
                color: chart.color
            });
            charts = charts;

            setTimeout(() => {
                let newChart = charts.find(c => c.id === chart.id);
                try {
                    console.log('Setting data', chart.data);
                    newChart?.series?.setData(chart.data);
                } catch (e) {
                    console.warn(e)
                }
                newChart?.series?.setMarkers(chart.markers);
            }, 0)
        }

        charts = charts;
    }

    function removeChart(id: number) {
        charts = charts.filter(c => c.id !== id);
        charts = charts;
    }

    if(browser) {
        // Initially, we get all the charts with a GET request. Any subsequent changes are handled by the WS.
        const getData = async () => {
            let res = await fetch('/chart');
            let data = await res.json();

            for(let chart of data) {
                appendData(chart, 'replace');
            }
        }

        const connect = async () => {
            const ws = new WebSocket(`ws://${window.location.hostname}:8080/chart`);
            ws.onmessage = (e) => {
                let data;
                try {
                    data = JSON.parse(e.data);
                } catch { return }
                if(data.action == "postChart" || data.action == "putChart") {
                    let newChart = data.chart;

                    if(!newChart.data) { newChart.data = [] }
                    if(!newChart.markers) { newChart.markers = [] }

                    appendData(newChart, data.action == "postChart" ? 'append' : 'replace');
                }
                else if(data.action == "deleteChart") {
                    let newChart = data.chart;
                    removeChart(newChart.id);
                }
                else if(data.action == "putLoadingBar") {
                    loadingBar = data.progress;
                }
                else if(data.action == "reset") {
                    charts = [];
                    loadingBar = 0;
                }
            }

            ws.onopen = () => {
                ws.send('Hello from the client!');
            }
        }

        getData()
        connect()
    }

    function screenshot(id: number) {
        let chart = charts.find(c => c.id === id);
        if(!chart) { return }
        chart.api?.applyOptions({
            watermark: {
                text: chart.title,
                color: chart.color,
                visible: true,
                vertAlign: "top",
                horzAlign: "left"
            }
        });
        let canvas = chart.api?.takeScreenshot();
        canvas?.toBlob((blob: any) => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        });
        chart.api?.applyOptions({watermark: {visible: false}});
    }

    function autoScale(id: number) {
        let chart = charts.find(c => c.id === id);
        if(!chart) { return }
        chart.api?.timeScale().fitContent()
    }

    // The chart's API only works once its mounted. Because I am poop at svelte, this is the cope I shall use.
    // Mad about it? Make a PR.
    let loop = setInterval(() => {
        if (browser) {
            for(let chart of charts) {
                if(!themedChartIds.includes(chart.id)) {
                    chart.api?.applyOptions(chartOptions);
                    chart.series?.applyOptions(lineSeriesOptions);
                }
                chart.series?.applyOptions({ color: chart.color })
            }
        }
    }, 1000);

    onDestroy(() => {
        clearInterval(loop);
    });

    function clearData() {
        fetch('/reset', { method: 'delete' });
    }
</script>

<div style="display: flex; justify-content: center; margin-top: 5px;">
    <div style="display: flex; flex-direction: column; width: fit-content;">
        <h1 style="margin: 0; padding: 0; text-align: center;">Charter</h1>
        <p style="margin: 0; padding: 0; text-align: center;">A charting web app</p>
        <span>Made with ❤️ by <a href="https://github.com/stormyhs" target="_blank">stormyhs</a></span>
    </div>
</div>

<div style="height: 25px;"></div>

<div style="display: flex; justify-content: center; margin-bottom: 25px;">
    <Container style="display: flex; align-items: center; gap: 15px; width: inherit; width: 70%">
        <span>API docs <a href="/docs">here</a>.</span>

        <button
            on:click={clearData}
            style="margin-left: auto; padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer;"
        >
            Delete all data
        </button>
    </Container>
</div>

<Grid>
    {#each charts as chart}
        <div style="display: flex; justify-content: center;">
            <Container title={chart.title} >
                <Chart container={{class: 'chart-container'}} width={925} height={400} ref={(ref) => chart.api = ref}>
                    <LineSeries
                        data={[]}
                        markers={[]}
                        ref={(ref) => chart.series = ref}
                    />
                </Chart>

                <button
                    on:click={() => autoScale(chart.id)}
                    style="padding: 4px; background-color: #22242c; color: white; border: none; cursor: pointer;"
                >
                    Fit Scale
                </button>
                <button
                    on:click={() => screenshot(chart.id)}
                    style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer;"
                >
                    As Image
                </button>
            </Container>
        </div>
    {/each}
    {#if charts.length === 0}
        <div style="display: flex; justify-content: center;">
            <Container title="No charts available" >
                <p style="text-align: center;">Check out the <a href="/docs">API docs</a> to get started.</p>
            </Container>
        </div>
    {/if}
</Grid>

<LoadingBar progress={loadingBar} />

<div style="height: 35px;"></div>
