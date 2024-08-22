<style>
.verb {
    background-color: #44475a;
    color: #f8f8f2;
    padding: 8px;
    border-radius: 8px;
}
.code {
    background-color: #44475a;
    color: #f8f8f2;
    padding: 2px;
    border-radius: 4px;
}
.purple { color: #bd93f9; }
.green { color: #50fa7b; }
.red { color: #ff5555; }
.yellow { color: #f1fa8c; }
.orange { color: #ffb86c; }
</style>

<script lang="ts">
    import Container from "../../components/Container.svelte";
</script>

<div class="center" style="margin-top: 50px;">
    <Container style="width: 70%">
        <h1>Charter API Documentation</h1>

        <div style="margin-top: 70px;"></div>

        <h2>The [name] paramater</h2>
        <p>For data that has multiple displays (such as 3 charts), the [name] parameter is used to specify which chart to get data from.</p>
        <p>For example, <code class="code">/chart/primary</code> would get data from the primary chart.</p>
        <p>Currently, Charter provides 3 charts: primary, secondary, and tertiary.</p>
        <p>This naming scheme is global where applicable.</p>

        <div style="margin-top: 70px;"></div>

        <p>The API follows a general pattern:</p>
        <p><span class="verb purple">GET</span> /chart/[name]</p>
        <p>Will fetch held data</p>
        <p><span class="verb green">POST</span> /chart/[name]</p>
        <p>Will add to the held data</p>
        <p><span class="verb orange">PUT</span> /chart/[name]</p>
        <p>Will replace the held data</p>
        <p><span class="verb red">DELETE</span> /chart/[name]</p>
        <p>Will clear the held data</p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /chart/[name]</h3>
        <p>Get all data points the chart is holding.</p>
        <h3>Returns</h3>
        <p><span class="code">SeriesData[]</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb green">POST</span> /chart/[name]</h3>
        <p>Adds the given <span class="code">SeriesData</span> to the chart. Timestamp must be higher than previous point.</p>
        <h3>Body</h3>
        <p><span class="code">SeriesData</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb orange">PUT</span> /chart/[name]</h3>
        <p>Sets the chart's data points to the given <span class="code">SeriesData[]</span> array. Timestamps must be sorted.</p>
        <h3>Body</h3>
        <p><span class="code">SeriesData[]</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /chart/[name]</h3>
        <p>Clears all data points from the chart.</p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /marker/[name]</h3>
        <p>Get all markers the chart is holding.</p>
        <h3>Returns</h3>
        <p><span class="code">SeriesMarker[]</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb green">POST</span> /marker/[name]</h3>
        <p>Adds the given <span class="code">SeriesMarker</span> to the chart.</p>
        <h3>Body</h3>
        <p><span class="code">SeriesMarker</span></p>
        <h3>Example body</h3>


        <div style="margin-top: 70px;"></div>

        <h3><span class="verb orange">PUT</span> /marker/[name]</h3>
        <p>Sets the chart's markers to the given <span class="code">SeriesMarker[]</span> array.</p>
        <h3>Body</h3>
        <p><span class="code">SeriesMarker[]</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /marker/[name]</h3>
        <p>Clears all markers from the chart.</p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /title/[name]</h3>
        <p>Get the title of the chart.</p>
        <h3>Returns</h3>
        <p><span class="code">string</span></p>

        <div style="margin-top: 70px;"></div>
        <h3><span class="verb green">POST</span> /title/[name]</h3>
        <p>Sets the title of the chart.</p>
        <h3>Body</h3>
        <p><span class="code">string</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /title/[name]</h3>
        <p>Clears the title of the chart.</p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /loadingbar</h3>
        <p>Get the progress of the loading bar.</p>
        <h3>Returns</h3>
        <p><span class="code">number</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb green">POST</span> /loadingbar</h3>
        <p>Sets the progress of the loading bar.</p>
        <h3>Body</h3>
        <p><span class="code">number</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /loadingbar</h3>
        <p>Clears the progress of the loading bar.</p>
    </Container>
</div>

<div class="center" style="margin-top: 50px;">
    <Container style="width: 70%">
        <h1>Types</h1>

        <h2>SeriesData</h2>
        <p>Represents a single data point on a chart.</p>
        <pre>
interface SeriesData &lbrace;
    time: number; // Unix timestamp
    value: number;
&rbrace;
        </pre>
        <pre>
[
    &lbrace; "time": 1724347498, "value": 123.70 &rbrace;,
    &lbrace; "time": 1724347499, "value": 124.20 &rbrace;,
    &lbrace; "time": 1724347500, "value": 121.00 &rbrace;,
    &lbrace; "time": 1724347501, "value": 127.65 &rbrace;
]
        </pre>

        <div style="margin-top: 70px;"></div>

        <h2>SeriesMarker</h2>
        <p>Represents a marker on a chart.</p>
        <pre>
interface SeriesMarker &lbrace;
    time: number; // Unix timestamp
    position: 'aboveBar' | 'belowBar';
    color: string; // Can be a named color or a hex code
    shape: 'arrowUp' | 'arrowDown' | 'circle';
    text: string;
    size: number;
&rbrace;
        </pre>
        <pre>
&lbrace;
    time: '1724347499',
    position: 'aboveBar',
    color: 'green',
    shape: 'arrowDown',
    text: 'Bought',
    size: 2,
&rbrace;,
        </pre>
    </Container>
</div>

<div class="center" style="margin-top: 50px;">
    <Container style="width: 70%">
        <h3>Yes, this page is very basic, has no syntax highlighting, and is not very pretty.</h3>
        <h3>Mad?</h3>
        <h3>&lbrace;TODO&rbrace; add trollface here</h3>
    </Container>
</div>

<div style="margin-top: 70px;"></div>
