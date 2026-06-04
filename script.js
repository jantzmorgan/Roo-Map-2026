/* =========================================================
   ROO MAP PWA — script.js
   Dual-map engine: Centeroo + Outeroo

   Uses:
   - data.js for maps, places, amenities, events, walk times
   - active map switching
   - per-map pan/zoom memory
   - per-map saved spots
   - per-map GPS calibration
   - shared compass logic
========================================================= */

"use strict";

/* =========================================================
   DATA SAFETY
========================================================= */

const ROO_DATA = window.ROO_DATA || {
	version: "missing",
	defaultMapId: "centeroo",
	days: ["All", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
	maps: {
		centeroo: {
			id: "centeroo",
			name: "Centeroo",
			image: "./centeroo-map.png",
			description: "Centeroo map.",
			calibrationAnchors: []
		}
	},
	places: [],
	amenities: [],
	events: [],
	walkTimes: {}
};

const ROO_APP_VERSION = "0.4.1";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {
	activeScreen: "roo_active_screen_v1",
	activeMapId: "roo_active_map_id_v1",
	selectedDay: "roo_selected_day_v1",
	plannerDay: "roo_planner_day_v1",
	timelineDay: "roo_timeline_day_v1",
	picks: "roo_picks_v1",
	picksBackup: "roo_picks_backup_v1",
	picksBackupLastGood: "roo_picks_backup_last_good_v1",
	savedSpots: "roo_saved_spots_v1",
	mapTransformsByMap: "roo_map_transforms_by_map_v3",
	amenityFilters: "roo_amenity_filters_v1",
	settings: "roo_settings_v1",
	calibrationByMap: "roo_calibration_by_map_v1"
};

const DEFAULT_SETTINGS = {
	walkSpeedMinutesPerMile: 20,
	notificationMinutesBefore: 15,
	showAmenityLabels: false,
	showAccuracyCircle: true
};

const DEFAULT_AMENITY_FILTERS = {
	water: true,
	bathroom: true,
	food: true,
	medical: true,
	info: true
};

const ROO_DAYS = ROO_DATA.days || ["All", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* =========================================================
   STATE
========================================================= */

const appState = {
	activeScreen: loadValue(STORAGE_KEYS.activeScreen, "map"),
	activeMapId: loadValue(STORAGE_KEYS.activeMapId, ROO_DATA.defaultMapId || "centeroo"),
	selectedDay: loadValue(STORAGE_KEYS.selectedDay, "All"),
	plannerDay: loadValue(STORAGE_KEYS.plannerDay, "All"),
	timelineDay: loadValue(STORAGE_KEYS.timelineDay, "All"),

	picks: loadJSON(STORAGE_KEYS.picks, {}),
	savedSpots: loadJSON(STORAGE_KEYS.savedSpots, []),

	mapTransformsByMap: loadJSON(STORAGE_KEYS.mapTransformsByMap, {}),

	amenityFilters: {
		...DEFAULT_AMENITY_FILTERS,
		...loadJSON(STORAGE_KEYS.amenityFilters, {})
	},

	settings: {
		...DEFAULT_SETTINGS,
		...loadJSON(STORAGE_KEYS.settings, {})
	},

	calibrationByMap: normalizeCalibrationStore(
		loadJSON(STORAGE_KEYS.calibrationByMap, null)
	),

	map: {
		scale: 1,
		fitScale: 1,
		minScale: 1,
		maxScale: 4,
		x: 0,
		y: 0,
		isDragging: false,
		startClientX: 0,
		startClientY: 0,
		startX: 0,
		startY: 0,
		lastTapTime: 0,
		longPressTimer: null,
		longPressFired: false,
		lastMapPoint: null,
		touchMoved: false,
		touchStartTarget: null,
		ignoreNextMapTap: false,
		pendingTransformFrame: null,
		saveTransformTimer: null
	},

	pinch: {
		active: false,
		startDistance: 0,
		startScale: 1
	},

	location: {
		watchId: null,
		enabled: false,
		position: null,
		mapPoint: null,
		accuracyMeters: null,
		lastUpdatedAt: null
	},

	compass: {
		enabled: false,
		heading: null,
		targetSpotId: null,
		bearingToTarget: null,
		distanceToTargetMeters: null
	},

	selectedPlaceId: null,
	mapUiHidden: false
};

if (!ROO_DATA.maps[appState.activeMapId]) {
	appState.activeMapId = ROO_DATA.defaultMapId || Object.keys(ROO_DATA.maps)[0] || "centeroo";
}

if (!ROO_DAYS.includes(appState.selectedDay)) appState.selectedDay = "All";
if (!ROO_DAYS.includes(appState.plannerDay)) appState.plannerDay = "All";
if (!ROO_DAYS.includes(appState.timelineDay)) appState.timelineDay = "All";

restoreMapTransform();

/* =========================================================
   BOOT
========================================================= */

document.addEventListener("DOMContentLoaded", bootRooApp);

function bootRooApp() {
	bindScreenNavigation();
	bindHeaderActions();
	bindMapSwitcher();
	bindDayFilters();
	bindMapGestures();
	bindMapControls();
	bindMapUiToggle();
	bindSheetControls();
	bindSpotControls();
	bindSearchControls();
	bindSettingsControls();
	bindCompassControls();

	syncAmenityCheckboxes();

	/*
		Always open Roo Map on the map screen and start the active map
		centered / fully zoomed out instead of restoring an old pan/zoom.
	*/
	appState.activeScreen = "map";
	saveValue(STORAGE_KEYS.activeScreen, "map");
	appState.mapTransformsByMap = {};
	saveJSON(STORAGE_KEYS.mapTransformsByMap, appState.mapTransformsByMap);

	renderAll();

	setActiveScreen("map", { skipRender: true });
	setActiveMap(appState.activeMapId, { skipSaveCurrentTransform: true, skipToast: true, forceDefaultView: true });

	window.addEventListener("resize", () => {
		layoutMapContentToImage();
		clampMapTransform();
		applyMapTransform();
		saveMapTransform();
	});

	registerServiceWorker();
}

/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {
	renderMapShell();
	renderMapSwitcher();
	renderDayFilters();
	renderPlaceLayer();
	renderAmenityLayer();
	renderSavedSpots();
	renderGPSLayer();
	renderPlanner();
	renderSearchResults();
	renderTimeline();
	renderSettings();
	updateLocationStatus();
	updateCompassUI();
}

/* =========================================================
   ACTIVE MAP
========================================================= */

function bindMapSwitcher() {
	document.addEventListener("click", (event) => {
		const button = event.target.closest("[data-map-target]");
		if (!button) return;

		setActiveMap(button.dataset.mapTarget);
	});
}

function setActiveMap(mapId, options = {}) {
	const map = getMap(mapId);
	if (!map) {
		showToast("Map not found.");
		return;
	}

	if (!options.skipSaveCurrentTransform && !options.forceDefaultView) {
		saveMapTransform();
	}

	appState.activeMapId = mapId;
	saveValue(STORAGE_KEYS.activeMapId, mapId);

	/*
		Map switches should always land on the centered, fully zoomed-out
		default view. Clear this map's old saved transform so it cannot
		restore a weird previous pan/zoom.
	*/
	delete appState.mapTransformsByMap[mapId];
	saveJSON(STORAGE_KEYS.mapTransformsByMap, appState.mapTransformsByMap);

	closeStageSheet();
	closeSpotsPanel();
	hideCompassPanelOnly();

	appState.location.mapPoint = getCurrentGPSMapPoint();

	renderMapShell();
	renderMapSwitcher();
	renderPlaceLayer();
	renderAmenityLayer();
	renderSavedSpots();
	renderGPSLayer();
	renderSettings();
	updateLocationStatus();

	if (!options.skipToast) {
		showToast(`${map.name} loaded`);
	}
}

function renderMapShell() {
	const map = getActiveMap();

	const title = document.querySelector("[data-active-map-title]");
	const eyebrow = document.querySelector("[data-active-map-eyebrow]");
	const image = document.querySelector("[data-map-image]");

	if (title) {
		title.textContent = `${map.name} Map`;
	}

	if (eyebrow) {
		eyebrow.textContent = "Bonnaroo 2026";
	}

	if (!image) return;

	const finishMapLayout = () => {
		layoutMapContentToImage();
		resetMapView({ save: false });
	};

	image.alt = `Bonnaroo ${map.name} map`;

	if (!image.src.endsWith(map.image)) {
		image.onload = finishMapLayout;
		image.src = map.image;
		return;
	}

	if (image.complete && image.naturalWidth > 0) {
		finishMapLayout();
	} else {
		image.onload = finishMapLayout;
	}
}

function renderMapSwitcher() {
	document.querySelectorAll("[data-map-target]").forEach((button) => {
		const isActive = button.dataset.mapTarget === appState.activeMapId;
		button.classList.toggle("is-active", isActive);
		button.setAttribute("aria-current", isActive ? "true" : "false");
	});
}

function getActiveMap() {
	return getMap(appState.activeMapId) || Object.values(ROO_DATA.maps)[0];
}

function getMap(mapId) {
	return ROO_DATA.maps[mapId] || null;
}

/* =========================================================
   NAVIGATION
========================================================= */

function bindScreenNavigation() {
	document.addEventListener("click", (event) => {
		const button = event.target.closest("[data-screen-target]");
		if (!button) return;

		const screenName = button.dataset.screenTarget;

		setActiveScreen(screenName);

		if (screenName !== "map") {
			closeStageSheet();
			closeSpotsPanel();
			hideCompassPanelOnly();
		}
	});
}

function setActiveScreen(screenName, options = {}) {
	appState.activeScreen = screenName;
	saveValue(STORAGE_KEYS.activeScreen, screenName);

	document.querySelectorAll("[data-screen]").forEach((screen) => {
		const isActive = screen.dataset.screen === screenName;
		screen.classList.toggle("active-screen", isActive);
		screen.classList.toggle("is-active", isActive);
		screen.setAttribute("aria-hidden", isActive ? "false" : "true");
	});

	document.querySelectorAll("[data-screen-target]").forEach((button) => {
		const isActive = button.dataset.screenTarget === screenName;
		button.classList.toggle("active-nav", isActive);
		button.classList.toggle("is-active", isActive);
		button.setAttribute("aria-current", isActive ? "page" : "false");
	});

	if (!options.skipRender) {
		if (screenName === "map") {
			requestAnimationFrame(() => {
				layoutMapContentToImage();
				applyMapTransform();
			});
		}

		if (screenName === "planner") renderPlanner();
		if (screenName === "search") renderSearchResults();
		if (screenName === "timeline") renderTimeline();
		if (screenName === "settings") renderSettings();
	}
}

function bindHeaderActions() {
	document.addEventListener("click", (event) => {
		if (event.target.closest("[data-quick-location]")) {
			enableLocation();
		}

		if (event.target.closest("[data-open-compass]")) {
			openCompassPanel();
		}

		if (event.target.closest("[data-open-app-help]")) {
			openAppHelp();
		}

		if (event.target.closest("[data-close-app-help]")) {
			closeAppHelp();
		}

		if (event.target.matches("[data-app-help-modal]")) {
			closeAppHelp();
		}
	});
}

function openAppHelp() {
	const modal = document.querySelector("[data-app-help-modal]");
	if (!modal) return;

	closeStageSheet();
	closeSpotsPanel();
	hideCompassPanelOnly();

	modal.classList.add("is-open");
	modal.setAttribute("aria-hidden", "false");

	const card = modal.querySelector(".app-help-card");
	if (card) {
		card.scrollTop = 0;
	}
}

function closeAppHelp() {
	const modal = document.querySelector("[data-app-help-modal]");
	if (!modal) return;

	modal.classList.remove("is-open");
	modal.setAttribute("aria-hidden", "true");
}

/* =========================================================
   DAY FILTERS
========================================================= */

function bindDayFilters() {
	document.addEventListener("click", (event) => {
		const mapButton = event.target.closest("[data-day-filter]");
		if (mapButton) {
			appState.selectedDay = mapButton.dataset.dayFilter;
			saveValue(STORAGE_KEYS.selectedDay, appState.selectedDay);

			renderDayFilters();

			if (appState.selectedPlaceId) {
				openPlaceSheet(appState.selectedPlaceId, { center: false });
			}

			return;
		}

		const plannerButton = event.target.closest("[data-planner-day-filter]");
		if (plannerButton) {
			appState.plannerDay = plannerButton.dataset.plannerDayFilter;
			saveValue(STORAGE_KEYS.plannerDay, appState.plannerDay);

			renderDayFilters();
			renderPlanner();
			return;
		}

		const timelineButton = event.target.closest("[data-timeline-day-filter]");
		if (timelineButton) {
			appState.timelineDay = timelineButton.dataset.timelineDayFilter;
			saveValue(STORAGE_KEYS.timelineDay, appState.timelineDay);

			renderDayFilters();
			renderTimeline();
		}
	});
}

function renderDayFilters() {
	renderDayButtonRow({
		selector: "[data-day-filters]",
		activeDay: appState.selectedDay,
		dataAttribute: "data-day-filter"
	});

	renderDayButtonRow({
		selector: "[data-planner-day-filters]",
		activeDay: appState.plannerDay,
		dataAttribute: "data-planner-day-filter"
	});

	renderDayButtonRow({
		selector: "[data-timeline-day-filters]",
		activeDay: appState.timelineDay,
		dataAttribute: "data-timeline-day-filter"
	});
}

function renderDayButtonRow({ selector, activeDay, dataAttribute }) {
	const wrap = document.querySelector(selector);
	if (!wrap) return;

	wrap.innerHTML = ROO_DAYS.map((day) => {
		const activeClass = day === activeDay ? "is-active" : "";
		const label = day === "All" ? "All" : day.slice(0, 3);
		const dayClass = getDayClass(day);

		return `
			<button class="day-filter ${dayClass} ${activeClass}" type="button" ${dataAttribute}="${day}">
				${label}
			</button>
		`;
	}).join("");
}

/* =========================================================
   MAP LAYOUT + GESTURES
========================================================= */

function layoutMapContentToImage() {
	const viewport = document.querySelector("[data-map-viewport]");
	const content = document.querySelector("[data-map-content]");
	const image = document.querySelector("[data-map-image]");

	if (!viewport || !content || !image) return;
	if (!image.naturalWidth || !image.naturalHeight) return;

	const viewportWidth = viewport.clientWidth;
	const viewportHeight = viewport.clientHeight;

	const naturalWidth = image.naturalWidth;
	const naturalHeight = image.naturalHeight;

	/*
		The map world now uses the actual PNG pixels instead of shrinking
		the image to phone-size first. That keeps zoom crisp and prevents
		the browser from stretching a tiny rendered copy of the map.

		For horizontal festival maps on a phone, reset view uses COVER scale:
		fill the viewport height first, then pan left/right. This avoids the
		big black letterbox problem from fit-to-width portrait layout.
	*/
	const coverScale = Math.max(
		viewportWidth / naturalWidth,
		viewportHeight / naturalHeight
	);

	const safeMaxRenderedPixels = 4096;
	const largestImageSide = Math.max(naturalWidth, naturalHeight);
	const safeImageScale = safeMaxRenderedPixels / largestImageSide;

	content.style.width = `${naturalWidth}px`;
	content.style.height = `${naturalHeight}px`;
	content.style.left = "0px";
	content.style.top = "0px";

	content.style.setProperty("--map-natural-width", naturalWidth);
	content.style.setProperty("--map-natural-height", naturalHeight);

	appState.map.fitScale = coverScale;
	appState.map.minScale = coverScale;
	appState.map.maxScale = Math.max(
		coverScale * 2.75,
		Math.min(3.25, safeImageScale)
	);

	appState.map.scale = clamp(
		Number(appState.map.scale) || coverScale,
		appState.map.minScale,
		appState.map.maxScale
	);
}

function bindMapGestures() {
	const viewport = document.querySelector("[data-map-viewport]");
	if (!viewport) return;

	viewport.addEventListener("mousedown", startMouseDrag);
	viewport.addEventListener("mousemove", moveMouseDrag);
	viewport.addEventListener("mouseup", endMapDrag);
	viewport.addEventListener("mouseleave", endMapDrag);

	viewport.addEventListener("touchstart", handleTouchStart, { passive: false });
	viewport.addEventListener("touchmove", handleTouchMove, { passive: false });
	viewport.addEventListener("touchend", handleTouchEnd, { passive: false });
	viewport.addEventListener("touchcancel", handleTouchEnd, { passive: false });

	viewport.addEventListener("wheel", handleWheelZoom, { passive: false });

	/*
		Disable double-tap / double-click zoom.
		Regular zoom still works through pinch, wheel, and the + / − buttons.
	*/
	viewport.addEventListener("dblclick", (event) => {
		event.preventDefault();
		event.stopPropagation();
	});

	viewport.addEventListener("click", (event) => {
		if (shouldIgnoreMapTap(event)) return;

		const isInteractive = event.target.closest("button, [data-place-shape], [data-saved-spot]");
		if (isInteractive) return;

		appState.map.lastMapPoint = clientPointToMapPercent(event.clientX, event.clientY);
	});
}

function bindMapControls() {
	document.addEventListener("click", (event) => {
		if (event.target.closest("[data-map-zoom-in]")) {
			zoomMapCentered(1.35);
		}

		if (event.target.closest("[data-map-zoom-out]")) {
			zoomMapCentered(1 / 1.35);
		}

		if (event.target.closest("[data-map-reset]")) {
			resetMapView();
		}

		if (event.target.closest("[data-enable-location]")) {
			enableLocation();
		}
	});
}

function bindMapUiToggle() {
	document.addEventListener("click", (event) => {
		const button = event.target.closest("[data-toggle-map-ui]");
		if (!button) return;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		const shouldHide = !appState.mapUiHidden;

		appState.mapUiHidden = shouldHide;
		document.body.classList.toggle("map-ui-hidden", shouldHide);

		button.textContent = shouldHide ? "Show UI" : "Hide UI";
		button.setAttribute("aria-pressed", shouldHide ? "true" : "false");

		if (shouldHide) {
			closeStageSheet();
			closeSpotsPanel();
			hideCompassPanelOnly();
		}

		requestAnimationFrame(() => {
			layoutMapContentToImage();
			clampMapTransform();
			applyMapTransform();
		});
	});
}

function startMouseDrag(event) {
	if (event.button !== 0) return;

	appState.map.isDragging = true;
	appState.map.touchMoved = false;
	appState.map.touchStartTarget = getMapTapTarget(event.target);

	appState.map.startClientX = event.clientX;
	appState.map.startClientY = event.clientY;
	appState.map.startX = appState.map.x;
	appState.map.startY = appState.map.y;

	document.body.classList.add("is-map-dragging");
}

function moveMouseDrag(event) {
	if (!appState.map.isDragging) return;

	const dx = event.clientX - appState.map.startClientX;
	const dy = event.clientY - appState.map.startClientY;

	appState.map.x = appState.map.startX + dx;
	appState.map.y = appState.map.startY + dy;

	queueMapMove();
}

function endMapDrag() {
	if (!appState.map.isDragging && !appState.pinch.active) return;

	const moved = appState.map.touchMoved;

	appState.map.isDragging = false;
	appState.pinch.active = false;

	if (moved) {
		markNextMapTapIgnored();
	}

	appState.map.touchMoved = false;
	appState.map.touchStartTarget = null;

	document.body.classList.remove("is-map-dragging");
	queueMapTransformSave();
}

function handleTouchStart(event) {
	const touches = Array.from(event.touches);

	clearLongPressTimer();

	if (touches.length === 1) {
		const touch = touches[0];

		event.preventDefault();

		appState.map.isDragging = true;
		appState.pinch.active = false;
		appState.map.touchMoved = false;
		appState.map.longPressFired = false;
		appState.map.touchStartTarget = getMapTapTarget(touch.target);

		appState.map.startClientX = touch.clientX;
		appState.map.startClientY = touch.clientY;
		appState.map.startX = appState.map.x;
		appState.map.startY = appState.map.y;

		document.body.classList.add("is-map-dragging");

		appState.map.longPressTimer = setTimeout(() => {
			if (!appState.map.isDragging || appState.map.touchMoved) return;

			/*
				Normal mode:
				- holding a blank map area saves a map pin
				- holding a tappable stage / marker does not steal the normal tap

				Hidden UI mode:
				- the whole point is using the map cleanly, so long-press should save
				  even if the finger started over an invisible stage hitbox.
			*/
			if (appState.map.touchStartTarget && !appState.mapUiHidden) return;

			const point = clientPointToMapPercent(touch.clientX, touch.clientY);
			if (!point) return;

			appState.map.longPressFired = true;
			appState.map.lastMapPoint = point;
			saveMapPointSpot(point);
		}, 700);
	}

	if (touches.length === 2) {
		event.preventDefault();
		clearLongPressTimer();

		appState.map.isDragging = false;
		appState.map.touchMoved = true;
		appState.map.longPressFired = false;
		appState.map.touchStartTarget = null;
		appState.pinch.active = true;
		appState.pinch.startDistance = getTouchDistance(touches[0], touches[1]);
		appState.pinch.startScale = appState.map.scale;
	}
}

function handleTouchMove(event) {
	const touches = Array.from(event.touches);

	if (touches.length === 1 && appState.map.isDragging) {
		event.preventDefault();

		const touch = touches[0];
		const dx = touch.clientX - appState.map.startClientX;
		const dy = touch.clientY - appState.map.startClientY;

		if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
			appState.map.touchMoved = true;
			clearLongPressTimer();
		}

		appState.map.x = appState.map.startX + dx;
		appState.map.y = appState.map.startY + dy;

		queueMapMove();
	}

	if (touches.length === 2 && appState.pinch.active) {
		event.preventDefault();
		clearLongPressTimer();

		const distance = getTouchDistance(touches[0], touches[1]);
		const center = getTouchCenter(touches[0], touches[1]);

		const nextScale = clamp(
			appState.pinch.startScale * (distance / appState.pinch.startDistance),
			appState.map.minScale,
			appState.map.maxScale
		);

		setScaleAtPoint(nextScale, center.x, center.y);
	}
}

function handleTouchEnd(event) {
	const wasDrag = appState.map.isDragging;
	const moved = appState.map.touchMoved;
	const longPressFired = appState.map.longPressFired;
	const tapTarget = appState.map.touchStartTarget;

	clearLongPressTimer();
	endMapDrag();

	if (longPressFired) {
		event.preventDefault();
		event.stopPropagation();

		appState.map.longPressFired = false;
		appState.map.touchStartTarget = null;
		markNextMapTapIgnored();
		return;
	}

	if (moved) {
		markNextMapTapIgnored();
		return;
	}

	if (wasDrag && tapTarget) {
		event.preventDefault();
		event.stopPropagation();
		handleMapTapTarget(tapTarget);
		return;
	}

	appState.map.touchStartTarget = null;
}

function queueMapMove() {
	clampMapTransform();

	if (appState.map.pendingTransformFrame !== null) return;

	appState.map.pendingTransformFrame = requestAnimationFrame(() => {
		appState.map.pendingTransformFrame = null;
		applyMapTransform();
	});
}

function queueMapTransformSave(delay = 80) {
	if (appState.map.saveTransformTimer) {
		clearTimeout(appState.map.saveTransformTimer);
	}

	appState.map.saveTransformTimer = setTimeout(() => {
		appState.map.saveTransformTimer = null;
		saveMapTransform();
	}, delay);
}

function getMapTapTarget(target) {
	if (!target || !target.closest) return null;

	return target.closest("[data-place-shape], [data-saved-spot], [data-amenity-id]");
}

function handleMapTapTarget(target) {
	if (!target) return false;

	const placeShape = target.closest("[data-place-shape]");
	if (placeShape) {
		openPlaceSheet(placeShape.getAttribute("data-place-shape"), { center: false });
		return true;
	}

	const amenityMarker = target.closest("[data-amenity-id]");
	if (amenityMarker) {
		openAmenitySheet(amenityMarker.dataset.amenityId, { center: false });
		return true;
	}

	const savedSpot = target.closest("[data-saved-spot]");
	if (savedSpot) {
		startFindingSpot(savedSpot.dataset.savedSpot);
		return true;
	}

	return false;
}

function markNextMapTapIgnored() {
	appState.map.ignoreNextMapTap = true;

	setTimeout(() => {
		appState.map.ignoreNextMapTap = false;
	}, 350);
}

function shouldIgnoreMapTap(event) {
	if (!appState.map.ignoreNextMapTap) return false;

	event.preventDefault();
	event.stopPropagation();

	appState.map.ignoreNextMapTap = false;
	return true;
}

function handleWheelZoom(event) {
	event.preventDefault();

	const factor = event.deltaY < 0 ? 1.18 : 1 / 1.18;
	zoomMapAt(event.clientX, event.clientY, appState.map.scale * factor);
}

function clearLongPressTimer() {
	if (appState.map.longPressTimer) {
		clearTimeout(appState.map.longPressTimer);
		appState.map.longPressTimer = null;
	}
}

function zoomMapCentered(factor) {
	const viewport = document.querySelector("[data-map-viewport]");
	if (!viewport) return;

	const rect = viewport.getBoundingClientRect();
	zoomMapAt(rect.left + rect.width / 2, rect.top + rect.height / 2, appState.map.scale * factor);
}

function zoomMapAt(clientX, clientY, nextScale) {
	nextScale = clamp(nextScale, appState.map.minScale, appState.map.maxScale);
	setScaleAtPoint(nextScale, clientX, clientY);
	saveMapTransform();
}

function setScaleAtPoint(nextScale, clientX, clientY) {
	const viewport = document.querySelector("[data-map-viewport]");
	const content = document.querySelector("[data-map-content]");
	if (!viewport || !content) return;

	nextScale = clamp(nextScale, appState.map.minScale, appState.map.maxScale);

	const viewportRect = viewport.getBoundingClientRect();

	const pointX = clientX - viewportRect.left;
	const pointY = clientY - viewportRect.top;

	const oldScale = appState.map.scale;

	const mapPointX = (pointX - appState.map.x) / oldScale;
	const mapPointY = (pointY - appState.map.y) / oldScale;

	appState.map.scale = nextScale;
	appState.map.x = pointX - mapPointX * nextScale;
	appState.map.y = pointY - mapPointY * nextScale;

	clampMapTransform();
	applyMapTransform();
}

function resetMapView(options = {}) {
	layoutMapContentToImage();

	const viewport = document.querySelector("[data-map-viewport]");
	const content = document.querySelector("[data-map-content]");
	if (!viewport || !content) return;

	const viewportWidth = viewport.clientWidth;
	const viewportHeight = viewport.clientHeight;

	const baseWidth = content.offsetWidth;
	const baseHeight = content.offsetHeight;

	appState.map.scale = appState.map.fitScale;
	appState.map.x = (viewportWidth - baseWidth * appState.map.scale) / 2;
	appState.map.y = (viewportHeight - baseHeight * appState.map.scale) / 2;

	clampMapTransform();
	applyMapTransform();

	if (options.save !== false) {
		saveMapTransform();
	}
}

function centerMapOnPercent(point) {
	if (!point) return;

	const viewport = document.querySelector("[data-map-viewport]");
	const content = document.querySelector("[data-map-content]");
	if (!viewport || !content) return;

	const viewportWidth = viewport.clientWidth;
	const viewportHeight = viewport.clientHeight;

	const baseWidth = content.offsetWidth;
	const baseHeight = content.offsetHeight;

	appState.map.x =
		viewportWidth / 2 -
		baseWidth * appState.map.scale * (point.x / 100);

	appState.map.y =
		viewportHeight / 2 -
		baseHeight * appState.map.scale * (point.y / 100);

	clampMapTransform();
	applyMapTransform();
	saveMapTransform();
}

function clampMapTransform() {
	const viewport = document.querySelector("[data-map-viewport]");
	const content = document.querySelector("[data-map-content]");
	if (!viewport || !content) return;

	const viewportWidth = viewport.clientWidth;
	const viewportHeight = viewport.clientHeight;

	const baseWidth = content.offsetWidth;
	const baseHeight = content.offsetHeight;

	const scaledWidth = baseWidth * appState.map.scale;
	const scaledHeight = baseHeight * appState.map.scale;

	const edgePadding = 0;

	if (scaledWidth <= viewportWidth) {
		appState.map.x = (viewportWidth - scaledWidth) / 2;
	} else {
		const minX = viewportWidth - scaledWidth - edgePadding;
		const maxX = edgePadding;
		appState.map.x = clamp(appState.map.x, minX, maxX);
	}

	if (scaledHeight <= viewportHeight) {
		appState.map.y = (viewportHeight - scaledHeight) / 2;
	} else {
		const minY = viewportHeight - scaledHeight - edgePadding;
		const maxY = edgePadding;
		appState.map.y = clamp(appState.map.y, minY, maxY);
	}
}

function applyMapTransform() {
	const content = document.querySelector("[data-map-content]");
	if (!content) return;

	content.style.transform = `translate(${appState.map.x}px, ${appState.map.y}px) scale(${appState.map.scale})`;
	content.style.setProperty("--map-scale", appState.map.scale);
	content.style.setProperty("--marker-scale", appState.map.fitScale / appState.map.scale);
}

function saveMapTransform() {
	appState.mapTransformsByMap[appState.activeMapId] = {
		scale: appState.map.scale,
		x: appState.map.x,
		y: appState.map.y
	};

	saveJSON(STORAGE_KEYS.mapTransformsByMap, appState.mapTransformsByMap);
}

function restoreMapTransform() {
	const saved = appState.mapTransformsByMap[appState.activeMapId];

	if (!saved) {
		resetMapView({ save: false });
		return;
	}

	appState.map.scale = clamp(Number(saved.scale) || 1, appState.map.minScale, appState.map.maxScale);
	appState.map.x = Number(saved.x) || 0;
	appState.map.y = Number(saved.y) || 0;

	requestAnimationFrame(() => {
		clampMapTransform();
		applyMapTransform();
	});
}

function clientPointToMapPercent(clientX, clientY) {
	const content = document.querySelector("[data-map-content]");
	if (!content) return null;

	const rect = content.getBoundingClientRect();

	const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
	const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);

	return { x, y };
}

function getTouchDistance(a, b) {
	const dx = a.clientX - b.clientX;
	const dy = a.clientY - b.clientY;
	return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(a, b) {
	return {
		x: (a.clientX + b.clientX) / 2,
		y: (a.clientY + b.clientY) / 2
	};
}

/* =========================================================
   PLACE LAYER
========================================================= */

function renderPlaceLayer() {
	const layer = document.querySelector("[data-stage-layer]");
	if (!layer) return;

	layer.innerHTML = "";

	getActivePlaces()
		.slice()
		.sort(sortPlacesForTaps)
		.forEach((place) => {
			const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
			group.setAttribute("data-place-shape", place.id);
			group.setAttribute("role", "button");
			group.setAttribute("tabindex", "0");
			group.classList.add("stage-shape-group", `stage-accent-${place.accent || "sunset"}`);

			const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.setAttribute("x", place.x);
			rect.setAttribute("y", place.y);
			rect.setAttribute("width", place.w);
			rect.setAttribute("height", place.h);
			rect.setAttribute("rx", "2.4");
			rect.classList.add("stage-shape");
			rect.setAttribute("vector-effect", "non-scaling-stroke");

			const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
			label.setAttribute("x", place.x + place.w / 2);
			label.setAttribute("y", place.y + place.h / 2);
			label.setAttribute("text-anchor", "middle");
			label.setAttribute("dominant-baseline", "middle");
			label.classList.add("stage-shape-label");
			label.textContent = place.shortName || place.name;

			group.appendChild(rect);
			group.appendChild(label);

			group.addEventListener("click", (event) => {
				if (shouldIgnoreMapTap(event)) return;

				event.stopPropagation();
				openPlaceSheet(place.id, { center: false });
			});

			group.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					openPlaceSheet(place.id, { center: false });
				}
			});

			layer.appendChild(group);
		});

	highlightSelectedPlace();
}

function getActivePlaces() {
	return ROO_DATA.places.filter((place) => place.mapId === appState.activeMapId);
}

function sortPlacesForTaps(a, b) {
	const areaA = Number(a.w || 0) * Number(a.h || 0);
	const areaB = Number(b.w || 0) * Number(b.h || 0);

	return areaB - areaA;
}

function getPlace(placeId) {
	return ROO_DATA.places.find((place) => place.id === placeId) || null;
}

function getPlaceCenter(placeId) {
	const place = getPlace(placeId);
	if (!place) return null;

	return {
		x: place.x + place.w / 2,
		y: place.y + place.h / 2
	};
}

function getPrimaryPlaceForVenue(venueId) {
	return (
		ROO_DATA.places.find((place) => place.mapId === "centeroo" && place.scheduleVenueId === venueId) ||
		ROO_DATA.places.find((place) => place.scheduleVenueId === venueId) ||
		null
	);
}

function getActivePlaceForVenue(venueId) {
	return (
		ROO_DATA.places.find((place) => place.mapId === appState.activeMapId && place.scheduleVenueId === venueId) ||
		getPrimaryPlaceForVenue(venueId)
	);
}

function openPlaceSheet(placeId, options = {}) {
	const shouldCenter = options.center === true;
	const place = getPlace(placeId);
	if (!place) return;

	if (place.mapId !== appState.activeMapId) {
		setActiveMap(place.mapId, { skipToast: true });
	}

	appState.selectedPlaceId = placeId;

	const sheet = document.querySelector("[data-bottom-sheet]");
	const title = document.querySelector("[data-sheet-title]");
	const subtitle = document.querySelector("[data-sheet-subtitle]");
	const eyebrow = document.querySelector("[data-sheet-eyebrow]");
	const body = document.querySelector("[data-sheet-body]");
	const sheetCard = sheet ? sheet.querySelector(".bottom-sheet-card") : null;
	const shouldPreserveScroll = options.preserveScroll === true;
	const previousScrollTop = sheetCard ? sheetCard.scrollTop : 0;

	if (!sheet || !title || !body) return;

	const events = getPlaceEventsForSelectedDay(place);

	title.textContent = place.name;
	if (eyebrow) eyebrow.textContent = capitalize(place.type || "Place");
	if (subtitle) {
		const map = getMap(place.mapId);
		const eventLabel = place.scheduleVenueId ?
			`${events.length} event${events.length === 1 ? "" : "s"} · ${appState.selectedDay}` :
			map.name;

		subtitle.textContent = eventLabel;
	}

	body.innerHTML = "";

	const desc = document.createElement("p");
	desc.className = "sheet-description";
	desc.textContent = place.description || `${place.name} on the ${getMap(place.mapId).name} map.`;
	body.appendChild(desc);

	if (place.scheduleVenueId) {
		body.appendChild(createNowNextCard(place, events));
	}

	const placeActions = document.createElement("div");
	placeActions.className = "sheet-action-row sheet-action-row--three";
	placeActions.innerHTML = `
	<button class="secondary-button" type="button" data-center-place="${place.id}">Center</button>
	<button class="secondary-button" type="button" data-save-place-spot="${place.id}">Save Spot</button>
	<button class="secondary-button" type="button" data-save-place-anchor="${place.id}">Anchor</button>
`;
	body.appendChild(placeActions);

	const list = document.createElement("div");
	list.className = "event-list";

	if (!place.scheduleVenueId) {
		list.innerHTML = `
			<div class="empty-state">
				<strong>${escapeHTML(place.name)}</strong>
				<span>This is a map location. Save it as a spot or use it as a landmark.</span>
			</div>
		`;
	} else if (events.length === 0) {
		list.innerHTML = `
			<div class="empty-state">
				<strong>No events for this day.</strong>
				<span>Switch the day filter or choose All.</span>
			</div>
		`;
	} else {
		events
			.slice()
			.sort(sortEventsByDayAndTime)
			.forEach((event) => {
				list.appendChild(createEventCard(event));
			});
	}

	body.appendChild(list);

	sheet.classList.add("is-open");
	sheet.setAttribute("aria-hidden", "false");

	requestAnimationFrame(() => {
		if (!sheetCard) return;
		sheetCard.scrollTop = shouldPreserveScroll ? previousScrollTop : 0;
	});

	closeSpotsPanel();
	hideCompassPanelOnly();
	highlightSelectedPlace();

	if (shouldCenter) {
		centerMapOnPercent(getPlaceCenter(place.id));
	}
}

function getPlaceEventsForSelectedDay(place) {
	if (!place.scheduleVenueId) return [];

	const events = ROO_DATA.events.filter((event) => event.venueId === place.scheduleVenueId);

	if (appState.selectedDay === "All") return events;

	return events.filter((event) => event.day === appState.selectedDay);
}

function highlightSelectedPlace() {
	document.querySelectorAll("[data-place-shape]").forEach((shape) => {
		shape.classList.toggle("is-selected", shape.getAttribute("data-place-shape") === appState.selectedPlaceId);
	});
}

function bindSheetControls() {
	document.addEventListener("click", (event) => {
		if (event.target.closest("[data-close-sheet]")) {
			closeStageSheet();
		}

		if (event.target.matches("[data-bottom-sheet]")) {
			closeStageSheet();
		}

		const centerPlaceButton = event.target.closest("[data-center-place]");
		if (centerPlaceButton) {
			centerMapOnPercent(getPlaceCenter(centerPlaceButton.dataset.centerPlace));
		}

		const savePlaceButton = event.target.closest("[data-save-place-spot]");
		if (savePlaceButton) {
			savePlaceAsSpot(savePlaceButton.dataset.savePlaceSpot);
		}

		const savePlaceAnchorButton = event.target.closest("[data-save-place-anchor]");
		if (savePlaceAnchorButton) {
			const place = getPlace(savePlaceAnchorButton.dataset.savePlaceAnchor);
			saveMapPointAsCalibrationAnchor(
				getPlaceCenter(savePlaceAnchorButton.dataset.savePlaceAnchor),
				place ? place.name : "Map anchor"
			);
		}

		const centerAmenityButton = event.target.closest("[data-center-amenity]");
		if (centerAmenityButton) {
			const amenity = getAmenity(centerAmenityButton.dataset.centerAmenity);
			if (amenity) {
				centerMapOnPercent({ x: amenity.x, y: amenity.y });
			}
		}

		const saveAmenityButton = event.target.closest("[data-save-amenity-spot]");
		if (saveAmenityButton) {
			saveAmenityAsSpot(saveAmenityButton.dataset.saveAmenitySpot);
		}

		const saveAmenityAnchorButton = event.target.closest("[data-save-amenity-anchor]");
		if (saveAmenityAnchorButton) {
			const amenity = getAmenity(saveAmenityAnchorButton.dataset.saveAmenityAnchor);
			if (amenity) {
				saveMapPointAsCalibrationAnchor({ x: amenity.x, y: amenity.y },
					amenity.name
				);
			}
		}

		const pickButton = event.target.closest("[data-pick-event]");
		if (pickButton) {
			togglePick(pickButton.dataset.pickEvent, pickButton.dataset.pickType);
		}
	});
}

function closeStageSheet() {
	const sheet = document.querySelector("[data-bottom-sheet]");
	if (!sheet) return;

	sheet.classList.remove("is-open");
	sheet.setAttribute("aria-hidden", "true");

	appState.selectedPlaceId = null;
	highlightSelectedPlace();
}

/* =========================================================
   EVENT CARDS / PICKS
========================================================= */

function createNowNextCard(place, events) {
	const card = document.createElement("div");
	card.className = "mini-card mini-card--now-next";

	const sorted = events.slice().sort(sortEventsByDayAndTime);
	const now = findNowPlaying(sorted);
	const next = findNextEvent(sorted);

	let html = "";

	if (now) {
		html += `
			<div>
				<span>Now</span>
				<strong>${escapeHTML(now.artist)}</strong>
				<small>${formatTime(now.start)} – ${formatTime(now.end)}</small>
			</div>
		`;
	}

	if (next) {
		html += `
			<div>
				<span>Up Next</span>
				<strong>${escapeHTML(next.artist)}</strong>
				<small>${formatTime(next.start)} – ${formatTime(next.end)}</small>
			</div>
		`;
	}

	if (!html) {
		html = `
			<div>
				<span>Schedule</span>
				<strong>${escapeHTML(place.name)}</strong>
				<small>Pick artists below to build your Roo plan.</small>
			</div>
		`;
	}

	card.innerHTML = html;
	return card;
}

function createEventCard(event) {
	const place = getPrimaryPlaceForVenue(event.venueId);
	const pick = appState.picks[event.id] || "none";
	const conflict = getConflictText(event);

	const dayClass = getDayClass(event.day);

	const card = document.createElement("article");
	card.className = `event-card day-card ${dayClass} pick-${pick}`;

	card.innerHTML = `
		<div class="event-card-top">
			<div>
				<p class="event-meta">${escapeHTML(event.day)} · ${formatTime(event.start)} – ${formatTime(event.end)}</p>
				<h3>${escapeHTML(event.artist)}</h3>
				<p class="soft-text">${escapeHTML(place ? place.name : event.venueId)}</p>
			</div>
		</div>

		<div class="pick-row">
			<button class="pick-button ${pick === "must" ? "is-active" : ""}" type="button" data-pick-event="${event.id}" data-pick-type="must">
				Must
			</button>

			<button class="pick-button ${pick === "maybe" ? "is-active" : ""}" type="button" data-pick-event="${event.id}" data-pick-type="maybe">
				Maybe
			</button>

			<button class="pick-button ${pick === "skip" ? "is-active" : ""}" type="button" data-pick-event="${event.id}" data-pick-type="skip">
				Skip
			</button>
		</div>

		${conflict ? `<div class="conflict-note">${escapeHTML(conflict)}</div>` : ""}
	`;

	return card;
}

function togglePick(eventId, pickType) {
	if (appState.picks[eventId] === pickType) {
		delete appState.picks[eventId];
	} else {
		appState.picks[eventId] = pickType;
	}

	saveJSON(STORAGE_KEYS.picks, appState.picks);
	savePicksBackup("vote");

	if (appState.selectedPlaceId) {
		openPlaceSheet(appState.selectedPlaceId, { center: false, preserveScroll: true });
	}

	renderPlanner();
	renderTimeline();
	renderSearchResults();
	renderSettings();
}

/* =========================================================
   PLANNER / EVENTS / CONFLICTS
========================================================= */

function getAllEvents() {
	return ROO_DATA.events.map((event) => {
		const place = getPrimaryPlaceForVenue(event.venueId);

		return {
			...event,
			placeName: place ? place.name : event.venueId,
			mapId: place ? place.mapId : "centeroo"
		};
	});
}

function getPickedEvents(includeSkipped = false) {
	return getAllEvents()
		.filter((event) => {
			const pick = appState.picks[event.id];
			if (!pick) return false;
			if (!includeSkipped && pick === "skip") return false;
			return true;
		})
		.map((event) => ({
			...event,
			pickType: appState.picks[event.id]
		}))
		.sort(sortEventsByDayAndTime);
}

function filterEventsByDay(events, day) {
	if (!day || day === "All") return events;
	return events.filter((event) => event.day === day);
}

function getPickLabel(pickType) {
	if (pickType === "must") return "Must";
	if (pickType === "maybe") return "Maybe";
	if (pickType === "skip") return "Skip";
	return "Pick";
}

function getPreviousSameDayEvent(events, index) {
	const current = events[index];
	if (!current) return null;

	for (let i = index - 1; i >= 0; i -= 1) {
		if (events[i].day === current.day) return events[i];
	}

	return null;
}

function getGapWindow(previous, current) {
	if (!previous || !current || previous.day !== current.day) return null;

	const gapStart = normalizeEndMinutes(previous.start, previous.end);
	const gapEnd = timeToMinutes(current.start);
	const freeMinutes = gapEnd - gapStart;

	if (freeMinutes < 25) return null;

	return {
		day: current.day,
		start: gapStart,
		end: gapEnd,
		freeMinutes
	};
}

function getGapNote(previous, current) {
	const gap = getGapWindow(previous, current);
	if (!gap) return "";

	return `Open gap · ${gap.freeMinutes} min before ${current.artist}`;
}

function renderPlanner() {
	const list = document.querySelector("[data-planner-list]");
	const summary = document.querySelector("[data-planner-summary]");
	if (!list) return;

	const picked = filterEventsByDay(getPickedEvents(true), appState.plannerDay);
	const visiblePicked = picked.filter((event) => event.pickType !== "skip");
	const mustCount = picked.filter((event) => event.pickType === "must").length;
	const maybeCount = picked.filter((event) => event.pickType === "maybe").length;
	const skipCount = picked.filter((event) => event.pickType === "skip").length;
	const conflictCount = visiblePicked.filter((event) => getConflictText(event)).length;

	if (summary) {
		summary.innerHTML = `
			<div class="summary-pill summary-pill--must"><span>Must</span><strong>${mustCount}</strong></div>
			<div class="summary-pill summary-pill--maybe"><span>Maybe</span><strong>${maybeCount}</strong></div>
			<div class="summary-pill summary-pill--skip"><span>Skip</span><strong>${skipCount}</strong></div>
			<div class="summary-pill summary-pill--conflict"><span>Conflicts</span><strong>${conflictCount}</strong></div>
		`;
	}

	if (picked.length === 0) {
		list.innerHTML = `
			<div class="empty-state planner-empty-state">
				<strong>♪ No picks for ${escapeHTML(appState.plannerDay)} yet.</strong>
				<span>Use Search or tap a stage on the Map to mark acts as Must, Maybe, or Skip.</span>
			</div>
		`;
		return;
	}

	list.innerHTML = "";

	const groups = [
		{ type: "must", title: "Must See" },
		{ type: "maybe", title: "Maybe" },
		{ type: "skip", title: "Skipped" }
	];

	groups.forEach((group) => {
		const groupEvents = picked
			.filter((event) => event.pickType === group.type)
			.sort(sortEventsByDayAndTime);

		if (groupEvents.length === 0) return;

		const header = document.createElement("div");
		header.className = "planner-group-header";
		header.textContent = `${group.title} · ${groupEvents.length}`;
		list.appendChild(header);

		groupEvents.forEach((event) => {
			const conflict = group.type === "skip" ? "" : getConflictText(event);
			const dayClass = getDayClass(event.day);

			const card = document.createElement("article");
			card.className = `planner-card day-card ${dayClass} planner-card--${event.pickType}`;

			card.innerHTML = `
				<div>
					<p class="event-meta">${escapeHTML(event.day)} · ${escapeHTML(formatTime(event.start))} – ${escapeHTML(formatTime(event.end))}</p>
					<h3>${escapeHTML(event.artist)}</h3>
					<p class="soft-text">${escapeHTML(event.placeName)}</p>
					${conflict ? `<div class="conflict-note">${escapeHTML(conflict)}</div>` : ""}

					<div class="pick-row planner-pick-row">
						<button class="pick-button ${event.pickType === "must" ? "is-active" : ""}" type="button" data-pick-event="${event.id}" data-pick-type="must">
							Must
						</button>

						<button class="pick-button ${event.pickType === "maybe" ? "is-active" : ""}" type="button" data-pick-event="${event.id}" data-pick-type="maybe">
							Maybe
						</button>

						<button class="pick-button ${event.pickType === "skip" ? "is-active" : ""}" type="button" data-pick-event="${event.id}" data-pick-type="skip">
							Skip
						</button>
					</div>
				</div>

				<div class="planner-badge">${getPickLabel(event.pickType)}</div>
			`;

			list.appendChild(card);
		});
	});
}

function eventsOverlap(a, b) {
	if (a.day !== b.day) return false;

	const aStart = timeToMinutes(a.start);
	const aEnd = normalizeEndMinutes(a.start, a.end);
	const bStart = timeToMinutes(b.start);
	const bEnd = normalizeEndMinutes(b.start, b.end);

	return aStart < bEnd && bStart < aEnd;
}

function getConflictText(event) {
	const picked = getPickedEvents();

	const conflicts = picked.filter((other) => {
		if (other.id === event.id) return false;
		return eventsOverlap(event, other);
	});

	if (conflicts.length === 0) return "";

	const names = conflicts.map((item) => item.artist).join(", ");
	return `Conflict with ${names}`;
}

function getWalkNote(previous, current) {
	if (previous.day !== current.day) return "";

	const walk = getWalkTime(previous.venueId, current.venueId);
	if (!walk) return "";

	const currentStart = timeToMinutes(current.start);
	const leave = currentStart - walk;

	return `Leave ${previous.placeName} around ${minutesToTime(leave)} to reach ${current.placeName}. Estimated walk: ${walk} min.`;
}

function getWalkTime(fromVenueId, toVenueId) {
	if (!fromVenueId || !toVenueId || fromVenueId === toVenueId) return 0;
	return ROO_DATA.walkTimes[`${fromVenueId}|${toVenueId}`] || null;
}

/* =========================================================
   SEARCH
========================================================= */

function bindSearchControls() {
	document.addEventListener("input", (event) => {
		if (event.target.matches("[data-search-input], [data-search-day]")) {
			renderSearchResults();
		}
	});

	document.addEventListener("change", (event) => {
		if (event.target.matches("[data-search-day]")) {
			renderSearchResults();
		}
	});
}

function renderSearchResults() {
	const input = document.querySelector("[data-search-input]");
	const daySelect = document.querySelector("[data-search-day]");
	const results = document.querySelector("[data-search-results]");

	if (!input || !daySelect || !results) return;

	const query = input.value.trim().toLowerCase();
	const day = daySelect.value || "All";

	const eventResults = getAllEvents()
		.filter((event) => {
			const matchesDay = day === "All" || event.day === day;
			const matchesQuery = !query ||
				event.artist.toLowerCase().includes(query) ||
				event.placeName.toLowerCase().includes(query) ||
				event.day.toLowerCase().includes(query);

			return matchesDay && matchesQuery;
		})
		.map((event) => {
			const activePlace = getActivePlaceForVenue(event.venueId);
			const primaryPlace = getPrimaryPlaceForVenue(event.venueId);

			return {
				type: "event",
				id: event.id,
				title: event.artist,
				subtitle: `${event.day} · ${formatTime(event.start)} · ${event.placeName}`,
				day: event.day,
				placeId: activePlace ? activePlace.id : primaryPlace?.id || null,
				mapId: activePlace ? activePlace.mapId : primaryPlace?.mapId || "centeroo"
			};
		});

	const placeResults = ROO_DATA.places
		.filter((place) => {
			return !query ||
				place.name.toLowerCase().includes(query) ||
				(place.type || "").toLowerCase().includes(query);
		})
		.map((place) => ({
			type: "place",
			id: place.id,
			title: place.name,
			subtitle: `${getMap(place.mapId).name} · ${capitalize(place.type || "Place")}`,
			placeId: place.id,
			mapId: place.mapId
		}));

	const amenityResults = ROO_DATA.amenities
		.filter((item) => {
			return !query ||
				item.name.toLowerCase().includes(query) ||
				item.type.toLowerCase().includes(query);
		})
		.map((item) => ({
			type: "amenity",
			id: item.id,
			title: `${item.icon} ${item.name}`,
			subtitle: `${getMap(item.mapId).name} · Amenity`,
			point: { x: item.x, y: item.y },
			mapId: item.mapId
		}));

	const spotResults = appState.savedSpots
		.filter((spot) => {
			return !query ||
				spot.name.toLowerCase().includes(query) ||
				(spot.type || "").toLowerCase().includes(query) ||
				(spot.note || "").toLowerCase().includes(query);
		})
		.map((spot) => ({
			type: "spot",
			id: spot.id,
			title: `📍 ${spot.name}`,
			subtitle: `${getMap(spot.mapId || "centeroo").name} · ${spot.type || "Saved spot"}`,
			spotId: spot.id,
			mapId: spot.mapId || "centeroo"
		}));

	const combined = [
		...eventResults,
		...placeResults,
		...amenityResults,
		...spotResults
	].slice(0, 70);

	if (combined.length === 0) {
		results.innerHTML = `
			<div class="empty-state">
				<strong>No results.</strong>
				<span>Try an artist, stage, plaza, toll, amenity, or saved spot.</span>
			</div>
		`;
		return;
	}

	results.innerHTML = "";

	combined.forEach((item) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `search-result ${item.type === "event" ? `day-card ${getDayClass(item.day)}` : ""}`;
		button.innerHTML = `
			<strong>${escapeHTML(item.title)}</strong>
			<span>${escapeHTML(item.subtitle)}</span>
		`;

		button.addEventListener("click", () => {
			setActiveScreen("map");

			if (item.mapId && item.mapId !== appState.activeMapId) {
				setActiveMap(item.mapId, { skipToast: true });
			}

			if (item.type === "event" || item.type === "place") {
				openPlaceSheet(item.placeId);
			}

			if (item.type === "amenity") {
				openAmenitySheet(item.id);
			}

			if (item.type === "spot") {
				const spot = getSavedSpot(item.spotId);

				if (spot && spot.mapId && spot.mapId !== appState.activeMapId) {
					setActiveMap(spot.mapId, { skipToast: true });
				}

				if (spot && spot.mapPoint) {
					centerMapOnPercent(spot.mapPoint);
				}

				startFindingSpot(item.spotId);
			}
		});

		results.appendChild(button);
	});
}

/* =========================================================
   TIMELINE
========================================================= */

function renderTimeline() {
	const list = document.querySelector("[data-timeline-list]");
	const summary = document.querySelector("[data-timeline-summary]");
	if (!list) return;

	const picked = filterEventsByDay(getPickedEvents(false), appState.timelineDay)
		.sort(sortEventsByDayAndTime);

	const mustCount = picked.filter((event) => event.pickType === "must").length;
	const maybeCount = picked.filter((event) => event.pickType === "maybe").length;
	const dayCount = new Set(picked.map((event) => event.day)).size;

	if (summary) {
		const first = picked[0];
		const last = picked[picked.length - 1];

		summary.innerHTML = `
			<div class="summary-pill summary-pill--must"><span>Must</span><strong>${mustCount}</strong></div>
			<div class="summary-pill summary-pill--maybe"><span>Maybe</span><strong>${maybeCount}</strong></div>
			<div class="summary-pill"><span>Days</span><strong>${dayCount || 0}</strong></div>
			<div class="summary-pill"><span>Window</span><strong>${first && last ? `${formatTime(first.start)}–${formatTime(last.end)}` : "—"}</strong></div>
		`;
	}

	if (picked.length === 0) {
		list.innerHTML = `
			<div class="empty-state">
				<strong>No timeline for ${escapeHTML(appState.timelineDay)} yet.</strong>
				<span>Mark acts as Must or Maybe to build your chronological Roo flow. Skipped acts stay in Planner, not Timeline.</span>
			</div>
		`;
		return;
	}

	list.innerHTML = "";

	let lastDay = "";

	picked.forEach((event, index) => {
		if (event.day !== lastDay) {
			lastDay = event.day;

			const dayHeader = document.createElement("div");
			dayHeader.className = `timeline-day-header ${getDayClass(event.day)}`;
			dayHeader.textContent = event.day;
			list.appendChild(dayHeader);
		}

		const previous = getPreviousSameDayEvent(picked, index);
		const gapNote = previous ? getGapNote(previous, event) : "";
		const gapWindow = previous ? getGapWindow(previous, event) : null;
		const dayClass = getDayClass(event.day);

		if (gapNote && gapWindow) {
			const gapButton = document.createElement("button");
			gapButton.type = "button";
			gapButton.className = `timeline-gap timeline-gap--between ${dayClass}`;
			gapButton.innerHTML = `
				<span>${escapeHTML(gapNote)}</span>
				<small>Tap to fill</small>
			`;

			gapButton.addEventListener("click", () => {
				openTimelineGapSheet({
					day: event.day,
					gapStart: gapWindow.start,
					gapEnd: gapWindow.end,
					freeMinutes: gapWindow.freeMinutes,
					previousArtist: previous.artist,
					nextArtist: event.artist
				});
			});

			list.appendChild(gapButton);
		}

		const item = document.createElement("article");
		item.className = `timeline-item day-card ${dayClass}`;

		item.innerHTML = `
			<div class="timeline-time">
				<strong>${formatTime(event.start)}</strong>
				<span>${formatTime(event.end)}</span>
			</div>

			<div class="timeline-content">
				<h3>${escapeHTML(event.artist)}</h3>
				<p>${escapeHTML(event.placeName)} · ${getPickLabel(event.pickType)}</p>
			</div>
		`;

		list.appendChild(item);
	});
}

function getEventsForTimelineGap(day, gapStart, gapEnd) {
	return getAllEvents()
		.filter((event) => {
			if (event.day !== day) return false;
			if (appState.picks[event.id]) return false;

			const eventStart = timeToMinutes(event.start);
			const eventEnd = normalizeEndMinutes(event.start, event.end);

			return eventStart >= gapStart && eventEnd <= gapEnd;
		})
		.sort(sortEventsByDayAndTime);
}

function openTimelineGapSheet({ day, gapStart, gapEnd, freeMinutes, previousArtist, nextArtist }) {
	const sheet = document.querySelector("[data-bottom-sheet]");
	const title = document.querySelector("[data-sheet-title]");
	const subtitle = document.querySelector("[data-sheet-subtitle]");
	const eyebrow = document.querySelector("[data-sheet-eyebrow]");
	const body = document.querySelector("[data-sheet-body]");
	const sheetCard = sheet ? sheet.querySelector(".bottom-sheet-card") : null;

	if (!sheet || !title || !body) return;

	appState.selectedPlaceId = null;
	highlightSelectedPlace();

	if (eyebrow) eyebrow.textContent = "Timeline Gap";
	title.textContent = "Fill Open Gap";

	if (subtitle) {
		subtitle.textContent = `${day} · ${minutesToTime(gapStart)} – ${minutesToTime(gapEnd)}`;
	}

	body.innerHTML = "";

	const desc = document.createElement("p");
	desc.className = "sheet-description";
	desc.textContent = `${freeMinutes} open minutes between ${previousArtist} and ${nextArtist}.`;
	body.appendChild(desc);

	const candidates = getEventsForTimelineGap(day, gapStart, gapEnd);

	if (candidates.length === 0) {
		const empty = document.createElement("div");
		empty.className = "empty-state";
		empty.innerHTML = `
			<strong>No events at that time.</strong>
			<span>Nothing in the schedule fits completely inside this open gap.</span>
		`;
		body.appendChild(empty);
	} else {
		const list = document.createElement("div");
		list.className = "event-list";

		candidates.forEach((event) => {
			list.appendChild(createEventCard(event));
		});

		body.appendChild(list);
	}

	sheet.classList.add("is-open");
	sheet.setAttribute("aria-hidden", "false");

	if (sheetCard) {
		requestAnimationFrame(() => {
			sheetCard.scrollTop = 0;
		});
	}

	closeSpotsPanel();
	hideCompassPanelOnly();
}
/* =========================================================
   AMENITIES
========================================================= */

function renderAmenityLayer() {
	const layer = document.querySelector("[data-amenity-layer]");
	if (!layer) return;

	layer.innerHTML = "";

	ROO_DATA.amenities
		.filter((item) => item.mapId === appState.activeMapId)
		.forEach((item) => {
			if (appState.amenityFilters[item.type] === false) return;

			const button = document.createElement("button");
			button.type = "button";
			button.className = `amenity-marker amenity-${item.type}`;
			button.style.left = `${item.x}%`;
			button.style.top = `${item.y}%`;
			button.setAttribute("aria-label", item.name);
			button.dataset.amenityId = item.id;
			button.innerHTML = `
				<span>${item.icon}</span>
				${appState.settings.showAmenityLabels ? `<small>${escapeHTML(item.name)}</small>` : ""}
			`;

			button.addEventListener("click", (event) => {
				if (shouldIgnoreMapTap(event)) return;

				event.stopPropagation();
				openAmenitySheet(item.id, { center: false });
			});

			layer.appendChild(button);
		});
}

function getAmenity(amenityId) {
	return ROO_DATA.amenities.find((item) => item.id === amenityId) || null;
}

function openAmenitySheet(amenityId, options = {}) {
	const shouldCenter = options.center === true;
	const amenity = getAmenity(amenityId);
	if (!amenity) return;

	if (amenity.mapId !== appState.activeMapId) {
		setActiveMap(amenity.mapId, { skipToast: true });
	}

	const sheet = document.querySelector("[data-bottom-sheet]");
	const title = document.querySelector("[data-sheet-title]");
	const subtitle = document.querySelector("[data-sheet-subtitle]");
	const eyebrow = document.querySelector("[data-sheet-eyebrow]");
	const body = document.querySelector("[data-sheet-body]");

	if (!sheet || !title || !body) return;

	title.textContent = amenity.name;

	if (eyebrow) {
		eyebrow.textContent = capitalize(amenity.type || "Amenity");
	}

	if (subtitle) {
		subtitle.textContent = `${getMap(amenity.mapId).name} · Amenity`;
	}

	body.innerHTML = "";

	const desc = document.createElement("p");
	desc.className = "sheet-description";
	desc.textContent = `${amenity.icon || "•"} ${amenity.name} on the ${getMap(amenity.mapId).name} map.`;
	body.appendChild(desc);

	const amenityActions = document.createElement("div");
	amenityActions.className = "sheet-action-row sheet-action-row--three";
	amenityActions.innerHTML = `
		<button class="secondary-button" type="button" data-center-amenity="${amenity.id}">Center</button>
		<button class="secondary-button" type="button" data-save-amenity-spot="${amenity.id}">Save Spot</button>
		<button class="secondary-button" type="button" data-save-amenity-anchor="${amenity.id}">Anchor</button>
	`;
	body.appendChild(amenityActions);

	const note = document.createElement("div");
	note.className = "empty-state";
	note.innerHTML = `
		<strong>${escapeHTML(amenity.name)}</strong>
		<span>Save this as a personal spot, or save it as a GPS anchor only if you are physically standing here.</span>
	`;
	body.appendChild(note);

	sheet.classList.add("is-open");
	sheet.setAttribute("aria-hidden", "false");

	closeSpotsPanel();
	hideCompassPanelOnly();

	if (shouldCenter) {
		centerMapOnPercent({ x: amenity.x, y: amenity.y });
	}
}

function saveAmenityAsSpot(amenityId) {
	const amenity = getAmenity(amenityId);
	if (!amenity) return;

	const spot = {
		id: createId("spot"),
		mapId: amenity.mapId,
		name: amenity.name,
		type: amenity.type || "amenity",
		note: "Saved amenity",
		mapPoint: {
			x: amenity.x,
			y: amenity.y
		},
		gps: null,
		createdAt: new Date().toISOString()
	};

	appState.savedSpots.push(spot);
	saveJSON(STORAGE_KEYS.savedSpots, appState.savedSpots);

	renderSavedSpots();
	renderSearchResults();
	renderSettings();

	showToast(`${amenity.name} saved`);
}

function saveMapPointAsCalibrationAnchor(point, defaultName = "Map anchor") {
	if (!point) return;

	if (!appState.location.position) {
		enableLocation();
		showToast("Turn on GPS first. Stand at this exact spot, then tap Anchor again.");
		return;
	}

	const activeMap = getActiveMap();
	const name = prompt("Anchor name:", defaultName);
	if (!name) return;

	const coords = appState.location.position.coords;

	const anchor = {
		id: createId("anchor"),
		name: name.trim(),
		lat: coords.latitude,
		lng: coords.longitude,
		mapX: point.x,
		mapY: point.y,
		accuracy: coords.accuracy || null,
		createdAt: new Date().toISOString()
	};

	if (!appState.calibrationByMap[activeMap.id]) {
		appState.calibrationByMap[activeMap.id] = { anchors: [] };
	}

	appState.calibrationByMap[activeMap.id].anchors.push(anchor);
	saveJSON(STORAGE_KEYS.calibrationByMap, appState.calibrationByMap);

	appState.location.mapPoint = getCurrentGPSMapPoint();

	renderGPSLayer();
	renderSettings();
	updateLocationStatus();

	showToast(`${anchor.name} saved as GPS anchor`);
}

/* =========================================================
   SAVED SPOTS
========================================================= */

function bindSpotControls() {
	document.addEventListener("click", (event) => {
		if (event.target.closest("[data-save-current-spot]")) {
			saveCurrentLocationSpot();
		}

		if (event.target.closest("[data-open-spots]")) {
			openSpotsPanel();
		}

		if (event.target.closest("[data-close-spots]")) {
			closeSpotsPanel();
		}

		const findButton = event.target.closest("[data-find-spot]");
		if (findButton) {
			startFindingSpot(findButton.dataset.findSpot);
		}

		const centerButton = event.target.closest("[data-center-spot]");
		if (centerButton) {
			const spot = getSavedSpot(centerButton.dataset.centerSpot);

			if (spot && spot.mapId && spot.mapId !== appState.activeMapId) {
				setActiveMap(spot.mapId, { skipToast: true });
			}

			if (spot && spot.mapPoint) {
				setActiveScreen("map");
				centerMapOnPercent(spot.mapPoint);
				openSpotsPanel();
			} else {
				showToast("This spot has GPS only. Map pin needs calibration.");
			}
		}

		const deleteButton = event.target.closest("[data-delete-spot]");
		if (deleteButton) {
			deleteSavedSpot(deleteButton.dataset.deleteSpot);
		}
	});
}

function openSpotsPanel() {
	const panel = document.querySelector("[data-spots-panel]");
	if (!panel) return;

	closeStageSheet();
	hideCompassPanelOnly();

	panel.classList.add("is-open");
	panel.setAttribute("aria-hidden", "false");
}

function closeSpotsPanel() {
	const panel = document.querySelector("[data-spots-panel]");
	if (!panel) return;

	panel.classList.remove("is-open");
	panel.setAttribute("aria-hidden", "true");
}

function saveCurrentLocationSpot() {
	if (!appState.location.position) {
		enableLocation();
		showToast("Turning on GPS. Tap Save Spot again after your location appears.");
		return;
	}

	const name = prompt("Name this spot:", appState.activeMapId === "outeroo" ? "Camp" : "Meetup");
	if (!name) return;

	const type = prompt("Type of spot:", appState.activeMapId === "outeroo" ? "campsite" : "saved") || "saved";

	const coords = appState.location.position.coords;
	let mapPoint = appState.location.mapPoint;

	if (!mapPoint && appState.map.lastMapPoint) {
		mapPoint = appState.map.lastMapPoint;
	}

	const spot = {
		id: createId("spot"),
		mapId: appState.activeMapId,
		name: name.trim(),
		type: type.trim(),
		note: "",
		mapPoint,
		gps: {
			lat: coords.latitude,
			lng: coords.longitude,
			accuracy: coords.accuracy || null
		},
		createdAt: new Date().toISOString()
	};

	appState.savedSpots.push(spot);
	saveJSON(STORAGE_KEYS.savedSpots, appState.savedSpots);

	renderSavedSpots();
	renderSearchResults();
	renderSettings();

	if (mapPoint) {
		centerMapOnPercent(mapPoint);
		showToast(`${spot.name} saved on ${getActiveMap().name}`);
	} else {
		showToast(`${spot.name} saved with GPS. Map pin needs calibration.`);
	}
}

function saveMapPointSpot(point) {
	if (!point) return;

	const name = prompt(`Save this ${getActiveMap().name} spot as:`, "Meetup");
	if (!name) return;

	const spot = {
		id: createId("spot"),
		mapId: appState.activeMapId,
		name: name.trim(),
		type: "map pin",
		note: "",
		mapPoint: point,
		gps: null,
		createdAt: new Date().toISOString()
	};

	appState.savedSpots.push(spot);
	saveJSON(STORAGE_KEYS.savedSpots, appState.savedSpots);

	renderSavedSpots();
	renderSearchResults();
	renderSettings();

	showToast(`${spot.name} saved on ${getActiveMap().name}`);
}

function savePlaceAsSpot(placeId) {
	const place = getPlace(placeId);
	const point = getPlaceCenter(placeId);

	if (!place || !point) return;

	const spot = {
		id: createId("spot"),
		mapId: place.mapId,
		name: place.name,
		type: place.type || "place",
		note: "Saved map location",
		mapPoint: point,
		gps: null,
		createdAt: new Date().toISOString()
	};

	appState.savedSpots.push(spot);
	saveJSON(STORAGE_KEYS.savedSpots, appState.savedSpots);

	renderSavedSpots();
	renderSearchResults();
	renderSettings();

	showToast(`${place.name} saved`);
}

function renderSavedSpots() {
	const layer = document.querySelector("[data-spot-layer]");
	const list = document.querySelector("[data-saved-spots-list]");

	const activeSpots = appState.savedSpots.filter((spot) => {
		return (spot.mapId || "centeroo") === appState.activeMapId;
	});

	if (layer) {
		layer.innerHTML = "";

		activeSpots.forEach((spot) => {
			if (!spot.mapPoint) return;

			const button = document.createElement("button");
			button.type = "button";
			button.className = "saved-spot-marker";
			button.dataset.savedSpot = spot.id;
			button.style.left = `${spot.mapPoint.x}%`;
			button.style.top = `${spot.mapPoint.y}%`;
			button.innerHTML = `
				<span>📍</span>
				<small>${escapeHTML(spot.name)}</small>
			`;

			button.addEventListener("click", (event) => {
				if (shouldIgnoreMapTap(event)) return;

				event.stopPropagation();
				startFindingSpot(spot.id);
			});

			layer.appendChild(button);
		});
	}

	if (!list) return;

	if (activeSpots.length === 0) {
		list.innerHTML = `
			<div class="empty-state">
				<strong>No saved spots on ${escapeHTML(getActiveMap().name)} yet.</strong>
				<span>Save camp, your car, lockers, meetups, bathrooms, water refill spots, or landmarks.</span>
			</div>
		`;
		return;
	}

	list.innerHTML = "";

	activeSpots.forEach((spot) => {
		const card = document.createElement("article");
		card.className = "saved-spot-card";

		const accuracy = spot.gps?.accuracy ? `GPS ±${formatDistance(spot.gps.accuracy)}` : "Map pin";
		const mapStatus = spot.mapPoint ? "Map pin saved" : "GPS only";

		card.innerHTML = `
			<div>
				<h3>${escapeHTML(spot.name)}</h3>
				<p class="soft-text">${escapeHTML(spot.type || "Saved spot")} · ${accuracy} · ${mapStatus}</p>
			</div>

			<div class="spot-actions">
				<button type="button" class="small-button" data-find-spot="${spot.id}">Find</button>
				<button type="button" class="small-button" data-center-spot="${spot.id}">Map</button>
				<button type="button" class="small-button danger-mini" data-delete-spot="${spot.id}">Delete</button>
			</div>
		`;

		list.appendChild(card);
	});
}

function deleteSavedSpot(spotId) {
	const spot = getSavedSpot(spotId);
	if (!spot) return;

	const ok = confirm(`Delete saved spot "${spot.name}"?`);
	if (!ok) return;

	appState.savedSpots = appState.savedSpots.filter((item) => item.id !== spotId);

	if (appState.compass.targetSpotId === spotId) {
		stopCompass();
	}

	saveJSON(STORAGE_KEYS.savedSpots, appState.savedSpots);

	renderSavedSpots();
	renderSearchResults();
	renderSettings();

	showToast("Spot deleted");
}

function getSavedSpot(id) {
	return appState.savedSpots.find((spot) => spot.id === id) || null;
}

/* =========================================================
   GPS / LOCATION
========================================================= */

function enableLocation() {
	if (!navigator.geolocation) {
		showToast("GPS is not available in this browser.");
		return;
	}

	if (appState.location.watchId !== null) {
		showToast("Location is already on.");
		return;
	}

	showToast("Requesting location...");

	appState.location.watchId = navigator.geolocation.watchPosition(
		handleLocationSuccess,
		handleLocationError, {
			enableHighAccuracy: true,
			maximumAge: 2000,
			timeout: 15000
		}
	);
}

function handleLocationSuccess(position) {
	appState.location.enabled = true;
	appState.location.position = position;
	appState.location.accuracyMeters = position.coords.accuracy || null;
	appState.location.lastUpdatedAt = new Date();

	appState.location.mapPoint = getCurrentGPSMapPoint();

	renderGPSLayer();
	updateLocationStatus();
	updateCompassUI();
	renderSettings();
}

function handleLocationError(error) {
	appState.location.enabled = false;

	let message = "Location failed.";

	if (error.code === error.PERMISSION_DENIED) {
		message = "Location permission denied.";
	} else if (error.code === error.POSITION_UNAVAILABLE) {
		message = "Location unavailable.";
	} else if (error.code === error.TIMEOUT) {
		message = "Location timed out.";
	}

	updateLocationStatus(message);
	showToast(message);
	renderSettings();
}

function getCurrentGPSMapPoint() {
	if (!appState.location.position) return null;

	const coords = appState.location.position.coords;
	return gpsToMapPoint(coords.latitude, coords.longitude, appState.activeMapId);
}

function renderGPSLayer() {
	const layer = document.querySelector("[data-gps-layer]");
	if (!layer) return;

	layer.innerHTML = "";

	const point = appState.location.mapPoint;
	if (!point) return;

	const accuracy = appState.location.accuracyMeters;

	if (accuracy && appState.settings.showAccuracyCircle) {
		const circle = document.createElement("div");
		circle.className = `gps-accuracy-circle ${getAccuracyClass(accuracy)}`;
		circle.style.left = `${point.x}%`;
		circle.style.top = `${point.y}%`;
		circle.style.width = `${clamp(accuracy / 3, 24, 130)}px`;
		circle.style.height = `${clamp(accuracy / 3, 24, 130)}px`;
		layer.appendChild(circle);
	}

	const dot = document.createElement("div");
	dot.className = "gps-dot";
	dot.style.left = `${point.x}%`;
	dot.style.top = `${point.y}%`;
	dot.innerHTML = `<span></span>`;
	layer.appendChild(dot);
}

function updateLocationStatus(customText = "") {
	const status = document.querySelector("[data-location-status]");
	if (!status) return;

	if (customText) {
		status.textContent = customText;
		return;
	}

	if (!appState.location.position) {
		status.textContent = "Location off";
		return;
	}

	const accuracy = appState.location.accuracyMeters;
	const mapStatus = appState.location.mapPoint ? `${getActiveMap().name} GPS` : "GPS only";

	status.textContent = accuracy ? `${mapStatus} · ±${formatDistance(accuracy)}` : mapStatus;
}

function gpsToMapPoint(lat, lng, mapId) {
	const anchors = getCalibrationAnchors(mapId);

	if (anchors.length < 3) {
		return null;
	}

	const affine = getAffineTransformFromAnchors(anchors.slice(0, 3));
	if (!affine) return null;

	return {
		x: clamp(affine.a * lng + affine.b * lat + affine.c, 0, 100),
		y: clamp(affine.d * lng + affine.e * lat + affine.f, 0, 100)
	};
}

function getCalibrationAnchors(mapId) {
	const map = getMap(mapId);
	const dataAnchors = Array.isArray(map?.calibrationAnchors) ? map.calibrationAnchors : [];
	const savedAnchors = appState.calibrationByMap[mapId]?.anchors || [];

	return [...dataAnchors, ...savedAnchors];
}

function getAffineTransformFromAnchors(anchors) {
	try {
		const matrix = anchors.map((point) => [point.lng, point.lat, 1]);
		const xValues = anchors.map((point) => point.mapX);
		const yValues = anchors.map((point) => point.mapY);

		const xCoeffs = solve3x3(matrix, xValues);
		const yCoeffs = solve3x3(matrix, yValues);

		if (!xCoeffs || !yCoeffs) return null;

		return {
			a: xCoeffs[0],
			b: xCoeffs[1],
			c: xCoeffs[2],
			d: yCoeffs[0],
			e: yCoeffs[1],
			f: yCoeffs[2]
		};
	} catch (error) {
		console.warn("Calibration transform failed:", error);
		return null;
	}
}

function solve3x3(matrix, values) {
	const m = matrix.map((row, index) => [...row, values[index]]);

	for (let col = 0; col < 3; col += 1) {
		let pivot = col;

		for (let row = col + 1; row < 3; row += 1) {
			if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) {
				pivot = row;
			}
		}

		if (Math.abs(m[pivot][col]) < 1e-12) return null;

		[m[col], m[pivot]] = [m[pivot], m[col]];

		const divisor = m[col][col];

		for (let k = col; k < 4; k += 1) {
			m[col][k] /= divisor;
		}

		for (let row = 0; row < 3; row += 1) {
			if (row === col) continue;

			const factor = m[row][col];

			for (let k = col; k < 4; k += 1) {
				m[row][k] -= factor * m[col][k];
			}
		}
	}

	return [m[0][3], m[1][3], m[2][3]];
}

/* =========================================================
   ROO COMPASS
========================================================= */

function bindCompassControls() {
	document.addEventListener("click", (event) => {
		if (event.target.closest("[data-stop-compass]")) {
			stopCompass();
		}
	});
}

function openCompassPanel() {
	const card = document.querySelector("[data-compass-card]");
	if (!card) return;

	closeStageSheet();
	closeSpotsPanel();

	card.classList.remove("hidden");
	card.setAttribute("aria-hidden", "false");

	enableCompass();
	updateCompassUI();
}

function hideCompassPanelOnly() {
	const card = document.querySelector("[data-compass-card]");
	if (!card) return;

	card.classList.add("hidden");
	card.setAttribute("aria-hidden", "true");
}

async function enableCompass() {
	if (appState.compass.enabled) return;

	try {
		if (
			typeof DeviceOrientationEvent !== "undefined" &&
			typeof DeviceOrientationEvent.requestPermission === "function"
		) {
			const permission = await DeviceOrientationEvent.requestPermission();

			if (permission !== "granted") {
				showToast("Compass permission not granted.");
				updateCompassUI();
				return;
			}
		}

		window.addEventListener("deviceorientation", handleDeviceOrientation, true);
		appState.compass.enabled = true;

		showToast("Compass on");
		updateCompassUI();
		renderSettings();
	} catch (error) {
		console.warn(error);
		showToast("Compass could not start.");
	}
}

function handleDeviceOrientation(event) {
	let heading = null;

	if (typeof event.webkitCompassHeading === "number") {
		heading = event.webkitCompassHeading;
	} else if (typeof event.alpha === "number") {
		heading = 360 - event.alpha;
	}

	if (heading === null || Number.isNaN(heading)) return;

	appState.compass.heading = normalizeDegrees(heading);
	updateCompassUI();
}

function startFindingSpot(spotId) {
	const spot = getSavedSpot(spotId);
	if (!spot) return;

	appState.compass.targetSpotId = spotId;

	setActiveScreen("map");

	if (spot.mapId && spot.mapId !== appState.activeMapId) {
		setActiveMap(spot.mapId, { skipToast: true });
	}

	openCompassPanel();

	if (spot.mapPoint) {
		centerMapOnPercent(spot.mapPoint);
	}

	if (!appState.location.position) {
		enableLocation();
	}

	updateCompassUI();
}

function stopCompass() {
	appState.compass.targetSpotId = null;
	appState.compass.bearingToTarget = null;
	appState.compass.distanceToTargetMeters = null;

	hideCompassPanelOnly();
	updateCompassUI();
}

function updateCompassUI() {
	const title = document.querySelector("[data-compass-title]");
	const distance = document.querySelector("[data-compass-distance]");
	const detail = document.querySelector("[data-compass-detail]");
	const arrow = document.querySelector("[data-compass-arrow]");
	const gps = document.querySelector("[data-compass-gps]");
	const heading = document.querySelector("[data-compass-heading]");

	if (gps) {
		gps.textContent = appState.location.position ?
			`GPS: ±${formatDistance(appState.location.accuracyMeters || 0)}` :
			"GPS: off";
	}

	if (heading) {
		heading.textContent = appState.compass.heading === null ?
			"Compass: waiting" :
			`Compass: ${Math.round(appState.compass.heading)}°`;
	}

	const target = getSavedSpot(appState.compass.targetSpotId);

	if (!target) {
		if (title) title.textContent = "Choose a saved spot";
		if (distance) distance.textContent = "—";
		if (detail) detail.textContent = "Tap Find on Camp, Car, or a meetup spot.";
		if (arrow) arrow.style.transform = "rotate(0deg)";
		return;
	}

	if (title) title.textContent = `Finding ${target.name}`;

	const current = appState.location.position;

	if (!current || !target.gps) {
		if (distance) distance.textContent = "Map pin saved";
		if (detail) detail.textContent = "GPS distance needs a saved GPS spot. Use the map pin as backup.";
		if (arrow) arrow.style.transform = "rotate(0deg)";
		return;
	}

	const currentLat = current.coords.latitude;
	const currentLng = current.coords.longitude;

	const targetLat = target.gps.lat;
	const targetLng = target.gps.lng;

	const dist = getDistanceMeters(currentLat, currentLng, targetLat, targetLng);
	const bearing = getBearingDegrees(currentLat, currentLng, targetLat, targetLng);

	appState.compass.distanceToTargetMeters = dist;
	appState.compass.bearingToTarget = bearing;

	if (distance) distance.textContent = `${formatDistance(dist)} away`;

	const directionText = getCardinalDirection(bearing);

	if (detail) {
		detail.textContent = `Walk ${directionText}. Accuracy depends on GPS and compass quality.`;
	}

	if (arrow) {
		const headingNow = appState.compass.heading || 0;
		const rotation = normalizeDegrees(bearing - headingNow);
		arrow.style.transform = `rotate(${rotation}deg)`;
	}
}

/* =========================================================
   SETTINGS / DATA TOOLS / CALIBRATION
========================================================= */

function bindSettingsControls() {
	document.addEventListener("change", (event) => {
		const toggle = event.target.closest("[data-amenity-toggle]");
		if (!toggle) return;

		appState.amenityFilters[toggle.dataset.amenityToggle] = toggle.checked;
		saveJSON(STORAGE_KEYS.amenityFilters, appState.amenityFilters);

		renderAmenityLayer();
	});

	document.addEventListener("click", (event) => {
		if (event.target.closest("[data-export-data]")) {
			exportRooData();
		}

		if (event.target.closest("[data-copy-picks]")) {
			copyPicksToClipboard();
		}

		if (event.target.closest("[data-restore-picks-backup]")) {
			restorePicksBackup();
		}

		if (event.target.closest("[data-reset-roo-data]")) {
			resetRooData();
		}

		if (event.target.closest("[data-clear-picks]")) {
			clearPicks();
		}

		if (event.target.closest("[data-add-calibration-anchor]")) {
			addCalibrationAnchorFromCurrentState();
		}

		const deleteAnchorButton = event.target.closest("[data-delete-calibration-anchor]");
		if (deleteAnchorButton) {
			deleteCalibrationAnchor(deleteAnchorButton.dataset.deleteCalibrationAnchor);
		}
	});

	document.addEventListener("change", (event) => {
		const input = event.target.closest("[data-import-data]");
		if (!input || !input.files || !input.files[0]) return;

		importRooData(input.files[0]);
	});
}

function syncAmenityCheckboxes() {
	document.querySelectorAll("[data-amenity-toggle]").forEach((input) => {
		const type = input.dataset.amenityToggle;
		input.checked = Boolean(appState.amenityFilters[type]);
	});
}

function renderSettings() {
	const calibrationBox = document.querySelector("[data-calibration-box]");
	if (!calibrationBox) return;

	const activeMap = getActiveMap();
	const savedAnchors = appState.calibrationByMap[activeMap.id]?.anchors || [];
	const dataAnchors = activeMap.calibrationAnchors || [];
	const totalAnchors = savedAnchors.length + dataAnchors.length;

	const addButton = `
		<button class="secondary-button" type="button" data-add-calibration-anchor>
			Add ${escapeHTML(activeMap.name)} Anchor From GPS + Last Map Tap
		</button>
	`;

	if (totalAnchors === 0) {
		calibrationBox.innerHTML = `
			<div class="empty-state">
				<strong>No ${escapeHTML(activeMap.name)} calibration anchors yet.</strong>
				<span>To align the blue GPS dot to this map, stand at a known spot, tap that same spot on the active map, then add an anchor.</span>
			</div>
			${addButton}
		`;
		return;
	}

	calibrationBox.innerHTML = `
		${dataAnchors.map((anchor) => `
			<div class="insight-row">
				<span>${escapeHTML(anchor.name || "Built-in Anchor")}</span>
				<strong>${Number(anchor.mapX).toFixed(1)}%, ${Number(anchor.mapY).toFixed(1)}%</strong>
			</div>
		`).join("")}

		${savedAnchors.map((anchor) => `
			<div class="insight-row">
				<span>${escapeHTML(anchor.name || "Anchor")}</span>
				<strong>${Number(anchor.mapX).toFixed(1)}%, ${Number(anchor.mapY).toFixed(1)}%</strong>
			</div>

			<button class="small-button danger-mini" type="button" data-delete-calibration-anchor="${anchor.id}">
				Delete ${escapeHTML(anchor.name || "Anchor")}
			</button>
		`).join("")}

		${addButton}
	`;
}

function addCalibrationAnchorFromCurrentState() {
	if (!appState.location.position) {
		enableLocation();
		showToast("Turn on GPS first, then add the anchor again.");
		return;
	}

	if (!appState.map.lastMapPoint) {
		showToast("Tap the exact matching spot on the active map first.");
		return;
	}

	const activeMap = getActiveMap();
	const name = prompt("Anchor name:", `${activeMap.name} known spot`);
	if (!name) return;

	const coords = appState.location.position.coords;

	const anchor = {
		id: createId("anchor"),
		name: name.trim(),
		lat: coords.latitude,
		lng: coords.longitude,
		mapX: appState.map.lastMapPoint.x,
		mapY: appState.map.lastMapPoint.y,
		accuracy: coords.accuracy || null,
		createdAt: new Date().toISOString()
	};

	if (!appState.calibrationByMap[activeMap.id]) {
		appState.calibrationByMap[activeMap.id] = { anchors: [] };
	}

	appState.calibrationByMap[activeMap.id].anchors.push(anchor);
	saveJSON(STORAGE_KEYS.calibrationByMap, appState.calibrationByMap);

	appState.location.mapPoint = getCurrentGPSMapPoint();

	renderGPSLayer();
	renderSettings();
	updateLocationStatus();

	showToast(`${activeMap.name} calibration anchor saved`);
}

function deleteCalibrationAnchor(anchorId) {
	const activeMap = getActiveMap();

	appState.calibrationByMap[activeMap.id].anchors =
		(appState.calibrationByMap[activeMap.id].anchors || []).filter((anchor) => anchor.id !== anchorId);

	saveJSON(STORAGE_KEYS.calibrationByMap, appState.calibrationByMap);

	appState.location.mapPoint = getCurrentGPSMapPoint();

	renderGPSLayer();
	renderSettings();
	updateLocationStatus();

	showToast("Calibration anchor deleted");
}

function getPickCount(picks = appState.picks) {
	return Object.keys(picks || {}).length;
}

function buildPicksBackup(picks, reason = "auto") {
	const cleanPicks = { ...(picks || {}) };

	return {
		version: ROO_APP_VERSION,
		reason,
		savedAt: new Date().toISOString(),
		count: getPickCount(cleanPicks),
		picks: cleanPicks
	};
}

function normalizePicksBackup(value) {
	if (!value || typeof value !== "object") return null;

	if (value.picks && typeof value.picks === "object") {
		return {
			version: value.version || ROO_APP_VERSION,
			reason: value.reason || "backup",
			savedAt: value.savedAt || new Date().toISOString(),
			count: getPickCount(value.picks),
			picks: { ...value.picks }
		};
	}

	return buildPicksBackup(value, "legacy");
}

function savePicksBackup(reason = "auto") {
	if (getPickCount(appState.picks) <= 0) return;

	const backup = buildPicksBackup(appState.picks, reason);

	saveJSON(STORAGE_KEYS.picksBackup, backup);
	saveJSON(STORAGE_KEYS.picksBackupLastGood, backup);
}

function getBestPicksBackup() {
	const backups = [
		normalizePicksBackup(loadJSON(STORAGE_KEYS.picksBackup, null)),
		normalizePicksBackup(loadJSON(STORAGE_KEYS.picksBackupLastGood, null))
	].filter((backup) => backup && backup.count > 0);

	if (backups.length === 0) return null;

	backups.sort((a, b) => {
		if (b.count !== a.count) return b.count - a.count;
		return String(b.savedAt || "").localeCompare(String(a.savedAt || ""));
	});

	return backups[0];
}

function restorePicksBackup() {
	const backup = getBestPicksBackup();

	if (!backup || !backup.picks || backup.count <= 0) {
		showToast("No picks backup found yet.");
		return;
	}

	const ok = confirm(`Restore ${backup.count} saved pick${backup.count === 1 ? "" : "s"} from backup?`);
	if (!ok) return;

	appState.picks = { ...backup.picks };

	saveJSON(STORAGE_KEYS.picks, appState.picks);
	savePicksBackup("restore");

	renderPlanner();
	renderTimeline();
	renderSearchResults();
	renderSettings();

	if (appState.selectedPlaceId) {
		openPlaceSheet(appState.selectedPlaceId, { center: false, preserveScroll: true });
	}

	showToast(`${backup.count} picks restored`);
}

function exportRooData() {
	savePicksBackup("export");

	const data = {
		version: ROO_APP_VERSION,
		exportedAt: new Date().toISOString(),
		activeMapId: appState.activeMapId,
		picks: appState.picks,
		savedSpots: appState.savedSpots,
		amenityFilters: appState.amenityFilters,
		settings: appState.settings,
		calibrationByMap: appState.calibrationByMap,
		picksBackup: loadJSON(STORAGE_KEYS.picksBackup, null),
		picksBackupLastGood: loadJSON(STORAGE_KEYS.picksBackupLastGood, null)
	};

	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = `roo-map-backup-${new Date().toISOString().slice(0, 10)}.json`;
	document.body.appendChild(link);
	link.click();
	link.remove();

	URL.revokeObjectURL(url);
	showToast("Backup exported");
}

function importRooData(file) {
	const reader = new FileReader();

	reader.onload = () => {
		try {
			const data = JSON.parse(String(reader.result || "{}"));

			if (data.picks) appState.picks = data.picks;
			if (Array.isArray(data.savedSpots)) appState.savedSpots = data.savedSpots;
			if (data.amenityFilters) appState.amenityFilters = { ...DEFAULT_AMENITY_FILTERS, ...data.amenityFilters };
			if (data.settings) appState.settings = { ...DEFAULT_SETTINGS, ...data.settings };
			if (data.calibrationByMap) appState.calibrationByMap = normalizeCalibrationStore(data.calibrationByMap);
			if (data.activeMapId && ROO_DATA.maps[data.activeMapId]) appState.activeMapId = data.activeMapId;

			saveJSON(STORAGE_KEYS.picks, appState.picks);

			if (data.picksBackup) {
				const importedBackup = normalizePicksBackup(data.picksBackup);
				if (importedBackup) saveJSON(STORAGE_KEYS.picksBackup, importedBackup);
			}

			if (data.picksBackupLastGood) {
				const importedLastGood = normalizePicksBackup(data.picksBackupLastGood);
				if (importedLastGood) saveJSON(STORAGE_KEYS.picksBackupLastGood, importedLastGood);
			}

			savePicksBackup("import");

			saveJSON(STORAGE_KEYS.savedSpots, appState.savedSpots);
			saveJSON(STORAGE_KEYS.amenityFilters, appState.amenityFilters);
			saveJSON(STORAGE_KEYS.settings, appState.settings);
			saveJSON(STORAGE_KEYS.calibrationByMap, appState.calibrationByMap);
			saveValue(STORAGE_KEYS.activeMapId, appState.activeMapId);

			syncAmenityCheckboxes();
			renderAll();
			setActiveMap(appState.activeMapId, { skipToast: true });

			showToast("Backup imported");
		} catch (error) {
			console.error(error);
			showToast("Import failed. File was not valid JSON.");
		}
	};

	reader.readAsText(file);
}

async function copyPicksToClipboard() {
	const picked = getPickedEvents();

	if (picked.length === 0) {
		showToast("No picks to copy yet.");
		return;
	}

	const text = picked.map((event) => {
		const label = event.pickType === "must" ? "MUST" : "MAYBE";
		return `${label}: ${event.artist} — ${event.day} ${formatTime(event.start)} at ${event.placeName}`;
	}).join("\n");

	try {
		await navigator.clipboard.writeText(text);
		showToast("Picks copied");
	} catch {
		prompt("Copy your picks:", text);
	}
}

function resetRooData() {
	const ok = confirm("Reset picks, saved spots, map positions, and settings?");
	if (!ok) return;

	Object.values(STORAGE_KEYS).forEach((key) => {
		if (key === STORAGE_KEYS.picksBackup) return;
		if (key === STORAGE_KEYS.picksBackupLastGood) return;
		localStorage.removeItem(key);
	});

	appState.activeScreen = "map";
	appState.activeMapId = ROO_DATA.defaultMapId || "centeroo";
	appState.selectedDay = "All";
	appState.picks = {};
	appState.savedSpots = [];
	appState.mapTransformsByMap = {};
	appState.amenityFilters = { ...DEFAULT_AMENITY_FILTERS };
	appState.settings = { ...DEFAULT_SETTINGS };
	appState.calibrationByMap = normalizeCalibrationStore(null);

	resetMapView();
	syncAmenityCheckboxes();
	renderAll();
	setActiveScreen("map");
	setActiveMap(appState.activeMapId, { skipToast: true });

	showToast("Roo data reset");
}

function clearPicks() {
	const ok = confirm("Clear all Must / Maybe / Skip picks?");
	if (!ok) return;

	savePicksBackup("before-clear");

	appState.picks = {};
	saveJSON(STORAGE_KEYS.picks, appState.picks);

	renderPlanner();
	renderTimeline();
	renderSearchResults();

	if (appState.selectedPlaceId) {
		openPlaceSheet(appState.selectedPlaceId, { center: false });
	}

	showToast("Picks cleared. Backup kept.");
}

/* =========================================================
   SERVICE WORKER
========================================================= */

function registerServiceWorker() {
	if (!("serviceWorker" in navigator)) return;

	window.addEventListener("load", () => {
		navigator.serviceWorker.register("service-worker.js").catch((error) => {
			console.warn("Service worker registration failed:", error);
		});
	});
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeCalibrationStore(store) {
	const normalized = {};

	Object.keys(ROO_DATA.maps).forEach((mapId) => {
		normalized[mapId] = { anchors: [] };
	});

	if (!store) return normalized;

	if (Array.isArray(store.anchors)) {
		const fallbackMap = ROO_DATA.defaultMapId || "centeroo";
		normalized[fallbackMap] = { anchors: store.anchors };
		return normalized;
	}

	Object.keys(store).forEach((mapId) => {
		if (!normalized[mapId]) normalized[mapId] = { anchors: [] };

		if (Array.isArray(store[mapId]?.anchors)) {
			normalized[mapId].anchors = store[mapId].anchors;
		}
	});

	return normalized;
}

function findNowPlaying(events) {
	const current = getCurrentDayAndMinutes();
	if (!current) return null;

	return events.find((event) => {
		if (event.day !== current.day) return false;

		const start = timeToMinutes(event.start);
		const end = normalizeEndMinutes(event.start, event.end);

		return current.minutes >= start && current.minutes <= end;
	}) || null;
}

function findNextEvent(events) {
	const current = getCurrentDayAndMinutes();
	if (!current) return null;

	const upcoming = events.filter((event) => {
		if (event.day !== current.day) return false;
		return timeToMinutes(event.start) >= current.minutes;
	});

	return upcoming[0] || null;
}

function sortEventsByDayAndTime(a, b) {
	const dayA = ROO_DAYS.indexOf(a.day);
	const dayB = ROO_DAYS.indexOf(b.day);

	if (dayA !== dayB) return dayA - dayB;

	return timeToMinutes(a.start) - timeToMinutes(b.start);
}

function timeToMinutes(time) {
	const [hourRaw, minuteRaw] = String(time).split(":");
	const hour = Number(hourRaw);
	const minute = Number(minuteRaw || 0);

	return hour * 60 + minute;
}

function normalizeEndMinutes(start, end) {
	const startMinutes = timeToMinutes(start);
	let endMinutes = timeToMinutes(end);

	if (endMinutes < startMinutes) {
		endMinutes += 24 * 60;
	}

	return endMinutes;
}

function minutesToTime(totalMinutes) {
	let minutes = totalMinutes;

	while (minutes < 0) minutes += 24 * 60;
	while (minutes >= 24 * 60) minutes -= 24 * 60;

	const hour24 = Math.floor(minutes / 60);
	const minute = minutes % 60;

	const suffix = hour24 >= 12 ? "PM" : "AM";
	let hour12 = hour24 % 12;
	if (hour12 === 0) hour12 = 12;

	return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatTime(time) {
	return minutesToTime(timeToMinutes(time));
}

function getCurrentDayAndMinutes() {
	const now = new Date();

	const festivalDates = {
		"2026-06-10": "Wednesday",
		"2026-06-11": "Thursday",
		"2026-06-12": "Friday",
		"2026-06-13": "Saturday",
		"2026-06-14": "Sunday"
	};

	const previousFestivalDates = {
		"2026-06-11": "Wednesday",
		"2026-06-12": "Thursday",
		"2026-06-13": "Friday",
		"2026-06-14": "Saturday",
		"2026-06-15": "Sunday"
	};

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const date = String(now.getDate()).padStart(2, "0");
	const dateKey = `${year}-${month}-${date}`;

	const hour = now.getHours();
	const minute = now.getMinutes();

	if (hour < 6 && previousFestivalDates[dateKey]) {
		return {
			day: previousFestivalDates[dateKey],
			minutes: hour * 60 + minute + 24 * 60
		};
	}

	const day = festivalDates[dateKey];
	if (!day) return null;

	return {
		day,
		minutes: hour * 60 + minute
	};
}

function getDistanceMeters(lat1, lng1, lat2, lng2) {
	const radius = 6371000;
	const phi1 = toRadians(lat1);
	const phi2 = toRadians(lat2);
	const deltaPhi = toRadians(lat2 - lat1);
	const deltaLambda = toRadians(lng2 - lng1);

	const a =
		Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
		Math.cos(phi1) * Math.cos(phi2) *
		Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return radius * c;
}

function getBearingDegrees(lat1, lng1, lat2, lng2) {
	const phi1 = toRadians(lat1);
	const phi2 = toRadians(lat2);
	const lambda1 = toRadians(lng1);
	const lambda2 = toRadians(lng2);

	const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
	const x =
		Math.cos(phi1) * Math.sin(phi2) -
		Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);

	return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

function getCardinalDirection(degrees) {
	const directions = [
		"north",
		"northeast",
		"east",
		"southeast",
		"south",
		"southwest",
		"west",
		"northwest"
	];

	const index = Math.round(degrees / 45) % 8;
	return directions[index];
}

function formatDistance(meters) {
	if (!meters && meters !== 0) return "—";

	const feet = meters * 3.28084;

	if (feet < 1000) {
		return `${Math.round(feet)} ft`;
	}

	const miles = feet / 5280;
	return `${miles.toFixed(2)} mi`;
}

function getAccuracyClass(meters) {
	if (meters <= 10) return "accuracy-good";
	if (meters <= 35) return "accuracy-ok";
	return "accuracy-weak";
}

function toRadians(degrees) {
	return degrees * Math.PI / 180;
}

function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

function normalizeDegrees(degrees) {
	return ((degrees % 360) + 360) % 360;
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function capitalize(value) {
	const text = String(value || "");
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function getDayClass(day) {
	const normalized = String(day || "All").toLowerCase().replace(/[^a-z0-9]+/g, "-");
	return `day-${normalized || "all"}`;
}

function createId(prefix) {
	return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadValue(key, fallback) {
	const value = localStorage.getItem(key);
	return value === null ? fallback : value;
}

function saveValue(key, value) {
	localStorage.setItem(key, value);
}

function loadJSON(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}

function saveJSON(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

let toastTimer = null;

function showToast(message) {
	const toast = document.querySelector("[data-toast]");
	if (!toast) return;

	toast.textContent = message;
	toast.classList.add("is-visible");

	clearTimeout(toastTimer);

	toastTimer = setTimeout(() => {
		toast.classList.remove("is-visible");
	}, 2600);
}

/* =========================================================
   ROO SAFE UX PATCH — 20260604
   Safe version:
   - no MutationObserver
   - no renderMapShell override
   - no setActiveMap override
   - loader force-removes itself so it cannot get stuck
========================================================= */

(() => {
	"use strict";

	const UX_KEYS = {
		firstRunSeen: "roo_first_run_seen_v1",
		offlineReadySeen: "roo_offline_ready_seen_v1",
		backupReminderSeen: "roo_backup_reminder_seen_v1"
	};

	let mapLoadingTimer = null;

	showStartupLoaderSafely();
	bindSafeUX();

	function bindSafeUX() {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", bootSafeUX, { once: true });
		} else {
			bootSafeUX();
		}
	}

	function bootSafeUX() {
		forceHideStartupLoader();
		bindFirstRunWelcome();
		bindMapSwitchLoading();
		bindBackupStatusUpdates();
		bindSafeWarnings();
		bindShareRooMap();
		bindGPSLoadingToast();
		bindOfflineReadyToast();
		updateBackupStatusText();

		window.setTimeout(showFirstRunWelcomeIfNeeded, 700);
	}

	/* =========================
	   SAFE STARTUP LOADER
	========================= */

	function showStartupLoaderSafely() {
		const overlay = document.querySelector("[data-roo-loading-overlay]");
		const label = document.querySelector("[data-roo-loading-text]");

		if (!overlay) return;

		if (label) {
			label.textContent = "Loading Roo Map…";
		}

		overlay.classList.remove("hidden");
		overlay.classList.remove("is-hiding");
		overlay.setAttribute("aria-hidden", "false");

		window.addEventListener("load", () => {
			window.setTimeout(forceHideStartupLoader, 350);
		}, { once: true });

		window.setTimeout(forceHideStartupLoader, 2800);
	}

	function forceHideStartupLoader() {
		const overlay = document.querySelector("[data-roo-loading-overlay]");
		if (!overlay) return;

		overlay.classList.add("is-hiding");
		overlay.setAttribute("aria-hidden", "true");

		window.setTimeout(() => {
			if (overlay && overlay.parentNode) {
				overlay.parentNode.removeChild(overlay);
			}
		}, 260);
	}

	/* =========================
	   MAP SWITCH LOADING
	========================= */

	function bindMapSwitchLoading() {
		document.addEventListener("click", (event) => {
			const button = event.target.closest("[data-map-target]");
			if (!button) return;

			const mapId = button.dataset.mapTarget;
			const map = typeof getMap === "function" ? getMap(mapId) : null;
			const label = map && map.name ? `Loading ${map.name}…` : "Loading map…";

			const viewport = document.querySelector("[data-map-viewport]");
			if (viewport) {
				viewport.setAttribute("data-loading-label", label);
			}

			document.body.classList.add("is-map-loading");

			clearTimeout(mapLoadingTimer);
			mapLoadingTimer = window.setTimeout(() => {
				document.body.classList.remove("is-map-loading");
			}, 1400);
		});
	}

	/* =========================
	   FIRST-TIME WELCOME
	========================= */

	function bindFirstRunWelcome() {
		document.addEventListener("click", (event) => {
			if (!event.target.closest("[data-close-first-run]")) return;
			closeFirstRunWelcome();
		});

		const modal = document.querySelector("[data-first-run-modal]");
		if (!modal) return;

		modal.addEventListener("click", (event) => {
			if (event.target === modal) {
				closeFirstRunWelcome();
			}
		});
	}

	function showFirstRunWelcomeIfNeeded() {
		if (localStorage.getItem(UX_KEYS.firstRunSeen) === "yes") return;

		const modal = document.querySelector("[data-first-run-modal]");
		if (!modal) return;

		modal.classList.remove("hidden");
		modal.setAttribute("aria-hidden", "false");
	}

	function closeFirstRunWelcome() {
		localStorage.setItem(UX_KEYS.firstRunSeen, "yes");

		const modal = document.querySelector("[data-first-run-modal]");
		if (!modal) return;

		modal.classList.add("hidden");
		modal.setAttribute("aria-hidden", "true");
	}

	/* =========================
	   BACKUP STATUS
	========================= */

	function bindBackupStatusUpdates() {
		document.addEventListener("click", (event) => {
			if (
				event.target.closest("[data-export-data]") ||
				event.target.closest("[data-copy-picks]") ||
				event.target.closest("[data-restore-picks-backup]") ||
				event.target.closest("[data-screen-target='settings']")
			) {
				window.setTimeout(updateBackupStatusText, 250);
			}
		});

		document.addEventListener("change", (event) => {
			if (!event.target.matches("[data-import-data]")) return;

			showToast("Importing backup…");

			window.setTimeout(() => {
				updateBackupStatusText();
				showToast("Backup imported");
			}, 900);
		});
	}

	function updateBackupStatusText() {
		const status = document.querySelector("[data-backup-status]");
		if (!status) return;

		const backup = getBestBackup();

		if (!backup || !backup.picks) {
			status.textContent = "No picks backup saved yet.";
			return;
		}

		const count = backup.count || Object.keys(backup.picks || {}).length;
		const time = formatBackupTime(backup.savedAt);

		status.textContent = `Last picks backup: ${count} pick${count === 1 ? "" : "s"} · ${time}`;
	}

	function getBestBackup() {
		const backups = [
			loadJSON(STORAGE_KEYS.picksBackup, null),
			loadJSON(STORAGE_KEYS.picksBackupLastGood, null)
		].filter((backup) => backup && backup.picks);

		if (backups.length === 0) return null;

		backups.sort((a, b) => {
			const countA = Object.keys(a.picks || {}).length;
			const countB = Object.keys(b.picks || {}).length;

			if (countB !== countA) return countB - countA;

			return String(b.savedAt || "").localeCompare(String(a.savedAt || ""));
		});

		return backups[0];
	}

	function formatBackupTime(value) {
		const date = value ? new Date(value) : new Date();

		if (Number.isNaN(date.getTime())) {
			return "Saved";
		}

		return date.toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit"
		});
	}

	/* =========================
	   SAFER WARNINGS
	========================= */

	function bindSafeWarnings() {
		document.addEventListener("click", (event) => {
			const clearButton = event.target.closest("[data-clear-picks]");
			if (clearButton) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				safeClearPicks();
				return;
			}

			const resetButton = event.target.closest("[data-reset-roo-data]");
			if (resetButton) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				safeResetRooData();
			}
		}, true);
	}

	function safeClearPicks() {
		const ok = confirm(
			"Clear all Must, Maybe, and Skip picks?\n\nYour local picks backup will be kept."
		);

		if (!ok) return;

		if (typeof savePicksBackup === "function") {
			savePicksBackup("before-clear");
		}

		appState.picks = {};
		saveJSON(STORAGE_KEYS.picks, appState.picks);

		renderPlanner();
		renderTimeline();
		renderSearchResults();
		renderSettings();
		updateBackupStatusText();

		if (appState.selectedPlaceId) {
			openPlaceSheet(appState.selectedPlaceId, {
				center: false,
				preserveScroll: true
			});
		}

		showToast("Picks cleared. Backup kept.");
	}

	function safeResetRooData() {
		const ok = confirm(
			"This deletes your picks, saved spots, settings, and GPS anchors.\n\nYour local picks backup will be kept.\n\nReset app data?"
		);

		if (!ok) return;

		Object.values(STORAGE_KEYS).forEach((key) => {
			if (key === STORAGE_KEYS.picksBackup) return;
			if (key === STORAGE_KEYS.picksBackupLastGood) return;
			localStorage.removeItem(key);
		});

		localStorage.removeItem(UX_KEYS.firstRunSeen);
		localStorage.removeItem(UX_KEYS.offlineReadySeen);
		localStorage.removeItem(UX_KEYS.backupReminderSeen);

		appState.activeScreen = "map";
		appState.activeMapId = ROO_DATA.defaultMapId || "centeroo";
		appState.selectedDay = "All";
		appState.plannerDay = "All";
		appState.timelineDay = "All";
		appState.picks = {};
		appState.savedSpots = [];
		appState.mapTransformsByMap = {};
		appState.amenityFilters = { ...DEFAULT_AMENITY_FILTERS };
		appState.settings = { ...DEFAULT_SETTINGS };
		appState.calibrationByMap = normalizeCalibrationStore(null);

		resetMapView();
		syncAmenityCheckboxes();
		renderAll();
		setActiveScreen("map");
		setActiveMap(appState.activeMapId, {
			skipToast: true,
			skipMapLoading: true
		});

		updateBackupStatusText();
		showToast("Roo data reset. Picks backup kept.");
	}

	/* =========================
	   SHARE APP
	========================= */

	function bindShareRooMap() {
		document.addEventListener("click", (event) => {
			if (!event.target.closest("[data-share-roo-map]")) return;
			shareRooMap();
		});
	}

	async function shareRooMap() {
		const url = window.location.href.split("#")[0];

		try {
			if (navigator.share) {
				await navigator.share({
					title: "Roo Map",
					text: "Roo Map",
					url
				});
				return;
			}

			await navigator.clipboard.writeText(url);
			showToast("Roo Map link copied");
		} catch {
			try {
				await navigator.clipboard.writeText(url);
				showToast("Roo Map link copied");
			} catch {
				prompt("Copy Roo Map link:", url);
			}
		}
	}

	/* =========================
	   GPS TOAST
	========================= */

	function bindGPSLoadingToast() {
		document.addEventListener("click", (event) => {
			if (
				event.target.closest("[data-enable-location]") ||
				event.target.closest("[data-quick-location]")
			) {
				window.setTimeout(() => {
					showToast("Finding your location…");
				}, 20);
			}
		});
	}

	/* =========================
	   OFFLINE READY
	========================= */

	function bindOfflineReadyToast() {
		if (!("serviceWorker" in navigator)) return;

		navigator.serviceWorker.ready
			.then(() => {
				if (localStorage.getItem(UX_KEYS.offlineReadySeen) === "yes") return;

				localStorage.setItem(UX_KEYS.offlineReadySeen, "yes");

				window.setTimeout(() => {
					showToast("Roo Map saved for offline use");
				}, 700);
			})
			.catch(() => {
				/* Ignore service worker readiness issues. */
			});

		navigator.serviceWorker.addEventListener("controllerchange", () => {
			window.setTimeout(() => {
				showToast("Update ready — reopen Roo Map");
			}, 500);
		});
	}
})();