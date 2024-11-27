<style>
    .parent {
        margin-left: auto;
        margin-right: auto;
        max-width: 100vw;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(900px, 1fr));
        gap: 20px;
    }
</style>

<script lang="ts">
</script>

<div class="parent">
    <div class="grid">
        <slot></slot>
    </div>
</div>
