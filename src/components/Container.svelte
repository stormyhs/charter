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
</script>

<div class="container" style={style}>
    {#if title}
        <h2 style="margin: 0; padding: 8px">{title}</h2>
    {/if}
    <slot></slot>
</div>
