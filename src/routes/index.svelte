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
    let count = 0;

    function handleClick() {
        count += 1;
    }
</script>

<h1 class="font-larger">This is initially rendered on Cloudflare Workers and after registering a service worker rendered in a serviceworker!</h1>
<p>Visit <a href="/about">About</a> just to see another route</p>

<h2 class="font-large">And here we have a counter in order to test client side hydration.</h2>
<button on:click={handleClick}>
    clicks: {count}
</button>

<form method="get">
    <label>
        Search
        <input type="search" name="q">
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