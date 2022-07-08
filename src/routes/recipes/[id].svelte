<script context="module">
    /** @type {import('./__types/index').Load} */
    export async function load({ fetch, params }) {
        const response = await fetch(`/api/recipe/?id=${params.id}`);

        return {
            status: response.status,
            props: {
                recipe: response.ok && (await response.json())
            }
        };
    }
</script>

<script>
    export let recipe;
</script>

<h1 class="font-larger">{recipe.name}</h1>
<h2 class="font-large">{recipe.description}</h2>
<img src="{recipe.image}" alt="The recipe result">