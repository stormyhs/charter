<script lang="ts">
    import Container from "../../components/Container.svelte";
    import Endpoint from "../../components/Endpoint.svelte";

    type Verb = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
    interface Route {
        verb: Verb;
        text: string;
        description: string;
        takes?: string;
        returns: string;
    }

    const routes: Route[] = [
        {
            verb: "GET",
            text: "/api/charts",
            description: "Get all information on all stored charts. Includes lines and markers.",
            returns: "Chart[]"
        },
        {
            verb: "GET",
            text: "/api/<chartId>/",
            description: "Get all information stored on a specific chart. Includes lines and markers.",
            returns: "Chart"
        },
        {
            verb: "POST",
            text: "/api/<chartId>/",
            description: "Set a chat's metadate.",
            takes: "ChartMetadata",
            returns: "HTTP Status Code"
        },
        {
            verb: "DELETE",
            text: "/api/<chartId>/",
            description: "Delete a chart.",
            returns: "HTTP Status Code"
        },
        {
            verb: "POST",
            text: "/api/<chartId>/<lineId>/",
            description: "Append provided points, markers, and/or colors for a line.",
            takes: "Line",
            returns: "HTTP Status Code"
        },
        {
            verb: "PUT",
            text: "/api/<chartId>/<lineId>/",
            description: "Set provided points, markers, and/or colors for a line.",
            takes: "Line",
            returns: "HTTP Status Code"
        },
        {
            verb: "DELETE",
            text: "/api/<chartId>/<lineId>/",
            description: "Delete one of a chart's lines.",
            returns: "HTTP Status Code"
        },
    ]
</script>

<div class="center" style="margin-top: 50px;">
    <Container style="width: 70%;">
        <h1>Charter API Documentation</h1>
        <p>Work in progress - May contain inaccuracies.</p>

        <div style="margin-top: 70px;"></div>

        {#each routes as route}
            <Endpoint
                verb={route.verb}
                text={route.text}
                description={route.description}
                takes={route.takes}
                returns={route.returns}
            />
            <div style="margin-top: 2rem;"></div>
        {/each}

        <div style="margin-top: 70px;"></div>

        <p>ChartMetadata</p>
<pre>
<span>id: number,
title: string,
color: string</span>
</pre>

        <p>Chart</p>
<pre>
<span>id: number,
title: string,
color: string,
lines: Line[],     // Note that this is an array of Lines.
markers: Marker[]  // Note that this is an array of Markers.</span>
</pre>

        <p>Line</p>
<pre>
<span>color: string,
points: Point[],
markers: Marker[]</span>
</pre>

        <p>Point</p>
<pre>
<span>time: number,
value: number</span>
</pre>

        <p>Marker</p>
<pre>
<span>time: number,
position: MarkerPosition,
shape: MarkerShape,
size?: number,
color?: string,
text?: string</span>
</pre>

        <p>MarkerPosition</p>
<pre>"aboveBar" | "belowBar" | "inBar"</pre>

        <p>MarkerShape</p>
<pre>"circle" | "square" | "arrowUp" | "arrowDown"</pre>

    </Container>
</div>

<div style="margin-top: 70px;"></div>
