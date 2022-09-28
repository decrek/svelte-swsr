import { manifest } from '../.svelte-kit/output/server/manifest.js';
import { Server } from '../.svelte-kit/output/server/index.js';
import revManifest from '../.svelte-kit/output/client/_app/immutable/manifest.json';
const server = new Server(manifest);

const revManifestEntries = Object.values(revManifest);
const CSS_FILES = revManifestEntries
	.map((entry) => (entry.css ? `/_app/immutable/${entry.css}` : entry.css))
	.flat()
	.filter(Boolean);

const JS_FILES = revManifestEntries.map((entry) => `/_app/immutable/${entry.file}`);
const CORE_CACHE_FILES = JS_FILES.concat(CSS_FILES, ['/content.sqlite', '/sql-wasm.wasm']);

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open('core_cache')
			.then((cache) => cache.addAll(CORE_CACHE_FILES))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.open('core_cache').then((cache) => {
			return cache
				.keys()
				.then((requests) => {
					return Promise.all(
						requests
							.filter((request) => !CORE_CACHE_FILES.includes(getPathName(request.url)))
							.map((cacheName) => cache.delete(cacheName))
					);
				})
				.then(() => self.clients.claim());
		})
	);
});

self.addEventListener('fetch', async (event) => {
	const { request } = event;
	if (request.headers.get('Accept').includes('text/html')) {
		event.respondWith(handler(request));
	} else if (request.url.includes('/api')) {
		event.respondWith(handler(request));
	} else if (isCoreGetRequest(request)) {
		event.respondWith(caches.open('core_cache').then((cache) => cache.match(request.url)));
	}
});

async function handler(req) {
	return await server.respond(req, {
		platform: { env: {}, context: {} },
		getClientAddress() {
			return req.headers.get('cf-connecting-ip');
		}
	});
}

function isCoreGetRequest(request) {
	return request.method === 'GET' && CORE_CACHE_FILES.includes(getPathName(request.url));
}

function getPathName(requestUrl) {
	const url = new URL(requestUrl);
	return url.pathname;
}
