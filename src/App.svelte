<script lang="ts">
	import { onMount } from "svelte";
	import Shortcut from "./Shortcut.svelte";
	import { addMediaChangeUpdateManifestListener, updateManifest } from "./manifest.js";

	type App = {
		name: string;
		url: string;
		description: string;
	};

	let columns = 3;
	let screenWidth = 0;
	let jsonError: null | string = null;
	let appList: App[] = [];
	let filterString = "";

	// Update columns based on screen width
	$: {
		if (screenWidth >= 1024) {
			columns = 6;
		} else if (screenWidth >= 720) {
			columns = 4;
		} else {
			columns = 3;
		}
	}

	$: filteredList = (() => {
		// create column
		const list: Array<App[] & { height: number }> = [];
		for (let i = 0; i < columns; i++) {
			const a = [] as any;
			a.height = 0;
			list[i] = a;
		}
		for (const item of appList) {
			if (!item.name.toLowerCase().includes(filterString.toLowerCase())) {
				continue;
			}
			// Find min height column
			let min = 0;
			for (let j = 0; j < columns; j++) {
				if (list[j].height < list[min].height) {
					min = j;
				}
			}
			// Insert
			const column = list[min];
			column.push(item);
			column.height += 10 + Math.floor(item.description.length / 10);
		}
		return list;
	})();

	const handleGoToTop = () => {
		window.scrollTo(0, 0);
	};

	const fetchList = async () => {
		try {
			const res = await fetch("./apps.json");
			appList = await res.json();
		} catch (error) {
			jsonError = "Failed to load app list: " +
				(error instanceof Error ? error.message : "Unknown error");
			console.error("Error fetching app list:", error);
		}
	};

	onMount(() => {
		fetchList();

		// Update screen width on resize
		const updateScreenWidth = () => {
			screenWidth = window.innerWidth;
		};
		updateScreenWidth(); // Initial call
		window.addEventListener('resize', updateScreenWidth);

		// Initialize dynamic manifest
		const cleanupManifest = addMediaChangeUpdateManifestListener();
		updateManifest();

		return () => {
			window.removeEventListener('resize', updateScreenWidth);
			cleanupManifest();
		};
	});
</script>

<div class="container">
	<h1><a href="https://github.com/lumiknit">lumiknit</a>'s Apps</h1>

	<p>
		lumiknit's web-based apps (maybe useful or useless.) For more information, visit <a
			href="https://github.com/lumiknit">@lumiknit</a
		>!
	</p>

	<input type="text" placeholder="Filter..." bind:value={filterString} />

	{#if jsonError !== null}
		<p class="error">{jsonError}</p>
	{/if}

	<div class="icons">
		{#each filteredList as column}
			<div class="icon-column">
				{#each column as item}
					<Shortcut app={item} />
				{/each}
			</div>
		{/each}
	</div>

	<div>
		<a href="#top" on:click={handleGoToTop}> Go to Top </a>
	</div>
</div>

<style>
	.error {
		color: #d32f2f;
		background-color: rgba(211, 47, 47, 0.1);
		padding: 0.5rem;
		border-radius: var(--border-radius);
		margin-bottom: 1rem;
	}

	.icons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: start;
		justify-content: space-between;
	}

	.icon-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-items: start;
		align-items: stretch;
		min-width: 40px;
	}
</style>
