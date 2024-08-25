<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(800px, 1fr));
        gap: 16px;
        padding: 16px;
    }

    .center {
        margin-left: auto;
        margin-right: auto;
    }

</style>

<script lang="ts">
</script>

<div class="grid center">
    <slot></slot>
</div>
