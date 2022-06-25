<script>
    import '../app.css'
    import { onMount } from 'svelte';

    onMount(async () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/service-worker.js')
                    .then((registration) => registration.update())
            });
        }
    })
</script>

<slot></slot>