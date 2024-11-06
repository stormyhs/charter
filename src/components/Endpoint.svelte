<style>
.verb {
    background-color: #44475a;
    color: #f8f8f2;
    padding: 2px;
    border-radius: 4px;
}
.code {
    background-color: #44475a;
    color: #f8f8f2;
    padding: 2px;
    border-radius: 4px;
}
.get { color: #bd93f9; }
.post { color: #50fa7b; }
.delete { color: #ff5555; }
.patch { color: #f1fa8c; }
.put { color: #ffb86c; }
</style>

<script lang="ts">
    type Verb = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

    export let verb: Verb;
    export let text: string;
    export let takes: string = "";
    export let returns: string = "";
    export let description: string = "";
</script>

<div>
    <span class="verb {verb.toLowerCase()}">{verb}</span> <span class="code">{text}</span>

    {#if description}
        <p style="margin-top: 0.8rem;">{description}</p>
    {/if}

    {#if takes}
        <p style="margin-top: 0.8rem;">Takes: <span class="code">{takes}</span></p>
    {/if}

    {#if returns}
        <p style="margin-top: 0.8rem;">Returns: <span class="code">{returns}</span></p>
    {/if}
</div>
