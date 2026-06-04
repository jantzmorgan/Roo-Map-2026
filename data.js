/* =========================================================
   ROO MAP PWA — data.js
   Centeroo + Outeroo map data

   Images expected:
   assets/centeroo-map.png
   assets/outeroo-map.png

   Notes:
   - x/y/w/h values are percentages of each map image.
   - These are first-pass scan positions from the images you uploaded.
   - We will tune exact hitboxes after you test it on your phone.
========================================================= */

"use strict";

window.ROO_DATA = {
	version: "0.1.0",

	defaultMapId: "centeroo",

	days: ["All", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],

	maps: {
		centeroo: {
			id: "centeroo",
			name: "Centeroo",
			shortName: "Centeroo",
			image: "./centeroo-map.png",
			description: "Stages, tents, vendors, lounges, plazas, entrances, and amenities inside Centeroo.",
			calibrationAnchors: []
		},

		outeroo: {
			id: "outeroo",
			name: "Outeroo",
			shortName: "Outeroo",
			image: "./outeroo-map.png",
			description: "Campgrounds, plazas, tolls, barns, Grove, parking, pods, and Outer Roo landmarks.",
			calibrationAnchors: []
		}
	},

	/* =====================================================
	   CLICKABLE PLACES
	   Rectangles are tuned as first-pass visual hitboxes.
	===================================================== */

	places: [
		/* =========================
		   CENTEROO — STAGES / TENTS
		========================= */

		{
			id: "centeroo-what-stage",
			mapId: "centeroo",
			name: "What Stage",
			shortName: "What",
			type: "stage",
			accent: "sunset",
			x: 23.6,
			y: 13.9,
			w: 13.7,
			h: 8.6,
			description: "Main stage on the north side of Centeroo.",
			scheduleVenueId: "what-stage"
		},

		{
			id: "centeroo-which-stage",
			mapId: "centeroo",
			name: "Which Stage",
			shortName: "Which",
			type: "stage",
			accent: "blue",
			x: 44.3,
			y: 22.8,
			w: 9.8,
			h: 9.0,
			description: "Large outdoor stage near the center of Centeroo.",
			scheduleVenueId: "which-stage"
		},

		{
			id: "centeroo-where-stage",
			mapId: "centeroo",
			name: "Where Stage",
			shortName: "Where",
			type: "stage",
			accent: "purple",
			x: 82.6,
			y: 24.0,
			w: 8.6,
			h: 10.2,
			description: "Stage on the far east side of Centeroo.",
			scheduleVenueId: "where-stage"
		},

		{
			id: "centeroo-that-tent",
			mapId: "centeroo",
			name: "That Tent",
			shortName: "That",
			type: "tent",
			accent: "green",
			x: 7.9,
			y: 45.0,
			w: 11.4,
			h: 8.5,
			description: "Tent stage on the west side of Centeroo.",
			scheduleVenueId: "that-tent"
		},

		{
			id: "centeroo-this-tent",
			mapId: "centeroo",
			name: "This Tent",
			shortName: "This",
			type: "tent",
			accent: "pink",
			x: 78.2,
			y: 45.5,
			w: 10.9,
			h: 7.8,
			description: "Tent stage on the east side of Centeroo.",
			scheduleVenueId: "this-tent"
		},

		{
			id: "centeroo-the-other-stage",
			mapId: "centeroo",
			name: "The Other Stage",
			shortName: "Other",
			type: "stage",
			accent: "yellow",
			x: 80.4,
			y: 74.5,
			w: 12.2,
			h: 8.5,
			description: "The Other Stage near the southeast side of Centeroo.",
			scheduleVenueId: "the-other-stage"
		},

		/* =========================
		   CENTEROO — LANDMARKS
		========================= */

		{
			id: "centeroo-planet-roo",
			mapId: "centeroo",
			name: "Planet Roo",
			shortName: "Planet",
			type: "landmark",
			accent: "green",
			x: 57.7,
			y: 56.6,
			w: 8.8,
			h: 8.5,
			description: "Planet Roo area near the center of Centeroo."
		},

		{
			id: "centeroo-vendor-village",
			mapId: "centeroo",
			name: "Vendor Village",
			shortName: "Vendors",
			type: "vendor",
			accent: "sunset",
			x: 69.0,
			y: 52.0,
			w: 9.2,
			h: 8.2,
			description: "Vendor Village area."
		},

		{
			id: "centeroo-main-merch",
			mapId: "centeroo",
			name: "Main Merch",
			shortName: "Merch",
			type: "merch",
			accent: "green",
			x: 51.6,
			y: 55.4,
			w: 4.2,
			h: 2.8,
			description: "Main merch area."
		},

		{
			id: "centeroo-ga-plus-lounge",
			mapId: "centeroo",
			name: "GA+ Lounge",
			shortName: "GA+",
			type: "lounge",
			accent: "sunset",
			x: 82.0,
			y: 57.0,
			w: 10.0,
			h: 8.7,
			description: "GA+ Lounge area."
		},

		{
			id: "centeroo-platinum-lounge",
			mapId: "centeroo",
			name: "Platinum Lounge",
			shortName: "Platinum",
			type: "lounge",
			accent: "blue",
			x: 57.2,
			y: 20.1,
			w: 9.4,
			h: 6.3,
			description: "Platinum Lounge."
		},

		{
			id: "centeroo-vip-lounge",
			mapId: "centeroo",
			name: "VIP Lounge",
			shortName: "VIP",
			type: "lounge",
			accent: "pink",
			x: 40.8,
			y: 67.3,
			w: 10.2,
			h: 7.0,
			description: "VIP Lounge."
		},

		{
			id: "centeroo-the-arch",
			mapId: "centeroo",
			name: "The Arch Entrance",
			shortName: "Arch",
			type: "entrance",
			accent: "yellow",
			x: 29.8,
			y: 73.0,
			w: 8.0,
			h: 8.0,
			description: "The Arch Entrance."
		},

		{
			id: "centeroo-the-tower",
			mapId: "centeroo",
			name: "The Tower Entrance",
			shortName: "Tower",
			type: "entrance",
			accent: "yellow",
			x: 62.5,
			y: 84.0,
			w: 8.5,
			h: 7.0,
			description: "The Tower Entrance."
		},

		{
			id: "centeroo-bonnies-broos",
			mapId: "centeroo",
			name: "Bonnie Roo’s Broos",
			shortName: "Broos",
			type: "food",
			accent: "blue",
			x: 45.0,
			y: 78.0,
			w: 9.0,
			h: 6.0,
			description: "Bonnie Roo’s Broos area."
		},

		{
			id: "centeroo-the-academy",
			mapId: "centeroo",
			name: "The Academy",
			shortName: "Academy",
			type: "landmark",
			accent: "purple",
			x: 60.4,
			y: 58.0,
			w: 7.3,
			h: 5.5,
			description: "The Academy area near Planet Roo.",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy",
			scheduleVenueId: "the-academy"
		},

		{
			id: "centeroo-coca-cola-refresh-lounge",
			mapId: "centeroo",
			name: "Coca-Cola Refresh Lounge",
			shortName: "Coca-Cola",
			type: "lounge",
			accent: "blue",
			x: 56.0,
			y: 41.8,
			w: 5.2,
			h: 3.0,
			description: "Coca-Cola Refresh Lounge near the center of Centeroo."
		},

		{
			id: "centeroo-5th-avenue",
			mapId: "centeroo",
			name: "5th Avenue",
			shortName: "5th Ave",
			type: "road",
			accent: "yellow",
			x: 61.0,
			y: 34.8,
			w: 2.0,
			h: 13.4,
			description: "5th Avenue walkway through central Centeroo."
		},

		{
			id: "centeroo-4th-avenue",
			mapId: "centeroo",
			name: "4th Avenue",
			shortName: "4th Ave",
			type: "road",
			accent: "yellow",
			x: 49.0,
			y: 36.6,
			w: 2.1,
			h: 18.0,
			description: "4th Avenue walkway near Which Stage and central Centeroo."
		},

		{
			id: "centeroo-area-931",
			mapId: "centeroo",
			name: "Area 931",
			shortName: "Area 931",
			type: "landmark",
			accent: "purple",
			x: 74.2,
			y: 30.2,
			w: 4.4,
			h: 3.0,
			description: "Area 931 entrance/area near the east side of Centeroo."
		},

		{
			id: "centeroo-rootique",
			mapId: "centeroo",
			name: "Rootique",
			shortName: "Rootique",
			type: "vendor",
			accent: "green",
			x: 64.4,
			y: 54.0,
			w: 5.1,
			h: 1.9,
			description: "Rootique vendor area near Vendor Village."
		},

		{
			id: "centeroo-snake-jakes-love-shack",
			mapId: "centeroo",
			name: "Snake & Jake’s Love Shack",
			shortName: "Snake & Jake’s",
			type: "landmark",
			accent: "pink",
			x: 56.3,
			y: 64.6,
			w: 5.2,
			h: 3.5,
			description: "Snake & Jake’s Love Shack near Planet Roo.",
			scheduleVenueId: "snake-jakes",
			scheduleVenueId: "snake-jakes",
			scheduleVenueId: "snake-jakes"
		},

		{
			id: "centeroo-bonnaroots",
			mapId: "centeroo",
			name: "Bonnaroots",
			shortName: "Bonnaroots",
			type: "food",
			accent: "green",
			x: 52.3,
			y: 59.2,
			w: 4.6,
			h: 2.8,
			description: "Bonnaroots food area near Planet Roo."
		},

		{
			id: "centeroo-how-stage",
			mapId: "centeroo",
			name: "How Stage",
			shortName: "How",
			type: "stage",
			accent: "green",
			x: 55.1,
			y: 55.3,
			w: 4.2,
			h: 2.5,
			description: "How Stage near Main Merch and Planet Roo.",
			scheduleVenueId: "how-stage"
		},

		{
			id: "centeroo-center-waterfall",
			mapId: "centeroo",
			name: "Center Waterfall",
			shortName: "Waterfall",
			type: "landmark",
			accent: "blue",
			x: 59.8,
			y: 43.8,
			w: 6.1,
			h: 7.4,
			description: "Central fountain/waterfall landmark in Centeroo."
		},

		{
			id: "centeroo-vip-mound",
			mapId: "centeroo",
			name: "VIP Mound",
			shortName: "VIP Mound",
			type: "vip",
			accent: "pink",
			x: 2.6,
			y: 23.0,
			w: 8.0,
			h: 3.8,
			description: "VIP Mound on the northwest side of Centeroo."
		},

		{
			id: "centeroo-the-oasis",
			mapId: "centeroo",
			name: "The Oasis",
			shortName: "Oasis",
			type: "landmark",
			accent: "blue",
			x: 80.75,
			y: 69.05,
			w: 5.25,
			h: 2.15,
			description: "The Oasis area near GA+ Lounge and This Tent."
		},

		{
			id: "centeroo-big-ass-waterslide",
			mapId: "centeroo",
			name: "Big Ass Waterslide",
			shortName: "Waterslide",
			type: "landmark",
			accent: "blue",
			x: 80.65,
			y: 71.35,
			w: 10.75,
			h: 2.85,
			description: "Big Ass Waterslide near The Oasis."
		},

		/* =========================
   OUTEROO — CLICKABLE NAMES / SIGNS
   Horizontal map pass.
   Hitboxes are around visible labels/signs, not broad camp zones.
========================= */

		{
			id: "outeroo-quasar-collective",
			mapId: "outeroo",
			name: "Quasar Collective",
			shortName: "Quasar",
			type: "camp",
			accent: "purple",
			x: 18.3,
			y: 19.6,
			w: 6.1,
			h: 5.9,
			description: "Quasar Collective camping area."
		},

		{
			id: "outeroo-west-toll",
			mapId: "outeroo",
			name: "West Toll",
			shortName: "West Toll",
			type: "toll",
			accent: "yellow",
			x: 7.0,
			y: 26.0,
			w: 6.8,
			h: 5.2,
			description: "West Toll entrance on the west side of Outeroo."
		},

		{
			id: "outeroo-roo-galaxy-west",
			mapId: "outeroo",
			name: "Roo GA-Laxy",
			shortName: "GA-Laxy",
			type: "camp",
			accent: "green",
			x: 7.8,
			y: 36.2,
			w: 6.6,
			h: 5.2,
			description: "Roo GA-Laxy camping area on the west side of Outeroo."
		},

		{
			id: "outeroo-groop-galactic",
			mapId: "outeroo",
			name: "Groop Galactic",
			shortName: "Groop",
			type: "camp",
			accent: "blue",
			x: 11.3,
			y: 51.0,
			w: 6.4,
			h: 5.3,
			description: "Groop Galactic camping area."
		},

		{
			id: "outeroo-old-highway-toll",
			mapId: "outeroo",
			name: "Old Highway Toll",
			shortName: "Old Toll",
			type: "toll",
			accent: "yellow",
			x: 14.3,
			y: 64.6,
			w: 6.5,
			h: 7.2,
			description: "Old Highway Toll."
		},

		{
			id: "outeroo-roo-run-start-finish",
			mapId: "outeroo",
			name: "Roo Run Start/Finish",
			shortName: "Roo Run",
			type: "landmark",
			accent: "yellow",
			x: 17.0,
			y: 57.6,
			w: 8.3,
			h: 4.8,
			description: "Roo Run presented by Start/Finish area.",
			scheduleVenueId: "roo-run-start-finish"
		},

		{
			id: "outeroo-plaza-5",
			mapId: "outeroo",
			name: "Plaza 5 - Groop",
			shortName: "5",
			type: "plaza",
			accent: "pink",
			x: 11.7,
			y: 43.8,
			w: 3.4,
			h: 6.2,
			description: "Plaza 5, the Groop plaza area in west Outeroo.",
			scheduleVenueId: "groop-plaza",
			scheduleVenueId: "groop-plaza",
			scheduleVenueId: "groop-plaza"
		},

		{
			id: "outeroo-plaza-6",
			mapId: "outeroo",
			name: "Plaza 6",
			shortName: "6",
			type: "plaza",
			accent: "blue",
			x: 17.2,
			y: 32.8,
			w: 4.1,
			h: 6.0,
			description: "Plaza 6 near Camp Bushyhead."
		},

		{
			id: "outeroo-camp-bushyhead",
			mapId: "outeroo",
			name: "Camp Bushyhead",
			shortName: "Bushyhead",
			type: "camp",
			accent: "green",
			x: 18.6,
			y: 38.6,
			w: 7.8,
			h: 4.7,
			description: "Camp Bushyhead camping area."
		},

		{
			id: "outeroo-cosmic-nomads",
			mapId: "outeroo",
			name: "Cosmic Nomads",
			shortName: "Nomads",
			type: "camp",
			accent: "purple",
			x: 24.4,
			y: 25.5,
			w: 7.0,
			h: 5.5,
			description: "Cosmic Nomads camping area."
		},

		{
			id: "outeroo-mars-colony",
			mapId: "outeroo",
			name: "Mars Colony",
			shortName: "Mars",
			type: "camp",
			accent: "pink",
			x: 24.8,
			y: 32.0,
			w: 6.2,
			h: 6.0,
			description: "Mars Colony camping area."
		},

		{
			id: "outeroo-starship-spaceport",
			mapId: "outeroo",
			name: "Starship Spaceport",
			shortName: "Starship",
			type: "camp",
			accent: "purple",
			x: 20.8,
			y: 51.2,
			w: 8.5,
			h: 5.0,
			description: "Starship Spaceport camping area."
		},

		{
			id: "outeroo-plaza-7",
			mapId: "outeroo",
			name: "Plaza 7 - The Grove",
			shortName: "7",
			type: "plaza",
			accent: "purple",
			x: 28.4,
			y: 39.0,
			w: 3.8,
			h: 7.4,
			description: "Plaza 7, home of The Grove.",
			scheduleVenueId: "the-grove"
		},

		{
			id: "outeroo-camp-burned-23",
			mapId: "outeroo",
			name: "Camp Burned 23",
			shortName: "Burned",
			type: "camp",
			accent: "sunset",
			x: 18.2,
			y: 39.0,
			w: 8.2,
			h: 5.2,
			description: "Camp Burned 23."
		},

		{
			id: "outeroo-the-grove",
			mapId: "outeroo",
			name: "The Grove",
			shortName: "Grove",
			type: "landmark",
			accent: "green",
			x: 34.0,
			y: 42.3,
			w: 5.8,
			h: 5.3,
			description: "The Grove.",
			scheduleVenueId: "the-grove"
		},

		{
			id: "outeroo-plaza-8",
			mapId: "outeroo",
			name: "Plaza 8",
			shortName: "8",
			type: "plaza",
			accent: "yellow",
			x: 36.6,
			y: 17.9,
			w: 3.7,
			h: 7.0,
			description: "Plaza 8 near Roo GA-Laxy."
		},

		{
			id: "outeroo-roo-galaxy",
			mapId: "outeroo",
			name: "Roo GA-Laxy",
			shortName: "GA-Laxy",
			type: "camp",
			accent: "green",
			x: 46.3,
			y: 23.3,
			w: 6.0,
			h: 5.4,
			description: "Roo GA-Laxy camping area near Plaza 8."
		},

		{
			id: "outeroo-east-toll",
			mapId: "outeroo",
			name: "East Toll",
			shortName: "East Toll",
			type: "toll",
			accent: "yellow",
			x: 64.8,
			y: 31.8,
			w: 6.8,
			h: 5.7,
			description: "East Toll."
		},

		{
			id: "outeroo-plaza-4",
			mapId: "outeroo",
			name: "Plaza 4",
			shortName: "4",
			type: "plaza",
			accent: "blue",
			x: 31.1,
			y: 51.6,
			w: 4.0,
			h: 6.8,
			description: "Plaza 4 near Base Camp."
		},

		{
			id: "outeroo-base-camp",
			mapId: "outeroo",
			name: "Base Camp",
			shortName: "Base",
			type: "camp",
			accent: "yellow",
			x: 33.0,
			y: 52.0,
			w: 5.5,
			h: 5.2,
			description: "Base Camp."
		},

		{
			id: "outeroo-plaza-3",
			mapId: "outeroo",
			name: "Plaza 3 - When Barn",
			shortName: "3",
			type: "plaza",
			accent: "sunset",
			x: 41.6,
			y: 47.4,
			w: 4.0,
			h: 6.9,
			description: "Plaza 3, the When Barn plaza area near central camping.",
			scheduleVenueId: "when-barn"
		},

		{
			id: "outeroo-when-barn",
			mapId: "outeroo",
			name: "When? Barn",
			shortName: "When Barn",
			type: "plaza",
			accent: "sunset",
			x: 71.6,
			y: 70.2,
			w: 5.4,
			h: 3.5,
			description: "When? Barn, the Plaza 3 barn."
		},

		{
			id: "outeroo-plaza-2",
			mapId: "outeroo",
			name: "Plaza 2 - Why Barn",
			shortName: "2",
			type: "plaza",
			accent: "blue",
			x: 54.1,
			y: 52.3,
			w: 4.1,
			h: 6.9,
			description: "Plaza 2, the Why Barn plaza area on the east side of Outeroo.",
			scheduleVenueId: "why-barn"
		},

		{
			id: "outeroo-why-barn",
			mapId: "outeroo",
			name: "Why? Barn",
			shortName: "Why Barn",
			type: "plaza",
			accent: "blue",
			x: 63.0,
			y: 70.2,
			w: 5.2,
			h: 3.5,
			description: "Why? Barn, the Plaza 2 barn."
		},

		{
			id: "outeroo-plaza-1",
			mapId: "outeroo",
			name: "Plaza 1",
			shortName: "1",
			type: "plaza",
			accent: "blue",
			x: 43.5,
			y: 67.6,
			w: 4.2,
			h: 7.4,
			description: "Plaza 1 near The Woods."
		},

		{
			id: "outeroo-moon-colony",
			mapId: "outeroo",
			name: "Moon Colony",
			shortName: "Moon",
			type: "camp",
			accent: "blue",
			x: 44.4,
			y: 60.6,
			w: 5.5,
			h: 5.8,
			description: "Moon Colony camping area."
		},

		{
			id: "outeroo-the-woods",
			mapId: "outeroo",
			name: "The Woods",
			shortName: "Woods",
			type: "landmark",
			accent: "green",
			x: 50.0,
			y: 64.2,
			w: 6.2,
			h: 12.2,
			description: "The Woods."
		},

		{
			id: "outeroo-plaza-9",
			mapId: "outeroo",
			name: "Plaza 9 - Silent Disco",
			shortName: "9",
			type: "plaza",
			accent: "green",
			x: 40.15,
			y: 24.25,
			w: 4.65,
			h: 7.3,
			description: "Plaza 9 near Plaza 8 and Roo GA-Laxy on the main Outeroo map.",
			scheduleVenueId: "silent-disco"
		},

		{
			id: "outeroo-silent-disco",
			mapId: "outeroo",
			name: "Silent Disco",
			shortName: "Silent Disco",
			type: "landmark",
			accent: "green",
			x: 70.2,
			y: 91.0,
			w: 7.0,
			h: 3.6,
			description: "Silent Disco presented by Xyal."
		},

		{
			id: "outeroo-the-other-stage",
			mapId: "outeroo",
			name: "The Other Stage",
			shortName: "Other",
			type: "stage",
			accent: "yellow",
			x: 24.2,
			y: 61.3,
			w: 7.0,
			h: 5.8,
			description: "The Other Stage label shown near the lower Centeroo edge on the Outeroo map.",
			scheduleVenueId: "the-other-stage"
		},

		{
			id: "outeroo-bonnies-broos",
			mapId: "outeroo",
			name: "Bonnie Roo’s Broos",
			shortName: "Broos",
			type: "food",
			accent: "blue",
			x: 30.2,
			y: 60.7,
			w: 4.8,
			h: 4.8,
			description: "Bonnie Roo’s Broos label shown near the Centeroo edge on the Outeroo map."
		},

		{
			id: "outeroo-how-stage",
			mapId: "outeroo",
			name: "How Stage",
			shortName: "How",
			type: "stage",
			accent: "green",
			x: 27.6,
			y: 66.6,
			w: 5.2,
			h: 3.9,
			description: "How Stage label shown near the lower Centeroo edge.",
			scheduleVenueId: "how-stage"
		},

		{
			id: "outeroo-centeroo",
			mapId: "outeroo",
			name: "Centeroo",
			shortName: "Centeroo",
			type: "landmark",
			accent: "green",
			x: 30.9,
			y: 73.4,
			w: 7.5,
			h: 3.4,
			description: "Centeroo label shown along the lower edge of the Outeroo map."
		},

		{
			id: "outeroo-this-tent",
			mapId: "outeroo",
			name: "This Tent",
			shortName: "This",
			type: "tent",
			accent: "pink",
			x: 25.2,
			y: 73.5,
			w: 4.9,
			h: 4.7,
			description: "This Tent label shown at the lower Centeroo edge.",
			scheduleVenueId: "this-tent"
		},

		{
			id: "outeroo-that-tent",
			mapId: "outeroo",
			name: "That Tent",
			shortName: "That",
			type: "tent",
			accent: "green",
			x: 39.1,
			y: 75.0,
			w: 4.9,
			h: 4.8,
			description: "That Tent label shown at the lower Centeroo edge.",
			scheduleVenueId: "that-tent"
		},

		{
			id: "outeroo-where-stage",
			mapId: "outeroo",
			name: "Where Stage",
			shortName: "Where",
			type: "stage",
			accent: "purple",
			x: 25.9,
			y: 79.2,
			w: 5.3,
			h: 5.1,
			description: "Where Stage label shown near the lower Centeroo edge.",
			scheduleVenueId: "where-stage"
		},

		{
			id: "outeroo-which-stage",
			mapId: "outeroo",
			name: "Which Stage",
			shortName: "Which",
			type: "stage",
			accent: "blue",
			x: 31.9,
			y: 79.2,
			w: 5.5,
			h: 5.1,
			description: "Which Stage label shown at the lower Centeroo edge.",
			scheduleVenueId: "which-stage"
		},

		{
			id: "outeroo-what-stage",
			mapId: "outeroo",
			name: "What Stage",
			shortName: "What",
			type: "stage",
			accent: "sunset",
			x: 36.0,
			y: 85.8,
			w: 6.8,
			h: 5.3,
			description: "What Stage label shown at the lower Centeroo edge on the Outeroo map.",
			scheduleVenueId: "what-stage"
		},

		{
			id: "outeroo-area-931",
			mapId: "outeroo",
			name: "Area 931",
			shortName: "Area 931",
			type: "camp",
			accent: "purple",
			x: 30.3,
			y: 87.0,
			w: 6.2,
			h: 5.7,
			description: "Area 931 label shown near the lower Centeroo edge."
		},

		{
			id: "outeroo-area-931-toll",
			mapId: "outeroo",
			name: "Area 931 Toll",
			shortName: "931 Toll",
			type: "toll",
			accent: "yellow",
			x: 20.6,
			y: 88.4,
			w: 6.3,
			h: 5.5,
			description: "Area 931 Toll."
		},

		{
			id: "outeroo-the-arch-entrance",
			mapId: "outeroo",
			name: "The Arch Entrance",
			shortName: "Arch",
			type: "entrance",
			accent: "yellow",
			x: 35.6,
			y: 60.9,
			w: 5.1,
			h: 7.4,
			description: "The Arch Entrance rainbow landmark shown on the Outeroo map."
		},

		{
			id: "outeroo-the-tower-entrance",
			mapId: "outeroo",
			name: "The Tower Entrance",
			shortName: "Tower",
			type: "entrance",
			accent: "yellow",
			x: 62.6,
			y: 78.0,
			w: 7.6,
			h: 6.3,
			description: "The Tower Entrance label shown on the Outeroo map."
		},

		{
			id: "outeroo-locate-your-campsite",
			mapId: "outeroo",
			name: "Locate Your Campsite",
			shortName: "Campsite Help",
			type: "info",
			accent: "green",
			x: 1.7,
			y: 88.0,
			w: 19.2,
			h: 9.4,
			description: "Outeroo campsite locating instructions."
		},

		{
			id: "outeroo-around-the-farm",
			mapId: "outeroo",
			name: "Around The Farm",
			shortName: "Around Farm",
			type: "landmark",
			accent: "purple",
			x: 62.2,
			y: 56.7,
			w: 16.5,
			h: 9.5,
			description: "Around The Farm locations."
		},

		{
			id: "outeroo-around-farm-this-must-be-the-place",
			mapId: "outeroo",
			name: "This Must Be The Place",
			shortName: "Place",
			type: "landmark",
			accent: "purple",
			x: 70.2,
			y: 57.3,
			w: 7.5,
			h: 2.3,
			description: "Around the Farm location: This Must Be The Place."
		},

		{
			id: "outeroo-around-farm-elove-electrolyte-lounge",
			mapId: "outeroo",
			name: "E Love Electrolyte Lounge",
			shortName: "E Love",
			type: "lounge",
			accent: "purple",
			x: 70.2,
			y: 59.5,
			w: 7.5,
			h: 2.3,
			description: "Around the Farm location: E Love Electrolyte Lounge."
		},

		{
			id: "outeroo-around-farm-beauty-roo-five-below",
			mapId: "outeroo",
			name: "Beauty Roo by Five Below",
			shortName: "Beauty Roo",
			type: "landmark",
			accent: "purple",
			x: 70.2,
			y: 61.7,
			w: 7.5,
			h: 2.3,
			description: "Around the Farm location: Beauty Roo by Five Below."
		}
	],

	/* =====================================================
	   AMENITY MARKERS
	   Disabled on purpose.
	   The map image already includes official amenity icons.
	   Save Spot can be used anywhere for bathrooms, water, food, camp, etc.
	===================================================== */

	amenities: [],

	/* =====================================================
	   REAL SCHEDULE GOES HERE NEXT.
	   The app can already consume this format.
	===================================================== */
	events: [
		{ "id": "wed-groop-totem-purple-carpet", "artist": "TOTEM Purple Carpet", "day": "Wednesday", "start": "16:30", "end": "17:00", "venueId": "groop-plaza" },
		{ "id": "wed-groop-birdranger", "artist": "Birdranger", "day": "Wednesday", "start": "17:00", "end": "17:30", "venueId": "groop-plaza" },
		{ "id": "wed-groop-hypno", "artist": "Hypno", "day": "Wednesday", "start": "17:30", "end": "18:00", "venueId": "groop-plaza" },
		{ "id": "wed-groop-vine-iii", "artist": "Vine-III", "day": "Wednesday", "start": "18:00", "end": "18:30", "venueId": "groop-plaza" },
		{ "id": "wed-groop-valleria", "artist": "Valleria", "day": "Wednesday", "start": "18:30", "end": "19:00", "venueId": "groop-plaza" },
		{ "id": "wed-groop-ravedad", "artist": "Ravedad", "day": "Wednesday", "start": "19:00", "end": "19:30", "venueId": "groop-plaza" },
		{ "id": "wed-groop-shakedown-six", "artist": "Shakedown Six", "day": "Wednesday", "start": "19:30", "end": "20:30", "venueId": "groop-plaza" },
		{ "id": "wed-groop-lsdaniel", "artist": "LSDaniel", "day": "Wednesday", "start": "20:30", "end": "21:00", "venueId": "groop-plaza" },
		{ "id": "wed-groop-susto", "artist": "Susto", "day": "Wednesday", "start": "21:00", "end": "22:15", "venueId": "groop-plaza" },
		{ "id": "wed-groop-the-snozzberries", "artist": "The Snozzberries", "day": "Wednesday", "start": "22:15", "end": "23:00", "venueId": "groop-plaza" },
		{ "id": "wed-groop-majora", "artist": "Majora", "day": "Wednesday", "start": "23:00", "end": "23:45", "venueId": "groop-plaza" },
		{ "id": "wed-groop-fractal-bloom", "artist": "Fractal Bloom", "day": "Wednesday", "start": "23:45", "end": "24:30", "venueId": "groop-plaza" },
		{ "id": "wed-groop-question-marks", "artist": "?????", "day": "Wednesday", "start": "24:30", "end": "25:45", "venueId": "groop-plaza" },
		{ "id": "wed-groop-hyst", "artist": "HYST.", "day": "Wednesday", "start": "25:45", "end": "26:30", "venueId": "groop-plaza" },

		{ "id": "thu-what-spiritual-cramp", "artist": "Spiritual Cramp", "day": "Thursday", "start": "17:30", "end": "18:30", "venueId": "what-stage" },
		{ "id": "thu-what-vince-staples", "artist": "Vince Staples", "day": "Thursday", "start": "19:00", "end": "20:00", "venueId": "what-stage" },
		{ "id": "thu-what-four-tet", "artist": "Four Tet", "day": "Thursday", "start": "20:30", "end": "22:00", "venueId": "what-stage" },
		{ "id": "thu-what-skrillex", "artist": "Skrillex", "day": "Thursday", "start": "22:30", "end": "24:00", "venueId": "what-stage" },

		{ "id": "thu-groop-tobacco-road", "artist": "Tobacco Road", "day": "Thursday", "start": "11:30", "end": "11:55", "venueId": "groop-plaza" },
		{ "id": "thu-groop-allegory", "artist": "Allegory", "day": "Thursday", "start": "12:10", "end": "12:35", "venueId": "groop-plaza" },
		{ "id": "thu-groop-meadowglade", "artist": "Meadowglade", "day": "Thursday", "start": "12:50", "end": "13:15", "venueId": "groop-plaza" },
		{ "id": "thu-groop-michael-alan-scott", "artist": "Michael Alan Scott", "day": "Thursday", "start": "13:30", "end": "13:55", "venueId": "groop-plaza" },
		{ "id": "thu-groop-prince-of-eden", "artist": "Prince of Eden", "day": "Thursday", "start": "14:10", "end": "14:40", "venueId": "groop-plaza" },
		{ "id": "thu-groop-disappearing-teeth-trick", "artist": "Disappearing Teeth Trick", "day": "Thursday", "start": "15:00", "end": "15:30", "venueId": "groop-plaza" },
		{ "id": "thu-groop-mercury", "artist": "Mercury", "day": "Thursday", "start": "15:50", "end": "16:25", "venueId": "groop-plaza" },
		{ "id": "thu-groop-druzin", "artist": "Druzin", "day": "Thursday", "start": "16:45", "end": "17:30", "venueId": "groop-plaza" },
		{ "id": "thu-groop-totem-catio", "artist": "TOTEM Thursday Takeover: CATIO", "day": "Thursday", "start": "24:15", "end": "25:00", "venueId": "groop-plaza" },
		{ "id": "thu-groop-totem-future-joy", "artist": "TOTEM Thursday Takeover: Future Joy", "day": "Thursday", "start": "25:00", "end": "26:00", "venueId": "groop-plaza" },
		{ "id": "thu-groop-totem-question-marks", "artist": "TOTEM Thursday Takeover: ???", "day": "Thursday", "start": "26:00", "end": "27:00", "venueId": "groop-plaza" },
		{ "id": "thu-silent-disco-heelturn-madspinnz", "artist": "HEELTURN X MADSPINNZ", "day": "Thursday", "start": "24:00", "end": "28:00", "venueId": "silent-disco" },
		{ "id": "thu-grove-soundscape-harmony-solarium", "artist": "Soundscape Harmony with Solarium", "day": "Thursday", "start": "26:30", "end": "28:00", "venueId": "the-grove" },
		{ "id": "thu-why-wishing-fish-five-waters", "artist": "Wishing Fish and the Five Waters", "day": "Thursday", "start": "26:00", "end": "29:00", "venueId": "why-barn" },
		{ "id": "thu-when-route-69", "artist": "Route 69 with House of Yes & Ultra Violet", "day": "Thursday", "start": "27:00", "end": "30:00", "venueId": "when-barn" },

		{ "id": "thu-how-pitch-meeting-kickoff", "artist": "Pitch Meeting Kickoff!", "day": "Thursday", "start": "13:15", "end": "14:30", "venueId": "how-stage" },
		{ "id": "thu-how-planet-roo-party", "artist": "Planet Roo Party", "day": "Thursday", "start": "14:30", "end": "15:50", "venueId": "how-stage" },
		{ "id": "thu-how-bonnaroo-amplified", "artist": "Bonnaroo Amplified: Where Music Meets Mission Featuring The What Podcast", "day": "Thursday", "start": "16:00", "end": "17:30", "venueId": "how-stage" },
		{ "id": "thu-how-birds-nest-first-flight", "artist": "Bird’s Nest First Flight", "day": "Thursday", "start": "17:00", "end": "19:30", "venueId": "how-stage" },
		{ "id": "thu-how-kitchen-karaoke", "artist": "Kitchen Karaoke for a Cause", "day": "Thursday", "start": "18:30", "end": "19:30", "venueId": "how-stage" },

		{ "id": "thu-academy-welcome-to-roo", "artist": "Welcome to Roo! Get the 101 with the TOTEM Foundation", "day": "Thursday", "start": "13:30", "end": "14:25", "venueId": "the-academy" },
		{ "id": "thu-academy-rooconnect-well-dunn", "artist": "ROOconnect: Meet and Connect with Bonnaroovians IRL with Well Dunn", "day": "Thursday", "start": "14:30", "end": "15:30", "venueId": "the-academy" },
		{ "id": "thu-academy-lost-found-totems", "artist": "Lost + Found: Create Totems with TOTEM Foundation", "day": "Thursday", "start": "16:00", "end": "16:45", "venueId": "the-academy" },
		{ "id": "thu-academy-building-with-purpose", "artist": "Building with Purpose with Habitat for Humanity", "day": "Thursday", "start": "17:00", "end": "17:45", "venueId": "the-academy" },

		{ "id": "fri-what-villanelle", "artist": "Villanelle", "day": "Friday", "start": "13:45", "end": "14:30", "venueId": "what-stage" },
		{ "id": "fri-what-amble", "artist": "Amble", "day": "Friday", "start": "15:15", "end": "16:00", "venueId": "what-stage" },
		{ "id": "fri-what-blues-traveler", "artist": "Blues Traveler", "day": "Friday", "start": "16:45", "end": "17:45", "venueId": "what-stage" },
		{ "id": "fri-what-yungblud", "artist": "Yungblud", "day": "Friday", "start": "18:45", "end": "19:45", "venueId": "what-stage" },
		{ "id": "fri-what-griz", "artist": "GRiZ", "day": "Friday", "start": "20:45", "end": "22:00", "venueId": "what-stage" },
		{ "id": "fri-what-the-strokes", "artist": "The Strokes", "day": "Friday", "start": "23:00", "end": "24:15", "venueId": "what-stage" },

		{ "id": "fri-which-lambrini-girls", "artist": "Lambrini Girls", "day": "Friday", "start": "13:15", "end": "14:00", "venueId": "which-stage" },
		{ "id": "fri-which-wolfmother", "artist": "Wolfmother", "day": "Friday", "start": "14:30", "end": "15:15", "venueId": "which-stage" },
		{ "id": "fri-which-bbnos", "artist": "bbno$", "day": "Friday", "start": "16:00", "end": "17:00", "venueId": "which-stage" },
		{ "id": "fri-which-wet-leg", "artist": "Wet Leg", "day": "Friday", "start": "18:00", "end": "19:00", "venueId": "which-stage" },
		{ "id": "fri-which-jessie-murph", "artist": "Jessie Murph", "day": "Friday", "start": "20:00", "end": "21:00", "venueId": "which-stage" },
		{ "id": "fri-which-mt-joy", "artist": "Mt. Joy", "day": "Friday", "start": "22:00", "end": "23:00", "venueId": "which-stage" },
		{ "id": "fri-which-turnstile", "artist": "Turnstile", "day": "Friday", "start": "24:30", "end": "25:45", "venueId": "which-stage" },

		{ "id": "fri-this-pawpaw-rod", "artist": "Pawpaw Rod", "day": "Friday", "start": "13:30", "end": "14:15", "venueId": "this-tent" },
		{ "id": "fri-this-goldie-boutilier", "artist": "Goldie Boutilier", "day": "Friday", "start": "14:45", "end": "15:30", "venueId": "this-tent" },
		{ "id": "fri-this-rachel-chinouriri", "artist": "Rachel Chinouriri", "day": "Friday", "start": "16:15", "end": "17:15", "venueId": "this-tent" },
		{ "id": "fri-this-mother-mother", "artist": "Mother Mother", "day": "Friday", "start": "18:00", "end": "19:00", "venueId": "this-tent" },
		{ "id": "fri-this-smino", "artist": "Smino", "day": "Friday", "start": "19:45", "end": "20:45", "venueId": "this-tent" },
		{ "id": "fri-this-hot-mulligan", "artist": "Hot Mulligan", "day": "Friday", "start": "21:30", "end": "22:30", "venueId": "this-tent" },
		{ "id": "fri-this-the-dare", "artist": "The Dare", "day": "Friday", "start": "25:30", "end": "26:45", "venueId": "this-tent" },

		{ "id": "fri-that-dora-jar", "artist": "Dora Jar", "day": "Friday", "start": "13:00", "end": "13:45", "venueId": "that-tent" },
		{ "id": "fri-that-wednesday", "artist": "Wednesday", "day": "Friday", "start": "14:30", "end": "15:15", "venueId": "that-tent" },
		{ "id": "fri-that-the-chats", "artist": "The Chats", "day": "Friday", "start": "16:00", "end": "16:45", "venueId": "that-tent" },
		{ "id": "fri-that-zack-fox", "artist": "Zack Fox", "day": "Friday", "start": "17:45", "end": "18:45", "venueId": "that-tent" },
		{ "id": "fri-that-geese", "artist": "Geese", "day": "Friday", "start": "19:45", "end": "20:45", "venueId": "that-tent" },
		{ "id": "fri-that-blood-orange", "artist": "Blood Orange", "day": "Friday", "start": "22:00", "end": "23:00", "venueId": "that-tent" },
		{ "id": "fri-that-lil-jon", "artist": "Lil Jon", "day": "Friday", "start": "24:15", "end": "25:30", "venueId": "that-tent" },

		{ "id": "fri-other-jackie-hollander", "artist": "Jackie Hollander", "day": "Friday", "start": "16:00", "end": "17:00", "venueId": "the-other-stage" },
		{ "id": "fri-other-daniel-allan", "artist": "Daniel Allan", "day": "Friday", "start": "17:15", "end": "18:15", "venueId": "the-other-stage" },
		{ "id": "fri-other-laszewo", "artist": "Łaszewo", "day": "Friday", "start": "18:30", "end": "19:30", "venueId": "the-other-stage" },
		{ "id": "fri-other-notion", "artist": "NOTION", "day": "Friday", "start": "19:45", "end": "20:45", "venueId": "the-other-stage" },
		{ "id": "fri-other-adventure-club", "artist": "Adventure Club", "day": "Friday", "start": "21:00", "end": "22:00", "venueId": "the-other-stage" },
		{ "id": "fri-other-sidepiece", "artist": "SIDEPIECE", "day": "Friday", "start": "22:15", "end": "23:15", "venueId": "the-other-stage" },
		{ "id": "fri-other-cloonee", "artist": "Cloonee", "day": "Friday", "start": "24:00", "end": "25:00", "venueId": "the-other-stage" },
		{ "id": "fri-other-major-lazer", "artist": "Major Lazer", "day": "Friday", "start": "25:30", "end": "26:30", "venueId": "the-other-stage" },
		{ "id": "fri-other-ganja-white-night", "artist": "Ganja White Night", "day": "Friday", "start": "26:45", "end": "28:00", "venueId": "the-other-stage" },
		{ "id": "fri-other-inzo", "artist": "INZO (Sunrise Set)", "day": "Friday", "start": "28:15", "end": "29:30", "venueId": "the-other-stage" },

		{ "id": "fri-where-probcause", "artist": "Probcause", "day": "Friday", "start": "23:15", "end": "24:00", "venueId": "where-stage" },
		{ "id": "fri-where-mary-droppinz", "artist": "Mary Droppinz", "day": "Friday", "start": "26:15", "end": "27:00", "venueId": "where-stage" },
		{ "id": "fri-where-richard-finger", "artist": "Richard Finger", "day": "Friday", "start": "27:15", "end": "28:00", "venueId": "where-stage" },
		{ "id": "fri-where-eazybaked", "artist": "Eazybaked", "day": "Friday", "start": "28:15", "end": "29:00", "venueId": "where-stage" },
		{ "id": "fri-where-lumasi", "artist": "Lumasi", "day": "Friday", "start": "29:15", "end": "30:00", "venueId": "where-stage" },

		{ "id": "sat-roo-run-5k", "artist": "Roo Run 5K", "day": "Saturday", "start": "9:00", "end": "10:00", "venueId": "roo-run-start-finish" },
		{ "id": "sat-what-midnight-generation", "artist": "Midnight Generation", "day": "Saturday", "start": "13:45", "end": "14:30", "venueId": "what-stage" },
		{ "id": "sat-what-arcy-drive", "artist": "Arcy Drive", "day": "Saturday", "start": "15:15", "end": "16:00", "venueId": "what-stage" },
		{ "id": "sat-what-tash-sultana", "artist": "Tash Sultana", "day": "Saturday", "start": "16:45", "end": "17:45", "venueId": "what-stage" },
		{ "id": "sat-what-alabama-shakes", "artist": "Alabama Shakes", "day": "Saturday", "start": "18:45", "end": "19:45", "venueId": "what-stage" },
		{ "id": "sat-what-the-neighbourhood", "artist": "The Neighbourhood", "day": "Saturday", "start": "20:45", "end": "22:00", "venueId": "what-stage" },
		{ "id": "sat-what-rufus-du-sol", "artist": "RÜFÜS DU SOL", "day": "Saturday", "start": "23:10", "end": "24:40", "venueId": "what-stage" },

		{ "id": "sat-which-steph-strings", "artist": "Steph Strings", "day": "Saturday", "start": "13:15", "end": "14:00", "venueId": "which-stage" },
		{ "id": "sat-which-mountain-grass-unit", "artist": "Mountain Grass Unit", "day": "Saturday", "start": "14:30", "end": "15:15", "venueId": "which-stage" },
		{ "id": "sat-which-holly-humberstone", "artist": "Holly Humberstone", "day": "Saturday", "start": "16:00", "end": "17:00", "venueId": "which-stage" },
		{ "id": "sat-which-amyl-and-the-sniffers", "artist": "Amyl and the Sniffers", "day": "Saturday", "start": "17:45", "end": "18:45", "venueId": "which-stage" },
		{ "id": "sat-which-rainbow-kitten-surprise", "artist": "Rainbow Kitten Surprise", "day": "Saturday", "start": "19:45", "end": "20:45", "venueId": "which-stage" },
		{ "id": "sat-which-teddy-swims", "artist": "Teddy Swims", "day": "Saturday", "start": "21:45", "end": "23:00", "venueId": "which-stage" },
		{ "id": "sat-which-weird-al-yankovic", "artist": "\"Weird Al\" Yankovic", "day": "Saturday", "start": "24:40", "end": "26:10", "venueId": "which-stage" },

		{ "id": "sat-this-sunami", "artist": "Sunami", "day": "Saturday", "start": "12:45", "end": "13:30", "venueId": "this-tent" },
		{ "id": "sat-this-congress-the-band", "artist": "Congress The Band", "day": "Saturday", "start": "14:00", "end": "14:45", "venueId": "this-tent" },
		{ "id": "sat-this-waylon-wyatt", "artist": "Waylon Wyatt", "day": "Saturday", "start": "15:30", "end": "16:15", "venueId": "this-tent" },
		{ "id": "sat-this-the-runarounds", "artist": "The Runarounds", "day": "Saturday", "start": "17:00", "end": "18:00", "venueId": "this-tent" },
		{ "id": "sat-this-passion-pit", "artist": "Passion Pit", "day": "Saturday", "start": "18:45", "end": "19:45", "venueId": "this-tent" },
		{ "id": "sat-this-superjam-esoterica", "artist": "Kesha Presents: Superjam Esoterica — The Alchemy of Pop", "day": "Saturday", "start": "20:45", "end": "22:30", "venueId": "this-tent" },
		{ "id": "sat-this-osees", "artist": "Osees", "day": "Saturday", "start": "24:30", "end": "25:30", "venueId": "this-tent" },
		{ "id": "sat-this-snow-strippers", "artist": "Snow Strippers", "day": "Saturday", "start": "26:00", "end": "26:45", "venueId": "this-tent" },

		{ "id": "sat-that-the-stews", "artist": "The Stews", "day": "Saturday", "start": "13:00", "end": "13:45", "venueId": "that-tent" },
		{ "id": "sat-that-confidence-man", "artist": "Confidence Man", "day": "Saturday", "start": "14:30", "end": "15:15", "venueId": "that-tent" },
		{ "id": "sat-that-trixie-mattel", "artist": "Trixie Mattel", "day": "Saturday", "start": "16:00", "end": "16:45", "venueId": "that-tent" },
		{ "id": "sat-that-wyatt-flores", "artist": "Wyatt Flores", "day": "Saturday", "start": "17:45", "end": "18:45", "venueId": "that-tent" },
		{ "id": "sat-that-sg-lewis", "artist": "SG Lewis", "day": "Saturday", "start": "19:45", "end": "20:45", "venueId": "that-tent" },
		{ "id": "sat-that-flipturn", "artist": "flipturn", "day": "Saturday", "start": "22:00", "end": "23:00", "venueId": "that-tent" },
		{ "id": "sat-that-freddie-gibbs-alchemist", "artist": "Freddie Gibbs & The Alchemist", "day": "Saturday", "start": "24:50", "end": "26:05", "venueId": "that-tent" },

		{ "id": "sat-other-nikita-the-wicked", "artist": "Nikita, The Wicked", "day": "Saturday", "start": "15:45", "end": "16:45", "venueId": "the-other-stage" },
		{ "id": "sat-other-juelz", "artist": "Juelz", "day": "Saturday", "start": "17:00", "end": "18:00", "venueId": "the-other-stage" },
		{ "id": "sat-other-deathpact", "artist": "Deathpact", "day": "Saturday", "start": "18:15", "end": "19:15", "venueId": "the-other-stage" },
		{ "id": "sat-other-boys-noize", "artist": "Boys Noize", "day": "Saturday", "start": "19:30", "end": "20:30", "venueId": "the-other-stage" },
		{ "id": "sat-other-sub-focus", "artist": "Sub Focus", "day": "Saturday", "start": "20:45", "end": "21:45", "venueId": "the-other-stage" },
		{ "id": "sat-other-sara-landry", "artist": "Sara Landry", "day": "Saturday", "start": "22:00", "end": "23:00", "venueId": "the-other-stage" },
		{ "id": "sat-other-chase-status", "artist": "Chase & Status", "day": "Saturday", "start": "24:40", "end": "25:55", "venueId": "the-other-stage" },
		{ "id": "sat-other-gorgon-city", "artist": "Gorgon City (Sunrise Set)", "day": "Saturday", "start": "26:15", "end": "29:15", "venueId": "the-other-stage" },

		{ "id": "sat-where-steve-cory-are-dead", "artist": "Steve & Cory Are Dead", "day": "Saturday", "start": "18:30", "end": "20:00", "venueId": "where-stage" },
		{ "id": "sat-where-costa", "artist": "Costa", "day": "Saturday", "start": "23:30", "end": "24:15", "venueId": "where-stage" },
		{ "id": "sat-where-clozee", "artist": "CloZee", "day": "Saturday", "start": "26:45", "end": "27:30", "venueId": "where-stage" },
		{ "id": "sat-where-big-gigantic", "artist": "Big Gigantic", "day": "Saturday", "start": "27:45", "end": "28:30", "venueId": "where-stage" },
		{ "id": "sat-where-smoakland", "artist": "Smoakland", "day": "Saturday", "start": "28:45", "end": "29:30", "venueId": "where-stage" },
		{ "id": "sat-where-effin", "artist": "Effin", "day": "Saturday", "start": "29:45", "end": "30:30", "venueId": "where-stage" },

		{ "id": "sun-what-aly-aj", "artist": "Aly & AJ", "day": "Sunday", "start": "14:15", "end": "15:00", "venueId": "what-stage" },
		{ "id": "sun-what-trombone-shorty", "artist": "Trombone Shorty", "day": "Sunday", "start": "15:45", "end": "16:45", "venueId": "what-stage" },
		{ "id": "sun-what-tedeschi-trucks-band", "artist": "Tedeschi Trucks Band", "day": "Sunday", "start": "17:30", "end": "18:30", "venueId": "what-stage" },
		{ "id": "sun-what-role-model", "artist": "Role Model", "day": "Sunday", "start": "19:30", "end": "20:30", "venueId": "what-stage" },
		{ "id": "sun-what-noah-kahan", "artist": "Noah Kahan", "day": "Sunday", "start": "21:30", "end": "23:00", "venueId": "what-stage" },

		{ "id": "sun-which-little-stranger", "artist": "Little Stranger", "day": "Sunday", "start": "13:15", "end": "14:00", "venueId": "which-stage" },
		{ "id": "sun-which-spacey-jane", "artist": "Spacey Jane", "day": "Sunday", "start": "14:45", "end": "15:45", "venueId": "which-stage" },
		{ "id": "sun-which-japanese-breakfast", "artist": "Japanese Breakfast", "day": "Sunday", "start": "16:30", "end": "17:30", "venueId": "which-stage" },
		{ "id": "sun-which-clipse", "artist": "Clipse", "day": "Sunday", "start": "18:30", "end": "19:30", "venueId": "which-stage" },
		{ "id": "sun-which-kesha", "artist": "Kesha", "day": "Sunday", "start": "20:30", "end": "21:30", "venueId": "which-stage" },

		{ "id": "sun-this-nat-myers", "artist": "Nat Myers", "day": "Sunday", "start": "12:30", "end": "13:15", "venueId": "this-tent" },
		{ "id": "sun-this-buffalo-traffic-jam", "artist": "Buffalo Traffic Jam", "day": "Sunday", "start": "13:45", "end": "14:30", "venueId": "this-tent" },
		{ "id": "sun-this-hemlocke-springs", "artist": "Hemlocke Springs", "day": "Sunday", "start": "15:20", "end": "16:00", "venueId": "this-tent" },
		{ "id": "sun-this-fcukers", "artist": "Fcukers", "day": "Sunday", "start": "16:45", "end": "17:45", "venueId": "this-tent" },
		{ "id": "sun-this-turnover", "artist": "Turnover", "day": "Sunday", "start": "18:30", "end": "19:30", "venueId": "this-tent" },
		{ "id": "sun-this-modest-mouse", "artist": "Modest Mouse", "day": "Sunday", "start": "20:15", "end": "21:30", "venueId": "this-tent" },

		{ "id": "sun-that-soupless", "artist": "Soupless", "day": "Sunday", "start": "12:30", "end": "13:00", "venueId": "that-tent" },
		{ "id": "sun-that-girl-tones", "artist": "Girl Tones", "day": "Sunday", "start": "13:30", "end": "14:15", "venueId": "that-tent" },
		{ "id": "sun-that-blondshell", "artist": "Blondshell", "day": "Sunday", "start": "15:00", "end": "15:45", "venueId": "that-tent" },
		{ "id": "sun-that-audrey-hobert", "artist": "Audrey Hobert", "day": "Sunday", "start": "16:45", "end": "17:30", "venueId": "that-tent" },
		{ "id": "sun-that-del-water-gap", "artist": "Del Water Gap", "day": "Sunday", "start": "18:30", "end": "19:30", "venueId": "that-tent" },
		{ "id": "sun-that-mariah-the-scientist", "artist": "Mariah the Scientist", "day": "Sunday", "start": "20:30", "end": "21:30", "venueId": "that-tent" },

		{ "id": "sun-other-motif", "artist": "Motif", "day": "Sunday", "start": "13:45", "end": "14:45", "venueId": "the-other-stage" },
		{ "id": "sun-other-a-hundred-drums", "artist": "A Hundred Drums", "day": "Sunday", "start": "15:00", "end": "16:00", "venueId": "the-other-stage" },
		{ "id": "sun-other-san-holo", "artist": "San Holo", "day": "Sunday", "start": "16:15", "end": "17:15", "venueId": "the-other-stage" },
		{ "id": "sun-other-big-gigantic", "artist": "Big Gigantic", "day": "Sunday", "start": "17:30", "end": "18:30", "venueId": "the-other-stage" },
		{ "id": "sun-other-daily-bread", "artist": "Daily Bread", "day": "Sunday", "start": "18:45", "end": "19:45", "venueId": "the-other-stage" },
		{ "id": "sun-other-lszee", "artist": "LSZEE", "day": "Sunday", "start": "20:15", "end": "21:30", "venueId": "the-other-stage" },

		{ "id": "fri-why-bend-zen-yoga", "artist": "Bend & Zen Yoga: Glow Yoga Flow", "day": "Friday", "start": "10:00", "end": "11:00", "venueId": "why-barn" },
		{ "id": "fri-why-journal-making", "artist": "Journal Making with The Bodom Knob", "day": "Friday", "start": "11:00", "end": "13:00", "venueId": "why-barn" },
		{ "id": "fri-why-narcan-training", "artist": "Narcan Training with TNHMP", "day": "Friday", "start": "14:00", "end": "15:00", "venueId": "why-barn" },
		{ "id": "fri-why-sock-puppet-making", "artist": "Sock Puppet Making Workshop with Cattywampus", "day": "Friday", "start": "15:00", "end": "18:00", "venueId": "why-barn" },
		{ "id": "fri-why-wishing-fish-five-waters", "artist": "Wishing Fish and the Five Waters", "day": "Friday", "start": "26:00", "end": "29:00", "venueId": "why-barn" },

		{ "id": "fri-when-narcan-training", "artist": "Narcan Training with Thisp", "day": "Friday", "start": "11:00", "end": "12:00", "venueId": "when-barn" },
		{ "id": "fri-when-space-casino", "artist": "Space Casino hosted by KRaC Hoggblin Chopper Gang", "day": "Friday", "start": "12:00", "end": "15:00", "venueId": "when-barn" },
		{ "id": "fri-when-mother-roo", "artist": "Mother Roo with House of Yes & Nesty", "day": "Friday", "start": "25:00", "end": "29:00", "venueId": "when-barn" },

		{ "id": "fri-groop-narcan-training-more", "artist": "Narcan Training with More", "day": "Friday", "start": "10:00", "end": "11:00", "venueId": "groop-plaza" },
		{ "id": "fri-groop-redarc", "artist": "Redarc", "day": "Friday", "start": "11:00", "end": "12:00", "venueId": "groop-plaza" },
		{ "id": "fri-groop-crumbsnatchers", "artist": "Crumbsnatchers", "day": "Friday", "start": "12:00", "end": "13:00", "venueId": "groop-plaza" },
		{ "id": "fri-groop-bend-zen-yoga", "artist": "Bend & Zen Yoga: Move & Groove", "day": "Friday", "start": "14:00", "end": "15:00", "venueId": "groop-plaza" },
		{ "id": "fri-groop-fractal-bloom-takeover", "artist": "Fractal Bloom Takeover", "day": "Friday", "start": "15:30", "end": "18:30", "venueId": "groop-plaza" },
		{ "id": "fri-groop-angela-autum", "artist": "Rocknite: Angela Autum", "day": "Friday", "start": "22:00", "end": "22:45", "venueId": "groop-plaza" },
		{ "id": "fri-groop-baby-wave", "artist": "Rocknite: Baby Wave", "day": "Friday", "start": "23:00", "end": "23:45", "venueId": "groop-plaza" },
		{ "id": "fri-groop-the-sewing-club", "artist": "Rocknite: The Sewing Club", "day": "Friday", "start": "24:00", "end": "24:45", "venueId": "groop-plaza" },
		{ "id": "fri-groop-vlad-holiday", "artist": "Rocknite: Vlad Holiday", "day": "Friday", "start": "25:00", "end": "25:45", "venueId": "groop-plaza" },
		{ "id": "fri-groop-body-rooftop", "artist": "Rocknite: Body Rooftop", "day": "Friday", "start": "26:00", "end": "26:45", "venueId": "groop-plaza" },

		{ "id": "fri-silent-camroncho-cestfunk", "artist": "Cam'roncho x C’est Funk", "day": "Friday", "start": "10:00", "end": "14:00", "venueId": "silent-disco" },
		{ "id": "fri-silent-sana-hao", "artist": "Sana x Hao治杂", "day": "Friday", "start": "26:00", "end": "29:00", "venueId": "silent-disco" },

		{ "id": "fri-grove-yomi-paperhand", "artist": "Yomi That Harpist & Paperhand Puppets", "day": "Friday", "start": "10:00", "end": "13:00", "venueId": "the-grove" },
		{ "id": "fri-grove-bend-zen-yoga", "artist": "Bend & Zen Yoga", "day": "Friday", "start": "13:00", "end": "14:00", "venueId": "the-grove" },
		{ "id": "fri-grove-soundscape-evening", "artist": "Soundscape Harmony with Solarium", "day": "Friday", "start": "18:30", "end": "19:30", "venueId": "the-grove" },
		{ "id": "fri-grove-soundscape-late", "artist": "Soundscape Harmony with Solarium", "day": "Friday", "start": "26:30", "end": "28:00", "venueId": "the-grove" },

		{ "id": "fri-snake-air-fire-signs", "artist": "Air & Fire Signs Astrology Readings with Meridian Moors", "day": "Friday", "start": "12:00", "end": "15:00", "venueId": "snake-jakes" },
		{ "id": "fri-snake-this-is-why-single", "artist": "This Is Why We’re Single Talent Show with TB", "day": "Friday", "start": "16:30", "end": "17:30", "venueId": "snake-jakes" },
		{ "id": "fri-snake-geriatrica", "artist": "Geriatrica: Til Death Do Us Party", "day": "Friday", "start": "25:00", "end": "29:00", "venueId": "snake-jakes" },

		{ "id": "sat-why-bend-zen-yoga", "artist": "Bend & Zen Yoga: Glow Yoga Flow", "day": "Saturday", "start": "10:00", "end": "11:00", "venueId": "why-barn" },
		{ "id": "sat-why-bco-art-swap", "artist": "BCO & Art Swap with The Bodom Knob", "day": "Saturday", "start": "11:00", "end": "13:00", "venueId": "why-barn" },
		{ "id": "sat-why-giant-puppet-making", "artist": "Giant Puppet Making 101: Puppet Making Workshop with Cattywampus", "day": "Saturday", "start": "15:00", "end": "18:00", "venueId": "why-barn" },
		{ "id": "sat-why-wishing-fish-five-waters", "artist": "Wishing Fish and the Five Waters", "day": "Saturday", "start": "26:00", "end": "29:00", "venueId": "why-barn" },

		{ "id": "sat-when-leather-baddies", "artist": "Leather Baddies hosted by KRaC Hoggblin Chopper Gang", "day": "Saturday", "start": "12:00", "end": "15:00", "venueId": "when-barn" },
		{ "id": "sat-when-from-dusk-til-dawn", "artist": "From Dusk Til Dawn with House of Yes, Freak Powa & Demonic Disco", "day": "Saturday", "start": "25:00", "end": "29:00", "venueId": "when-barn" },

		{ "id": "sat-groop-drew-morgans-coco-comedy", "artist": "Drew Morgan’s Coco Comedy", "day": "Saturday", "start": "11:00", "end": "12:00", "venueId": "groop-plaza" },
		{ "id": "sat-groop-scopergroove-carnival-games", "artist": "Scopergroove Carnival Games", "day": "Saturday", "start": "12:00", "end": "14:00", "venueId": "groop-plaza" },
		{ "id": "sat-groop-bend-zen-yoga", "artist": "Bend & Zen Yoga: Move & Groove", "day": "Saturday", "start": "14:00", "end": "15:00", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-kiki-cook", "artist": "Rocknite: Kiki Cook", "day": "Saturday", "start": "15:00", "end": "15:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-compo", "artist": "Rocknite: Compo", "day": "Saturday", "start": "16:00", "end": "16:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-will-mae", "artist": "Rocknite: Will Mae", "day": "Saturday", "start": "17:00", "end": "17:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-eva", "artist": "Rocknite: Eva", "day": "Saturday", "start": "18:00", "end": "18:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-total-wife", "artist": "Rocknite: Total Wife", "day": "Saturday", "start": "19:00", "end": "19:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-shes-green", "artist": "Rocknite: She’s Green", "day": "Saturday", "start": "20:00", "end": "20:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-joiner", "artist": "Rocknite: Joiner", "day": "Saturday", "start": "21:00", "end": "21:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-billy", "artist": "Rocknite: Billy", "day": "Saturday", "start": "22:00", "end": "22:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-rocknite-massie", "artist": "Rocknite: Massie", "day": "Saturday", "start": "23:00", "end": "23:45", "venueId": "groop-plaza" },
		{ "id": "sat-groop-emoroo-afterdark", "artist": "EmoRoo Afterdark presented by RooHamm", "day": "Saturday", "start": "25:00", "end": "27:00", "venueId": "groop-plaza" },

		{ "id": "sat-silent-tiger-city-djs", "artist": "Tiger City DJs", "day": "Saturday", "start": "10:00", "end": "14:00", "venueId": "silent-disco" },
		{ "id": "sat-silent-boytoy-jiminy", "artist": "Boytoy x JIMINY Kick-It", "day": "Saturday", "start": "26:00", "end": "29:00", "venueId": "silent-disco" },

		{ "id": "sat-grove-yomi-paperhand", "artist": "Yomi That Harpist & Paperhand Puppets", "day": "Saturday", "start": "10:00", "end": "13:00", "venueId": "the-grove" },
		{ "id": "sat-grove-bend-zen-yoga", "artist": "Bend & Zen Yoga", "day": "Saturday", "start": "13:00", "end": "14:00", "venueId": "the-grove" },
		{ "id": "sat-grove-soundscape-evening", "artist": "Soundscape Harmony with Solarium", "day": "Saturday", "start": "18:30", "end": "19:30", "venueId": "the-grove" },
		{ "id": "sat-grove-soundscape-late", "artist": "Soundscape Harmony with Solarium", "day": "Saturday", "start": "26:30", "end": "28:00", "venueId": "the-grove" },

		{ "id": "sat-snake-water-earth-signs", "artist": "Water & Earth Signs Astrology Readings with Meridian Moors", "day": "Saturday", "start": "12:00", "end": "15:00", "venueId": "snake-jakes" },
		{ "id": "sat-snake-super-soakin", "artist": "Super Soakin’ Wet & Wild Pipe Parade", "day": "Saturday", "start": "15:00", "end": "16:30", "venueId": "snake-jakes" },
		{ "id": "sat-snake-ride-em-cowboy", "artist": "Ride ’Em Cowboy EDM Line Dancing", "day": "Saturday", "start": "16:30", "end": "17:30", "venueId": "snake-jakes" },
		{ "id": "sat-snake-club-felt", "artist": "Club Felt: An Intergalactic Puppet Strip Joint with Songco, Aries, and MC Blue", "day": "Saturday", "start": "23:00", "end": "25:00", "venueId": "snake-jakes" },
		{ "id": "sat-snake-robe-rage", "artist": "Robe Rage with House of Yes and Olio", "day": "Saturday", "start": "25:00", "end": "29:00", "venueId": "snake-jakes" },

		{ "id": "sun-why-wishing-fish-five-waters", "artist": "Wishing Fish and the Five Waters", "day": "Sunday", "start": "26:00", "end": "29:00", "venueId": "why-barn" },
		{ "id": "sun-why-bend-zen-yoga", "artist": "Bend & Zen Yoga: Glow Yoga Flow", "day": "Sunday", "start": "10:00", "end": "11:00", "venueId": "why-barn" },
		{ "id": "sun-why-patch-making", "artist": "Patch Making with The Bodom Knob", "day": "Sunday", "start": "11:00", "end": "13:00", "venueId": "why-barn" },
		{ "id": "sun-why-giant-puppet-parade", "artist": "Giant Puppet Parade with Cattywampus", "day": "Sunday", "start": "13:00", "end": "15:00", "venueId": "why-barn" },

		{ "id": "sun-when-from-dusk-til-dawn", "artist": "From Dusk Til Dawn with House of Yes, Freak Powa & Demonic Disco", "day": "Sunday", "start": "25:00", "end": "29:00", "venueId": "when-barn" },
		{ "id": "sun-when-igrac", "artist": "IGRAC: Hoggblin Chopper Gang’s Ratchet Roadhouse", "day": "Sunday", "start": "12:00", "end": "15:00", "venueId": "when-barn" },

		{ "id": "sun-groop-emoroo-afterdark", "artist": "EmoRoo Afterdark presented by RooHamm", "day": "Sunday", "start": "25:00", "end": "27:00", "venueId": "groop-plaza" },
		{ "id": "sun-groop-the-belonging-co", "artist": "The Belonging Co.", "day": "Sunday", "start": "10:00", "end": "11:00", "venueId": "groop-plaza" },
		{ "id": "sun-groop-mike-sabath", "artist": "Mike Sabath On Top of His Bus", "day": "Sunday", "start": "13:00", "end": "13:50", "venueId": "groop-plaza" },
		{ "id": "sun-groop-bend-zen-yoga", "artist": "Bend & Zen Yoga: Move & Groove", "day": "Sunday", "start": "14:00", "end": "15:00", "venueId": "groop-plaza" },

		{ "id": "sun-silent-boytoy-jiminy", "artist": "Boytoy x JIMINY Kick-It", "day": "Sunday", "start": "26:00", "end": "29:00", "venueId": "silent-disco" },
		{ "id": "sun-silent-chore-boys", "artist": "Chore Boys x N*S*W", "day": "Sunday", "start": "10:00", "end": "14:00", "venueId": "silent-disco" },

		{ "id": "sun-grove-soundscape-late", "artist": "Soundscape Harmony with Solarium", "day": "Sunday", "start": "26:30", "end": "28:00", "venueId": "the-grove" },
		{ "id": "sun-grove-stefan-saxman-paperhand", "artist": "Stefan, Saxman & Paperhand Puppets", "day": "Sunday", "start": "10:00", "end": "13:00", "venueId": "the-grove" },
		{ "id": "sun-grove-bend-zen-yoga", "artist": "Bend & Zen Yoga", "day": "Sunday", "start": "13:00", "end": "14:00", "venueId": "the-grove" },
		{ "id": "sun-grove-soundscape-evening", "artist": "Soundscape Harmony with Solarium", "day": "Sunday", "start": "18:30", "end": "19:30", "venueId": "the-grove" },

		{ "id": "sun-snake-robe-rage", "artist": "Robe Rage with House of Yes and Olio", "day": "Sunday", "start": "25:00", "end": "29:00", "venueId": "snake-jakes" },
		{ "id": "sun-snake-hotdogs-hot-dads", "artist": "Hotdogs & Hot Dads with TB", "day": "Sunday", "start": "12:00", "end": "14:00", "venueId": "snake-jakes" },
		{ "id": "sun-snake-now-karaoke-band", "artist": "Now! Karaoke Band: Heartbreak Hotel", "day": "Sunday", "start": "13:00", "end": "16:00", "venueId": "snake-jakes" },
		{ "id": "sun-snake-lsd-clownsystem", "artist": "LSD Clownsystem: Lovecoil", "day": "Sunday", "start": "21:00", "end": "23:00", "venueId": "snake-jakes" },

		{ "id": "fri-how-rise-and-vibe-yoga", "artist": "Rise and Vibe with Small World Yoga", "day": "Friday", "start": "12:15", "end": "12:55", "venueId": "how-stage" },
		{ "id": "fri-how-can-music-save-the-world", "artist": "Can Music Save the World? Art’s Role in Peacemaking", "day": "Friday", "start": "13:00", "end": "13:50", "venueId": "how-stage" },
		{ "id": "fri-how-roo-works-notes-for-notes", "artist": "Roo Works Cafe Acoustic Featuring Notes for Notes", "day": "Friday", "start": "14:00", "end": "14:25", "venueId": "how-stage" },
		{ "id": "fri-how-beyond-the-ballot", "artist": "Beyond the Ballot: Your Voice, Your Power", "day": "Friday", "start": "14:30", "end": "15:20", "venueId": "how-stage" },
		{ "id": "fri-how-roo-works-pitch-music", "artist": "Roo Works Cafe Acoustic Featuring Pitch Music", "day": "Friday", "start": "15:30", "end": "15:50", "venueId": "how-stage" },
		{ "id": "fri-how-festival-culture-traditions", "artist": "Festival Culture and Traditions", "day": "Friday", "start": "16:00", "end": "17:30", "venueId": "how-stage" },
		{ "id": "fri-how-acoustic-by-the-academy", "artist": "Acoustic By The Academy", "day": "Friday", "start": "17:45", "end": "18:30", "venueId": "how-stage" },
		{ "id": "fri-how-bonnaroots-dinner", "artist": "BonnaROOTS Dinner Performance", "day": "Friday", "start": "18:30", "end": "20:00", "venueId": "how-stage" },

		{ "id": "sat-how-rise-and-vibe-yoga", "artist": "Rise and Vibe with Small World Yoga", "day": "Saturday", "start": "10:00", "end": "10:45", "venueId": "how-stage" },
		{ "id": "sat-how-global-grooves-belly-dancing", "artist": "Global Grooves Dance Class: Belly Dancing", "day": "Saturday", "start": "11:00", "end": "11:45", "venueId": "how-stage" },
		{ "id": "sat-how-consumer-consciousness", "artist": "Consumer Consciousness: How to Match Money to Morals", "day": "Saturday", "start": "12:00", "end": "12:50", "venueId": "how-stage" },
		{ "id": "sat-how-sex-rhythm-rights", "artist": "Sex, Rhythm & Rights", "day": "Saturday", "start": "13:00", "end": "14:00", "venueId": "how-stage" },
		{ "id": "sat-how-5th-woman-on-stage", "artist": "5th Woman on Stage!", "day": "Saturday", "start": "14:00", "end": "15:15", "venueId": "how-stage" },
		{ "id": "sat-how-roo-works-pitch-music", "artist": "Roo Works Cafe Acoustic Featuring Pitch Music", "day": "Saturday", "start": "15:30", "end": "15:50", "venueId": "how-stage" },
		{ "id": "sat-how-behind-the-encore", "artist": "Behind the Encore: Mental Health in the Music Industry Featuring the RooHamm Podcast", "day": "Saturday", "start": "16:00", "end": "17:30", "venueId": "how-stage" },
		{ "id": "sat-how-acoustic-by-the-academy", "artist": "Acoustic By The Academy", "day": "Saturday", "start": "17:45", "end": "18:30", "venueId": "how-stage" },
		{ "id": "sat-how-bonnaroots-dinner", "artist": "BonnaROOTS Dinner Performance", "day": "Saturday", "start": "18:30", "end": "20:00", "venueId": "how-stage" },

		{ "id": "sun-how-rise-and-vibe-yoga", "artist": "Rise and Vibe with Small World Yoga", "day": "Sunday", "start": "10:00", "end": "10:45", "venueId": "how-stage" },
		{ "id": "sun-how-global-grooves-latin-fusion", "artist": "Global Grooves Dance Class: Latin Fusion", "day": "Sunday", "start": "11:00", "end": "11:45", "venueId": "how-stage" },
		{ "id": "sun-how-sustainable-swaps", "artist": "Sustainable Swaps + Sense of Scale Trivia", "day": "Sunday", "start": "12:00", "end": "12:50", "venueId": "how-stage" },
		{ "id": "sun-how-lgbtq-allyship-101", "artist": "LGBTQ+ Allyship 101", "day": "Sunday", "start": "13:00", "end": "13:55", "venueId": "how-stage" },
		{ "id": "sun-how-roo-works-megan-familia", "artist": "Roo Works Cafe Acoustic Featuring Megan Familia", "day": "Sunday", "start": "14:00", "end": "14:25", "venueId": "how-stage" },
		{ "id": "sun-how-community-care-action", "artist": "Community Care in Action", "day": "Sunday", "start": "14:30", "end": "15:20", "venueId": "how-stage" },
		{ "id": "sun-how-roo-works-notes-for-notes", "artist": "Roo Works Cafe Acoustic Featuring Notes for Notes", "day": "Sunday", "start": "15:30", "end": "15:50", "venueId": "how-stage" },
		{ "id": "sun-how-pitch-meeting-finale", "artist": "Pitch Meeting Finale!", "day": "Sunday", "start": "16:00", "end": "17:30", "venueId": "how-stage" },
		{ "id": "sun-how-acoustic-by-the-academy", "artist": "Acoustic By The Academy", "day": "Sunday", "start": "17:45", "end": "18:30", "venueId": "how-stage" },
		{ "id": "sun-how-bonnaroots-dinner", "artist": "BonnaROOTS Dinner Performance", "day": "Sunday", "start": "18:30", "end": "20:00", "venueId": "how-stage" },

		{ "id": "fri-academy-gardening-101", "artist": "Gardening 101 with the National Parks Conservation Association", "day": "Friday", "start": "13:00", "end": "13:45", "venueId": "the-academy" },
		{ "id": "fri-academy-mind-spa-reset", "artist": "Mind Spa: Full Service Reset: Breathwork & Meditation with The Art of Living", "day": "Friday", "start": "14:00", "end": "14:45", "venueId": "the-academy" },
		{ "id": "fri-academy-dog-snuffle-mat", "artist": "Make a Dog Snuffle Mat with Pawster", "day": "Friday", "start": "15:00", "end": "15:45", "venueId": "the-academy" },
		{ "id": "fri-academy-paper-dolls-free-families", "artist": "Paper Dolls to Free Families with Amnesty International", "day": "Friday", "start": "16:00", "end": "16:45", "venueId": "the-academy" },
		{ "id": "fri-academy-daily-roojuventation", "artist": "Daily ROOjuvenation: Meditation Session with The Art of Living", "day": "Friday", "start": "17:00", "end": "17:45", "venueId": "the-academy" },

		{ "id": "sat-academy-letter-writing", "artist": "Impactful Letter Writing with National Parks Conservation Association", "day": "Saturday", "start": "12:00", "end": "12:45", "venueId": "the-academy" },
		{ "id": "sat-academy-festival-headwear", "artist": "Festival Headwear + Flower Crowns with Turnip Green Creative Reuse", "day": "Saturday", "start": "13:00", "end": "13:45", "venueId": "the-academy" },
		{ "id": "sat-academy-breath-break-beats", "artist": "Breath Break Beats Burnout: Breathwork with The Art of Living", "day": "Saturday", "start": "14:00", "end": "14:45", "venueId": "the-academy" },
		{ "id": "sat-academy-repair-fair", "artist": "Repair Fair! with Turnip Green Creative Reuse", "day": "Saturday", "start": "15:00", "end": "15:45", "venueId": "the-academy" },
		{ "id": "sat-academy-safer-music-communities", "artist": "Creating Safer Music Communities with Calling All Crows", "day": "Saturday", "start": "16:00", "end": "16:45", "venueId": "the-academy" },
		{ "id": "sat-academy-daily-roojuventation", "artist": "Daily ROOjuvenation: Meditation Session with The Art of Living", "day": "Saturday", "start": "17:00", "end": "17:45", "venueId": "the-academy" },

		{ "id": "sun-academy-bird-watching", "artist": "Bonnaroo Bird Watching with National Parks Conservation Association", "day": "Sunday", "start": "7:00", "end": "8:00", "venueId": "the-academy" },
		{ "id": "sun-academy-upcycled-bag-weaving", "artist": "Upcycled Bag Weaving with Arts Inside", "day": "Sunday", "start": "12:00", "end": "12:45", "venueId": "the-academy" },
		{ "id": "sun-academy-native-plants", "artist": "Native Plants + Why They Matter with National Parks Conservation Association", "day": "Sunday", "start": "13:00", "end": "13:45", "venueId": "the-academy" },
		{ "id": "sun-academy-mind-spa-reset", "artist": "Mind Spa: Full Service Reset: Breathwork & Meditation with The Art of Living", "day": "Sunday", "start": "14:00", "end": "14:45", "venueId": "the-academy" },
		{ "id": "sun-academy-natural-dreamcatchers", "artist": "Natural Dreamcatchers with Arts Inside", "day": "Sunday", "start": "15:00", "end": "15:45", "venueId": "the-academy" },
		{ "id": "sun-academy-importance-of-pollinators", "artist": "The Importance of Pollinators with TN Environmental Council", "day": "Sunday", "start": "16:00", "end": "16:45", "venueId": "the-academy" },
		{ "id": "sun-academy-daily-roojuventation", "artist": "Daily ROOjuvenation: Meditation Session with The Art of Living", "day": "Sunday", "start": "17:00", "end": "17:45", "venueId": "the-academy" }
	],

	walkTimes: {
		"what-stage|which-stage": 10,
		"which-stage|what-stage": 10,

		"what-stage|that-tent": 12,
		"that-tent|what-stage": 12,

		"what-stage|this-tent": 14,
		"this-tent|what-stage": 14,

		"which-stage|this-tent": 10,
		"this-tent|which-stage": 10,

		"which-stage|that-tent": 9,
		"that-tent|which-stage": 9,

		"this-tent|that-tent": 14,
		"that-tent|this-tent": 14,

		"this-tent|the-other-stage": 6,
		"the-other-stage|this-tent": 6,

		"where-stage|this-tent": 7,
		"this-tent|where-stage": 7,

		"where-stage|the-other-stage": 12,
		"the-other-stage|where-stage": 12
	}
};