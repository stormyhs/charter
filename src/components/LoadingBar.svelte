<script lang="ts">
    export let style: string = "";
    export let progress: number = 0;
</script>

<style>
    .loading-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        background-color: #000;
        overflow: hidden;
        z-index: 1000; /* Because the TradingView charts seem to take over. */
    }

    .progress {
        height: 100%;
        background-color: #4CAF50;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.6s ease-in-out;
    }

    .progress.animate {
        transform: scaleX(1);
    }
</style>

<div class="loading-bar" style={style}>
    <div class="progress animate" style="transform: scaleX({progress / 100})"></div>
</div>
