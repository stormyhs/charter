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
    import type { LineData, IChartApi, ISeriesApi } from "lightweight-charts";

    import { chartOptions, lineSeriesOptions } from '../global';
    import Container from '../components/Container.svelte';
    import LoadingBar from '../components/LoadingBar.svelte';
    import Grid from '../components/Grid.svelte';

    interface lineApis {
        [key: number]: ISeriesApi<'Line'>;
    }

    interface ChartData {
        id: number;
        title?: string;
        data: LineData[][];

        api: IChartApi | null;
        lineApis: lineApis;
        colors?: string[];
    }

    let charts: ChartData[] = [];
    let themedChartIds: number[] = [];

    let loadingBar: number = 0;

    function appendToChart(chart: ChartData) {
        let existingChartIndex = charts.findIndex(c => c.id === chart.id);
        if(existingChartIndex === -1) {
            setChart(chart);
            return;
        }

        let existingChart = charts[existingChartIndex];
        for(let i = 0; i < chart.data.length; i++) {
            let series = chart.data[i];

            if(!existingChart.data[i]) {
                existingChart.data[i] = chart.data[i];
                try {
                    existingChart.lineApis[i].setData(existingChart.data[i]);
                } catch {}
            }
            else {
                existingChart.data[i] = existingChart.data[i].concat(series);
                try {
                    existingChart.lineApis[i].setData(existingChart.data[i]);
                } catch {}
            }
        }

        if(chart.colors != null && chart.colors.length > 0) {
            existingChart.colors = chart.colors;
            for(let i = 0; i < chart.colors.length; i++) {
                if(chart.colors[i] != null) {
                    existingChart.lineApis?.[i]?.applyOptions({ color: chart.colors[i] });
                }
            }
        }

        if(chart.title) {
            existingChart.title = chart.title;
        }

        charts = charts;
    }

    function setChart(chart: ChartData) {
        let existingChart = charts.find(c => c.id === chart.id);
        if(existingChart) {
            existingChart.data = chart.data;
            if(chart.title != null) {
                existingChart.title = chart.title;
            }
            if(chart.colors != null) {
                existingChart.colors = chart.colors;
            } else {
            }
        }
        else {
            let newChart: ChartData = {
                id: chart.id,
                title: chart.title,
                data: chart.data,
                api: chart.api,
                lineApis: {},
                colors: chart.colors
            }
            charts.push(newChart);
        }

        charts = charts;
    }

    function removeChart(id: number) {
        charts = charts.filter(c => c.id !== id);
        charts = charts;
    }

    const getData = async () => {
        let res = await fetch('/api/charts');
        let data = await res.json();

        for(let chart of data) {
            setChart(chart);
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

                appendToChart(newChart);
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

    // Initially, we get all the charts with a GET request. Any subsequent changes are handled by the WS.
    if(browser) {
        getData()
        connect()
    }

    function screenshot(id: number) {
        let chart = charts.find(c => c.id === id);
        if(!chart) { return }
        chart.api?.applyOptions({
            watermark: {
                text: chart.title,
                color: "orange",
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

    function clearData() {
        fetch('/api/reset', { method: 'delete' });
    }

    // The chart's API only works once its mounted. Because I am poop at svelte, this is the cope I shall use.
    // Mad about it? Make a PR.
    let loop = setInterval(() => {
        if (browser) {
            for(let chart of charts) {
                if(!themedChartIds.includes(chart.id)) {
                    chart.api?.applyOptions(chartOptions);
                    for(let lineApiKey of Object.keys(chart.lineApis)) {
                        let lineApi = chart.lineApis[lineApiKey as unknown as number];
                        lineApi?.applyOptions(lineSeriesOptions);
                    }
                }

                if(chart.colors && chart.colors.length > 0) {
                    for(let i = 0; i < chart.colors.length; i++) {
                        chart.lineApis[i].applyOptions({ color: chart.colors[i] });
                    }
                }
            }
        }
    }, 1000);

    onDestroy(() => {
        clearInterval(loop);
    });

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
                <Chart
                        container={{class: 'chart-container'}}
                        width={925}
                        height={400}
                        ref={(ref) => { chart.api = ref }}
                >
                    {#if chart.data}
                        {#each chart.data as series, i}
                            <LineSeries
                                data={series}
                                ref={(ref) => {
                                    if(ref) { chart.lineApis[i] = ref; }
                                }} 
                            />
                        {/each}
                    {/if}
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
