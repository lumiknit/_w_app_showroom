<script lang="ts">
	import "@picocss/pico";
	import { onMount } from "svelte";

	type App = {
		name: string;
		url: string;
		description: string;
	};

	const columns = 3;
	let jsonError: null | string = null;
	let appList: App[] = [];
	let filterString = "";

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

	onMount(fetchList);
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
					<div class="icon-wrap">
						<a href={item.url} class="icon-box">
							<header>
								<img
									src={`${item.url}/favicon.ico`}
									alt="📱"
									on:error={(e) => ((e.target as HTMLImageElement).style.display = "none")}
								/>
								<span>{item.name}</span>
							</header>
							<main>{item.description}</main>
						</a>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div>
		<a href="#top" on:click={handleGoToTop}> Go to Top </a>
	</div>
</div>

<style>
	.icons {
		display: flex;
		flex-wrap: wrap;
		flex-direction: columns;
		align-items: start;
		justify-content: space-between;
	}

	.icon-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}

	.icon-wrap {
		padding: 0.25rem;
		word-break: break-all;
	}

	.icon-box {
		display: block;
		height: 100%;
		text-decoration: none;
		padding: 0.75rem;
		border-radius: var(--pico-border-radius);
		background-color: var(--pico-card-background-color);
		box-shadow: var(--pico-card-box-shadow);

		user-select: none;
		-webkit-user-drag: none;

		&:hover {
			color: var(--pico-secondary-inverse);
			background-color: var(--pico-secondary-hover);
		}

		&:active {
			color: var(--pico-secondary-inverse);
			background-color: var(--pico-secondary-active);
		}

		& header {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-weight: bold;
			margin-bottom: 0.5rem;
		}

		& img {
			width: 1rem;
			vertical-align: middle;
		}

		& main {
			font-size: 0.75rem;
		}
	}
</style>
