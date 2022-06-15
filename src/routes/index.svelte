<script>
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