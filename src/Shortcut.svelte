<script lang="ts">
	type App = {
		name: string;
		url: string;
		description: string;
	};

	export let app: App;

	let imageError = false;

	const handleImageError = () => {
		imageError = true;
	};
</script>

<div class="icon-wrap" title={app.description}>
	<a href={app.url} class="icon-box">
		<div class="icon-image">
			{#if !imageError}
				<img
					src={`${app.url}/favicon.ico`}
					alt={app.name}
					on:error={handleImageError}
				/>
			{:else}
				<div class="dummy-icon">✨</div>
			{/if}
		</div>
		<div class="app-name">{app.name}</div>
	</a>
</div>

<style>
	.icon-wrap {
		padding: 0.5rem;
		position: relative;
	}

	.icon-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		padding: 1rem;
		border-radius: 12px;
		color: var(--text-color);
		user-select: none;
		-webkit-user-drag: none;
		transition: all 0.2s ease;
		min-height: 120px;

		&:hover {
			transform: scale(1.05);
		}

		&:active {
			transform: scale(0.95);
		}
	}

	.icon-image {
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
		border-radius: 12px;
		background-color: var(--card-background-color);
		box-shadow: var(--card-shadow);
	}

	.icon-image img {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.dummy-icon {
		font-size: 32px;
		opacity: 0.7;
	}

	.app-name {
		font-size: 0.8rem;
		font-weight: 500;
		text-align: center;
		line-height: 1.2;
		word-wrap: break-word;
		hyphens: auto;
	}

	/* Tooltip styling */
	.icon-wrap:hover::after {
		content: attr(title);
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%) translateY(100%);
		background-color: var(--tooltip-background-color);
		color: var(--tooltip-text-color);
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		white-space: nowrap;
		max-width: 40dvw;
		white-space: normal;
		z-index: 1000;
		pointer-events: none;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.icon-wrap:hover::before {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%) translateY(100%);
		border: 4px solid transparent;
		border-bottom-color: var(--tooltip-background-color);
		z-index: 1001;
		pointer-events: none;
	}

</style>
