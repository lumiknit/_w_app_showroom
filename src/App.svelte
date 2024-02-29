<script lang="ts">
  import "@picocss/pico";
  import { onMount } from "svelte";

  type App = {
    name: string;
    url: string;
    description: string;
  };

  let appList: App[] = [];
  let filterString = "";

  $: filteredList = appList.filter((item) => {
    return item.name.toLowerCase().includes(filterString.toLowerCase());
  });

  const handleGoToTop = () => {
    window.scrollTo(0, 0);
  };

  const fetchList = async () => {
    const res = await fetch("./apps.json");
    const data = await res.json();
    appList = data;
    console.log("appList", appList);
  };

  onMount(() => {
    fetchList();
  });
</script>

<div class="container">
  <h1><a href="https://github.com/lumiknit">lumiknit</a>'s Apps</h1>

  <p>
    Bookmarks of my custom-made web apps. <br />
  </p>

  <input type="text" placeholder="Filter..." bind:value={filterString} />

  <div class="icons">
    {#each filteredList as item}
      <div class="icon-wrap">
        <a href={item.url} class="icon-box">
          <header>
            <img src={`${item.url}/favicon.ico`} alt={item.name} />
            <span>{item.name}</span>
          </header>
          <main>{item.description}</main>
        </a>
      </div>
    {/each}
  </div>

  <div>
    <a href="#" on:click={handleGoToTop}> Go to Top </a>
  </div>
</div>

<style>
  .icons {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }

  .icon-wrap {
    flex: 33% 0;
    padding: 0.5rem;
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

    & * {
      color: var(--pico-color);
    }

    & header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      font-size: 1.25rem;
    }

    & img {
      width: 1.5rem;
      vertical-align: middle;
    }

    & main {
      font-size: 0.75rem;
    }
  }
</style>
