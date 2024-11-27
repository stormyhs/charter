<style>
:global(.chart-container) {
    aspect-ratio: 16 / 9;
    width: 100%;
    margin: auto;
    background-color: black;
}
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import axios from "axios";

    import Container from "../components/Container.svelte";
    import Grid from "../components/Grid.svelte";

    import type { DeepPartial, GridOptions, IChartApi, ISeriesApi, LayoutOptions, SeriesMarker, Time } from "lightweight-charts";
    import type { ChartProps } from "svelte-lightweight-charts";
    import { Chart, LineSeries } from "svelte-lightweight-charts";

    interface CopeChart {
        title: string,
        id: number,
        ref: IChartApi,
        color?: string,
    };
    type UnionChart = CopeChart & ChartProps;
    let charts: UnionChart[] = $state([]);

    interface CopeLine {
        id: number,
        chartId: number,
        points: { time: Time, value: number }[],
        markers: SeriesMarker<Time>[],
        color?: string,
        ref: ISeriesApi<"Line">,
    }
    let lines: CopeLine[] = $state([]);

    $effect(() => {
        for(let chart of charts) {
            let lines = getChartLines(chart.id);
            for(let line of lines) {
                if(!line.ref) {
                    continue;
                }
                if(line.points.length !== 0) {
                    try {
                        line.ref.setData(line.points);
                    } catch(err) {
                        console.error(err);
                    }
                }
                if(line.markers.length !== 0) {
                    try {
                        line.ref.setMarkers(line.markers);
                    } catch(err) {
                        console.error(err);
                    }
                }
                if(line.color && line.ref.options().color !== line.color) {
                    try {
                        line.ref.applyOptions({
                            color: line.color,
                        });
                    } catch(err) {
                        console.error(err);
                    }
                }
            }
        }
    });

    const layout: DeepPartial<LayoutOptions> = {
        background: {
            color: "#22242c",
        },
        textColor: "#f8f8f2",
    }

    const grid: DeepPartial<GridOptions> = {
        vertLines: {
            color: "#44475a",
        },
        horzLines: {
            color: "#44475a",
        },
    }

    function getChart(id: number): UnionChart | undefined {
        for(let chart of charts) {
            if(chart.id === id) {
                return chart;
            }
        }
    }

    function getChartLines(id: number): CopeLine[] {
        let chartLines = [];
        for(let line of lines) {
            if(line.chartId === id) {
                chartLines.push(line);
            }
            if(line.chartId == null) {
                console.error("line has no chartId");
            }
        }

        return chartLines;
    }

    async function getCharts() {
        await axios.get("/api/charts")
            .then((res) => {
                let i = 0;
                for(let chart of res.data) {
                    chart.index = i;

                    for(let line of chart.lines) {
                        line.chartId = chart.index;
                    }

                    setChart(chart);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async function clearCharts() {
        await axios.delete("/api/charts")
            .then(() => {
                charts = [];
                lines = [];
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async function setChart(chart: any) {
        const index = charts.findIndex((c: any) => c.id === chart.id);

        if (index === -1) {
            charts.push(chart);
        } else {
            charts[index].title = chart.title;
            charts[index].color = chart.color;
        }
        charts = [...charts];

        let lineId = 0;
        for(let line of chart.lines) {
            line.chartId = chart.id;
            line.id = lineId;

            const lineIndex = lines.findIndex((l: any) => l.chartId === line.chartId && l.id === line.id);

            if (lineIndex === -1) {
                lines.push(line);
            } else {
                lines[lineIndex].points = line.points;
                lines[lineIndex].markers = line.markers;
                lines[lineIndex].color = line.color;
            }

            lineId++;
        }
        lines = [...lines];
    }

    // This chart will have partial data, that needs to be appended.
    async function postChart(chart: any) {
        const index = charts.findIndex((c: any) => c.id === chart.id);

        if (index === -1) {
            charts.push(chart);
        } else {
            charts[index].title = chart.title;
            charts[index].color = chart.color;
        }
        charts = [...charts];

        let lineId = 0;
        for(let line of chart.lines) {
            line.chartId = chart.id;
            line.id = lineId;

            const lineIndex = lines.findIndex((l: any) => l.chartId === line.chartId && l.id === line.id);
            if (lineIndex === -1) {
                lines.push(line);
            } else {
                lines[lineIndex].points = [...lines[lineIndex].points, ...line.points]
                lines[lineIndex].markers = [...lines[lineIndex].markers, ...line.markers]
                lines[lineIndex].color = line.color;
            }

            lineId++;
        }
        lines = [...lines];
    }

    async function deleteChart(chartId: number) {
        charts = charts.filter((chart) => chart.id !== chartId);
        lines = lines.filter((line) => line.chartId !== chartId);

        charts = [...charts];
        lines = [...lines];
    }

    async function deleteLine(chartId: number, lineId: number) {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if(line.chartId == chartId && line.id == lineId) {
                lines[i].points = [];
                lines[i].markers = [];
            }
        }
        lines = [...lines];
    }

    async function deleteAllMarkers() {
        for (let i = 0; i < lines.length; i++) {
            lines[i].markers = [];
        }
        lines = [...lines];
    }

    function fitToScale(index: number) {
        const chart = getChart(index);
        if(!chart) { return }
        chart.ref.timeScale().fitContent();
    }

    function fitAllToScale() {
        for(let chart of charts) {
            try {
                chart.ref.timeScale().fitContent();
            } catch(err) {
                console.error(err);
            }
        }
    }

    async function screenshot(index: number) {
        const chart = getChart(index);
        if(!chart) { return }

        chart.ref.applyOptions({
            watermark: {
                text: chart.title,
                color: chart.color || "#f8f8f2",
                visible: true,
                vertAlign: "top",
                horzAlign: "left"
            }
        });

        let canvas = chart.ref.takeScreenshot();
        canvas?.toBlob((blob: any) => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        });

        chart.ref.applyOptions({
            watermark: {
                visible: false
            }
        });
    }

    async function copyScreenshot(index: number) {
        const chart = getChart(index);
        if(!chart) { return }

        chart.ref.applyOptions({
            watermark: {
                text: chart.title,
                color: chart.color || "#f8f8f2",
                visible: true,
                vertAlign: "top",
                horzAlign: "left"
            }
        });

        let canvas = chart.ref.takeScreenshot();

        let blob = await fetch(canvas.toDataURL()).then((res) => res.blob());
        navigator.clipboard.write([
            new ClipboardItem({
                "image/png": blob
            })
        ]);

        chart.ref.applyOptions({
            watermark: {
                visible: false
            }
        });
    }

    async function startWs() {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onmessage = (event) => {
            let data: any;
            try {
                data = JSON.parse(event.data);
            } catch(err) {
                console.error("Unable to parse JSON data from WebSocket");
                console.error(err);
                return;
            }

            if(data.type == "postChart") {
                setChart(data.payload);
            }
            if(data.type == "postLines") {
                // setChart(data.payload);
                postChart(data.payload);
            }

            if(data.type == "deleteChart") {
                deleteChart(data.payload.chartId);
            }
            if(data.type == "deleteLine") {
                deleteLine(data.payload.chartId, data.payload.lineId);
            }
            if(data.type == "deleteAllMarkers") {
                deleteAllMarkers()
            }
        }
    }

    onMount(async () => {
        await getCharts();
        await startWs();
    });
</script>

<div style="display: flex; justify-content: center; margin-top: 1.5em;">
    <div style="display: flex; flex-direction: column; width: fit-content;">
        <h1 style="margin: 0; padding: 0; text-align: center;">Charter</h1>
        <span>Made with ❤️ by <a href="https://github.com/stormyhs" target="_blank">stormyhs</a></span>
    </div>
</div>

<div style="height: 25px;"></div>

<div style="display: flex; justify-content: center; margin-bottom: 25px;">
    <Container style="display: flex; align-items: center; gap: 15px; width: inherit; width: 70%">
        <p>API docs <a href="/docs">here</a>.</p>


        <div style="margin-left: auto;">
            <button
                onclick={fitAllToScale}
                style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer; font-size: inherit;"
            >
                <p>📏 Fit all to scale</p>
            </button>

            <button
                onclick={clearCharts}
                style="padding: 10px; border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer; font-size: inherit;"
            >
                <p>🗑️ Delete all data</p>
            </button>
        </div>
    </Container>
</div>

<Grid>
    {#each charts as chart}
        <div style="display: flex; justify-content: center;">
            <Container title={chart.title || "Untitled Chart"} color={chart.color}>
                <Chart
                    height={400}
                    width={900}
                    ref={(r) => {
                        if(r != null) {
                            // @ts-ignore shut the fuck up
                            chart.ref = r;
                        }
                    }}
                    layout={layout}
                    grid={grid}
                >
                    {#each getChartLines(chart.id) as line}
                    <LineSeries
                        data={[]}
                        markers={[]}
                        color={line.color}
                        ref={(r) => {
                            if(r != null) {
                                line.ref = r;
                            }
                        }}
                    />
                    {/each}
                </Chart>
                <button onclick={() => fitToScale(chart.id)} style="border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer; font-size: inherit;">
                    📏 Fit to scale
                </button>
                <button onclick={() => screenshot(chart.id)} style="border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer; font-size: inherit;">
                    🔗 Open image
                </button>
                <button onclick={() => copyScreenshot(chart.id)} style="border-radius: 8px; background-color: #22242c; color: white; border: none; cursor: pointer; font-size: inherit;">
                    📋 Copy image
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

<!-- <LoadingBar progress={50} /> -->

<div style="height: 35px;"></div>
