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

        <h3><span class="verb purple">GET</span> /chart</h3>
        <p>Get all charts.</p>
        <h4>Returns</h4>
        <p><span class="code">Chart[]</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb green">POST</span> /chart</h3>
        <p>Appends any data fields into a chart. If chart doesnt exist, creates it.</p>
        <h4>Expects</h4>
        <span><span class="code">Chart</span> - Every field is optional.</span>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb orange">PUT</span> /chart</h3>
        <p>Overwrites any data fields into a chart. If chart doesnt exist, creates it.</p>
        <h4>Expects</h4>
        <span><span class="code">Chart</span> - Every field is optional.</span>
        <h4>Returns</h4>
        <p><span class="code">200 OK</span></p>

        <div style="margin-top: 70px;"></div>

        <h3><span class="verb red">DELETE</span> /chart</h3>
        <p>Removes the chart with the given ID.</p>
        <h4>Expects</h4>
        <span class="code">number</span>
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
        <p>Represents a chart</p>
        <pre>
interface Chart &lbrace;
    id: number;
    data: SeriesData[];
    markers: SeriesMarker[];
    title: string;
    color: string;
&rbrace;
        </pre>
        <p>Example:</p>
        <pre>
&lbrace;
    "id": 1,
    "title": "$REAL"
    "color": "yellow"
    "data": [&lbrace; "time": 1724347506, "value": 120.00 &rbrace;],
    "markers": [],
&rbrace;
        </pre>

        <h2>SeriesData</h2>
        <p>Represents a single data point on a chart.</p>
        <pre>
interface SeriesData &lbrace;
    time: number; // Unix timestamp
    value: number;
&rbrace;
        </pre>
        <p>Example:</p>
        <pre>
&lbrace; "time": 1724347498, "value": 123.70 &rbrace;,
        </pre>

        <div style="margin-top: 70px;"></div>

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
