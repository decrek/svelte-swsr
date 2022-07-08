<script context="module">
    /** @type {import('./__types/index').Load} */
    export async function load({ fetch, url }) {
        const queryParams = url.searchParams ? `?${url.searchParams.toString()}` : ''
        const response = await fetch(`/api/recipe${queryParams}`);

        return {
            status: response.status,
            props: {
                recipes: response.ok && (await response.json())
            }
        };
    }
</script>

<script>
    export let recipes;
    let form;

    async function onSubmit() {
        const searchParams = new URLSearchParams(new FormData(form)).toString()
        const queryParams = searchParams ? `?${searchParams}` : ''
        recipes = await fetch(`/api/recipe${queryParams}`).then(res => res.json())
    }
</script>

<h1 class="font-larger">This is initially rendered on Cloudflare Workers and after registering a service worker rendered in a serviceworker!</h1>
<p>Visit <a href="/about">About</a> just to see another route</p>

<form method="get" bind:this={form} on:submit|preventDefault={onSubmit}>
    <label>
        Search
        <input type="search" name="q" on:input={onSubmit}>
    </label>
    <button type="submit">Search</button>
</form>

<ul>
    {#each recipes as recipe}
        <li>
            <a href="/recipes/{recipe.id}">{recipe.name}</a>
        </li>
    {/each}
</ul>