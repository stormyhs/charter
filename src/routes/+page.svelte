
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
        title: string;
        color: string;
    }

    let charts: ChartData[] = [];
    let themedChartIds: number[] = [];

    let loadingBar: number = 0;

    let pollingRate: number = 300;
    if(browser) {
        let storedPollingRate = localStorage.getItem('pollingRate');
        if(storedPollingRate) {
            pollingRate = parseInt(storedPollingRate);
        }
    }

    async function getData() {
        let newCharts = await fetch('/chart').then(res => res.json());
        for(let newChart of newCharts) {
            let chart = charts.find(c => c.id === newChart.id);
            if(chart) {
                chart.series?.setData(newChart.data);
                chart.markers = newChart.markers;
                chart.title = newChart.title;
                chart.color = newChart.color;
            } else {
                charts.push(newChart);
            }
        }

        for(let chart of charts) {
            if(!newCharts.find((c: Chart) => c.id === chart.id)) {
                charts = charts.filter(c => c.id !== chart.id);
            }
            if(!themedChartIds.includes(chart.id)) {
                if(chart.api && chart.series) {
                    chart.api.applyOptions(chartOptions);
                    chart.series.applyOptions(lineSeriesOptions);
                    themedChartIds.push(chart.id);
                }
            }
            chart.series?.applyOptions({ color: chart.color })
        }

        charts = charts;

        // Loading bar
        let newLoadingBar = await fetch('/loadingbar').then(res => res.json());
        loadingBar = newLoadingBar;
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

    let loop = setInterval(() => {
        if (browser) {
            getData();
        }
    }, pollingRate);

    onDestroy(() => {
        clearInterval(loop);
    });

    function setPollingRate() {
        let newRate = parseInt((document.getElementById('polling-rate') as HTMLInputElement).value);

        clearInterval(loop);
        loop = setInterval(() => {
            if (browser) {
                getData();
            }
        }, newRate);

        pollingRate = newRate;

        localStorage.setItem('pollingRate', newRate.toString());
    }

    function clickTitle() {
        if (browser) {
            window.open('https://github.com/stormyhs', '_blank');
        }
    }

    function clearData() {
        fetch('/reset', { method: 'delete' });
    }
</script>

<div style="display: flex; justify-content: center;">
    <div on:click={clickTitle} style="display: flex; flex-direction: column; width: fit-content; cursor: pointer;">
        <h1 style="margin: 0; padding: 0">Charter v0.1</h1>
        <p style="margin: 0; padding: 0; text-align: center;">A charting web app</p>
    </div>
</div>

<div style="height: 25px;"></div>

<div style="display: flex; justify-content: center; margin-bottom: 25px;">
    <Container style="display: flex; align-items: center; gap: 15px; width: inherit; width: 70%">
        <span>API docs <a href="/docs">here</a>.</span>
        <span>Polling rate (ms):
            <input id="polling-rate" type="number" style="width: 75px;" value={pollingRate}/>
            <button
                on:click={() => setPollingRate()}
                style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer;"
            >
                Set
            </button>
        </span>

        <button
            on:click={clearData}
            style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer;"
        >
            Clear All Data
        </button>
    </Container>
</div>

<Grid>
    {#each charts as chart}
        <div style="display: flex; justify-content: center;">
            <Container title={chart.title} >
                <Chart container={{class: 'chart-container'}} width={800} height={370} ref={(ref) => chart.api = ref}>
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
                <p style="text-align: center;">No charts available.</p>
            </Container>
        </div>
    {/if}
</Grid>

<LoadingBar progress={loadingBar} />

<div style="height: 35px;"></div>
