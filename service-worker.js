/* =========================================================
   ROO MAP PWA — service-worker.js
   Offline-first cache for:
   - app shell
   - CSS / JS
   - data.js
   - manifest
   - Centeroo map
   - Outeroo map
   - icons
========================================================= */

"use strict";

const CACHE_VERSION = "roo-map-cache-v1.0.60-gapfill-close";

const CORE_ASSETS = [
	"./",
	"./index.html",
	"./style.css",
	"./data.js",
	"./script.js",
	"./manifest.json",
	"./centeroo-map.png",
	"./outeroo-map.png",
	"./icon-192.png",
	"./icon-512.png"
];

/* =========================
   INSTALL
========================= */

self.addEventListener("install", (event) => {
	event.waitUntil(
		installCoreAssets()
		.then(() => self.skipWaiting())
	);
});

async function installCoreAssets() {
	const cache = await caches.open(CACHE_VERSION);

	await Promise.all(
		CORE_ASSETS.map(async (asset) => {
			try {
				await cache.add(asset);
			} catch (error) {
				console.warn("[Roo Map SW] Could not cache:", asset, error);
			}
		})
	);
}

/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", (event) => {
	event.waitUntil(
		cleanupOldCaches()
		.then(() => self.clients.claim())
	);
});

async function cleanupOldCaches() {
	const cacheNames = await caches.keys();

	await Promise.all(
		cacheNames.map((cacheName) => {
			if (cacheName !== CACHE_VERSION) {
				return caches.delete(cacheName);
			}

			return Promise.resolve();
		})
	);
}

/* =========================
   FETCH
========================= */

self.addEventListener("fetch", (event) => {
	const request = event.request;

	if (request.method !== "GET") return;

	const url = new URL(request.url);

	if (url.origin !== self.location.origin) return;

	if (request.mode === "navigate") {
		event.respondWith(handleNavigationRequest(request));
		return;
	}

	event.respondWith(handleAssetRequest(request));
});

/* =========================
   REQUEST STRATEGIES
========================= */

async function handleNavigationRequest(request) {
	const cache = await caches.open(CACHE_VERSION);

	try {
		const freshResponse = await fetch(request);

		if (freshResponse && freshResponse.ok) {
			await cache.put("./index.html", freshResponse.clone());
		}

		return freshResponse;
	} catch (error) {
		const cachedIndex = await cache.match("./index.html");
		if (cachedIndex) return cachedIndex;

		return new Response("Roo Map is offline and the app shell is not cached yet.", {
			status: 503,
			headers: {
				"Content-Type": "text/plain"
			}
		});
	}
}

async function handleAssetRequest(request) {
	const cache = await caches.open(CACHE_VERSION);
	const cachedResponse = await cache.match(request);

	if (cachedResponse) {
		updateCacheInBackground(request);
		return cachedResponse;
	}

	try {
		const freshResponse = await fetch(request);

		if (freshResponse && freshResponse.ok) {
			await cache.put(request, freshResponse.clone());
		}

		return freshResponse;
	} catch (error) {
		return new Response("Offline asset unavailable.", {
			status: 503,
			headers: {
				"Content-Type": "text/plain"
			}
		});
	}
}

async function updateCacheInBackground(request) {
	try {
		const cache = await caches.open(CACHE_VERSION);
		const freshResponse = await fetch(request);

		if (freshResponse && freshResponse.ok) {
			await cache.put(request, freshResponse.clone());
		}
	} catch (error) {
		/* Offline or weak signal. Cached version stays active. */
	}
}