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

        <h3>Notes</h3>
        <p>All requests must contain a <code>Content-Type: application/json</code> header.</p>
        <p>The <code>[id]</code> field is a unique identifier for each chart. It must be a number.</p>
        <p>Supplying data points that are not ordered in time will cause the chart to freeze, though supplying a timestamp that already exists will simply overwrite it.</p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /api/charts</h3>
        <p>Get all charts.</p>
        <h4>Returns</h4>
        <p><span class="code">Chart[]</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb green">POST</span> /api/charts/[id]</h3>
        <p>Sets a chart's metadata. Fields that were not supplied will remain untouched. If chart doesnt exist, creates it.</p>
        <h4>Expects</h4>
        <span><span class="code">ChartMetadata</span> - Every field is optional.</span>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /api/charts/[id]</h3>
        <p>Removes the chart with the given ID.</p>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /api/lines/[id]</h3>
        <p>Gets the chart with the given ID.</p>
        <h4>Returns</h4>
        <p><span class="code">Chart</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb green">POST</span> /api/lines/[id]</h3>
        <p>Appends data points to a chart.</p>
        <h4>Expects</h4>
        <span><span class="code">LineData</span> - Each field is optional. Note that the <code>data</code> field is an array of arrays. This can be used for multiline charts.</span>
        <h4>Returns</h4>
        <p><span class="code">Chart</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb orange">PUT</span> /api/lines/[id]</h3>
        <p>Sets data points to a chart.</p>
        <h4>Expects</h4>
        <span><span class="code">LineData[][]</span> - Note that it is an array of arrays. This can be used for multiline charts.</span>
        <h4>Returns</h4>
        <p><span class="code">Chart</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /api/lines/[id]</h3>
        <p>Deletes a chart.</p>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /reset</h3>
        <p>Removes all data.</p>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb purple">GET</span> /loadingbar</h3>
        <p>Get loading bar progress</p>
        <h4>Returns</h4>
        <p><span class="code">number</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb orange">PUT</span> /loadingbar</h3>
        <p>Set loading bar progress</p>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">REMOVE</span> /loadingbar</h3>
        <p>Reset loading bar progress</p>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

    </Container>
</div>

<div class="center" style="margin-top: 50px;">
    <Container style="width: 70%">
        <h1>Types</h1>

        <h2>Chart</h2>
        <pre>
interface Chart&lbrace;
    id: number;
    title: string;
    color: string;
    data: SeriesData[];
    markers: SeriesMarker[];
&rbrace;
        </pre>

        <div style="margin-top: 70px;"></div>

        <h2>ChartMetadata</h2>
        <pre>
interface ChartMetadata &lbrace;
    title: string;
    color: string;
&rbrace;
        </pre>

        <div style="margin-top: 70px;"></div>

        <h2>LineData</h2>
        <p>Represents a single data point on a chart, and/or the colors of each line.</p>
        <pre>
interface LineData &lbrace;
    data: [
        // Note that the data field is an array of arrays. This can be used for multiline charts.
        [&lbrace; // This will append this data point to the first line.
            time: number; // Unix timestamp
            value: number;
        &rbrace;],
        [&lbrace; // This will append this data point to the second line.
            time: number; // Unix timestamp
            value: number;
        &rbrace;]
    ]
    colors: string[]; // Sets the color of each line, in order. Use null to skip a line.
&rbrace;
        </pre>

        <div style="margin-top: 70px;"></div>

        <!--- 
        <h2>SeriesMarker</h2>
        <p>Represents a marker on a chart.</p>
        <pre>
interface SeriesMarker &lbrace;
    "time": number;     // Unix timestamp
    "position": string; // "aboveBar" | "belowBar"
    "color": string;    // Can be a named color or a hex code
    "shape": string;    // "arrowUp" | "arrowDown" | "circle" | "square"
    "text": string;     // Text to display
    "size": number;     // Size of the marker
&rbrace;
        </pre>
        <p>Example:</p>
        <pre>
&lbrace;
    "time": 1724347499,
    "position": "aboveBar",
    "color": "green",
    "shape": "arrowDown",
    "text": "Bought",
    "size": 2,
&rbrace;,
        </pre>
        --->
    </Container>
</div>

<div style="margin-top: 70px;"></div>
