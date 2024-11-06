<style>
.container {
    background-color: #22242c;

    height: fit-content;
    width: fit-content;

    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 12px;
    padding-right: 12px;
    
    border-radius: 8px;
}
</style>

<script lang="ts">
    export let title: string = "";
    export let style: string = "";
    export let color: string = "white";
</script>

<div class="container" style={style}>
    {#if title}
        <p style="color: {color}; margin: 0; padding: 8px;">
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
        </p>
    {/if}
    <slot></slot>
</div>
