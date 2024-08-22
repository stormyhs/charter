
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

    import Container from '../components/Container.svelte';
    import { chartOptions, lineSeriesOptions } from '../global';
    import LoadingBar from '../components/LoadingBar.svelte';
    
    let primaryChartApi: IChartApi | null = null;
    let secondaryChartApi: IChartApi | null = null;
    let tertiaryChartApi: IChartApi | null = null;

    let primaryLineSeries: ISeriesApi<'Line'> | null = null;
    let secondaryLineSeries: ISeriesApi<'Line'> | null = null;
    let tertiaryLineSeries: ISeriesApi<'Line'> | null = null;

    let primaryMarkers: SeriesMarker<Time>[] = [];
    let secondaryMarkers: SeriesMarker<Time>[] = [];
    let tertiaryMarkers: SeriesMarker<Time>[] = [];

    let primaryTitle: string = "Primary Chart";
    let secondaryTitle: string = "Secondary Chart";
    let tertiaryTitle: string = "Tertiary Chart";

    let loadingBar: number = 0;

    $: {
        if (primaryChartApi && secondaryChartApi && tertiaryChartApi) {
            primaryChartApi.applyOptions(chartOptions);
            secondaryChartApi.applyOptions(chartOptions);
            tertiaryChartApi.applyOptions(chartOptions);
        }

        if (primaryLineSeries && secondaryLineSeries && tertiaryLineSeries) {
            primaryLineSeries.applyOptions(lineSeriesOptions);
            secondaryLineSeries.applyOptions(lineSeriesOptions);
            tertiaryLineSeries.applyOptions(lineSeriesOptions);
        }
    }

    async function getData() {
        // Charts
        let res = await fetch('/chart/primary');
        let newData = await res.json();
        setChart('primary', newData);

        res = await fetch('/chart/secondary');
        newData = await res.json();
        setChart('secondary', newData);

        res = await fetch('/chart/tertiary');
        newData = await res.json();
        setChart('tertiary', newData);

        // Markers
        primaryMarkers = await fetch('/marker/primary').then(res => res.json());
        setMarker('primary', primaryMarkers);
        secondaryMarkers = await fetch('/marker/secondary').then(res => res.json());
        setMarker('secondary', secondaryMarkers);
        tertiaryMarkers = await fetch('/marker/tertiary').then(res => res.json());
        setMarker('tertiary', tertiaryMarkers);

        // Titles
        primaryTitle = await fetch('/title/primary').then(res => res.text());
        secondaryTitle = await fetch('/title/secondary').then(res => res.text());
        tertiaryTitle = await fetch('/title/tertiary').then(res => res.text());

        // Loading bar
        let newLoadingBar = await fetch('/loadingbar').then(res => res.json());
        loadingBar = newLoadingBar;
    }

    function setChart(chart: string, data: LineData[]) {
        if(chart === 'primary' && primaryLineSeries) {
            primaryLineSeries.setData(data);
        } else if(chart === 'secondary' && secondaryLineSeries) {
            secondaryLineSeries.setData(data);
        } else if(chart === 'tertiary' && tertiaryLineSeries) {
            tertiaryLineSeries.setData(data);
        }
    }

    function setMarker(chart: string, data: SeriesMarker<Time>[]) {
        if(chart === 'primary' && primaryLineSeries) {
            primaryLineSeries.setMarkers(data);
        } else if(chart === 'secondary' && secondaryLineSeries) {
            secondaryLineSeries.setMarkers(data);
        } else if(chart === 'tertiary' && tertiaryLineSeries) {
            tertiaryLineSeries.setMarkers(data);
        }
    }

    let loop = setInterval(() => {
        if (browser) {
            getData();
        }
    }, 750);

    // Cleanup the loop when the component is destroyed
    onDestroy(() => {
        clearInterval(loop);
    });

    function clickTitle() {
        if (browser) {
            window.open('https://github.com/stormyhs', '_blank');
        }
    }

    function exampleData() {
        fetch('/example', { method: 'PUT' });
    }

    function clearData() {
        fetch('/chart/primary', { method: 'DELETE' });
        fetch('/chart/secondary', { method: 'DELETE' });
        fetch('/chart/tertiary', { method: 'DELETE' });

        fetch('/marker/primary', { method: 'DELETE' });
        fetch('/marker/secondary', { method: 'DELETE' });
        fetch('/marker/tertiary', { method: 'DELETE' });

        fetch('/title/primary', { method: 'DELETE' });
        fetch('/title/secondary', { method: 'DELETE' });
        fetch('/title/tertiary', { method: 'DELETE' });

        fetch('/loadingbar', { method: 'DELETE' });
    }
</script>

<div on:click={clickTitle} style="display: flex; justify-content: center; cursor: pointer; margin-top: 25px">
    <div style="display: flex; flex-direction: column; text-align: center">
        <h1 style="margin: 0; padding: 0">Charter v0.1</h1>
        <p style="margin: 0; padding: 0;">A charting web app</p>
    </div>
</div>

<div style="height: 25px;"></div>

<div style="display: flex; justify-content: center; align-items: center;">
    <!-- Primary Chart -->
    <div style="margin-left: 25px;">
        <Container title={primaryTitle}>
            <Chart container={{class: 'chart-container'}} width={1200} height={800} ref={(ref) => primaryChartApi = ref}>
                <LineSeries
                data={[]}
                markers={[]}
                ref={(ref) => primaryLineSeries = ref}
            />
            </Chart>

            <div style="height: 25px;"></div>
        </Container>
    </div>

    <!-- Secondary and Tertiary Charts on the side -->
    <div style="display: flex; flex-direction: column; gap: 25px">
        <div style="margin-left: 25px;">
            <Container title={secondaryTitle}>
                <Chart container={{class: 'chart-container'}} width={800} height={370} ref={(ref) => secondaryChartApi = ref}>
                    <LineSeries
                    data={[]}
                    markers={[]}
                    ref={(ref) => secondaryLineSeries = ref}
                />
                </Chart>
            </Container>
        </div>

        <div style="margin-left: 25px;">
            <Container title={tertiaryTitle}>
                <Chart container={{class: 'chart-container'}} width={800} height={370} ref={(ref) => tertiaryChartApi = ref}>
                    <LineSeries
                    data={[]}
                    markers={[]}
                    ref={(ref) => tertiaryLineSeries = ref}
                />
                </Chart>
            </Container>
        </div>
    </div>

    <LoadingBar progress={loadingBar} />
</div>

<div style="height: 35px;"></div>

<div class="center" style="gap: 25px">
    <Container>
        <p>Looking for the API documentation? Click <a href="/docs">here</a>.</p>
    </Container>
</div>

<div style="height: 35px;"></div>

<div class="center" style="gap: 35px">
    <button
        on:click={exampleData}
        style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer;"
        >
        Set Example Data
    </button>
    <button
        on:click={clearData}
        style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer;"
        >
        Clear All Data
    </button>
</div>
