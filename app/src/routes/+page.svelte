<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { postApi } from '$lib/api';
  import type { ApiRes } from '$lib/api';


  interface Message {
    text: string;
    isBot: boolean;
  };

  let businessDesc: string = '';
  let personaAnalysis: string = '';
  let stage = 0;

  interface GptRes {
    gptMsg: string;
  }

  onMount(() => {
    reset();
  });

  function reset() {
    stage = 0;
  }

  async function handleDescription() {
    let userInput = document.getElementById('desc-input').value;
    userInput = userInput.trim();
    if (!userInput || userInput.length <= 5) {
      return;
    }

    // Add bot message(s)
    try {
      const { data, error } = await postApi<ApiRes<GptRes>>('description', { userInput });
      if (error) {
        console.error(error);
        return;
      }

      businessDesc = data.gptMsg;
      businessDesc = businessDesc.trim();
    } catch (error) {
      console.error('Error handling description:', error);
    }

    // Next stage
    stage = 1;
  }

  async function generateReport() {
    // Make sure the user has provided a business description
    if (!businessDesc || businessDesc.length <= 5) {
      return;
    }

    // Add bot message(s)
    try {
      const targetDemographics = demographics.filter(demo => demo.value).map(demo => demo.value);
      const { data, error } = await postApi<ApiRes<GptRes>>('persona', { businessDesc, targetDemographics });
      if (error) {
        console.error(error);
        return;
      }

      personaAnalysis = data.gptMsg;
    } catch (error) {
      console.error('Error generating persona:', error);
    }

    // Next stage
    stage = 3;
  }

  // Demographics stuff
  let demographics = [{ id: Date.now(), value: '' }];
  let inputs = [];

  function addDemographic() {
    demographics = [...demographics, { id: Date.now(), value: '' }];
  }

  function removeDemographic(id: number) {
    const index = demographics.findIndex(demo => demo.id === id);
    if (index !== -1) {
      demographics.splice(index, 1);
      inputs.splice(index, 1);
      demographics = [...demographics];
      inputs = [...inputs];
    }
    if (demographics.length === 0) {
      addDemographic();
    }
  }

  function updateDemographic(id: number, value: string) {
    const index = demographics.findIndex(demo => demo.id === id);
    demographics[index].value = value;
    if (index === demographics.length - 1 && value) { // Check if it's the last input and has content
      addDemographic(); // Add new input field
    }
  }
</script>

<div class="page">
  <div class="side-bar">
    <h1 class="company">Personify</h1>
    <ul class="menu-items">
      <li class="menu-item">Home</li>
      <li class="menu-item">Products</li>
      <li class="menu-item">Services</li>
      <li class="menu-item">About</li>
      <li class="menu-item">Contact</li>
    </ul>
  </div>

  <div class="content-wrapper">
    <div class="content">
      <div class="row">
        {#if stage <= 1}
          <div class="row-content">
            <h2>Product description</h2>
            <div class="desc-box">
              <textarea id="desc-input" placeholder="Enter a detailed description of your product here so that we can identify your target demographics." rows="5"></textarea>
              <button id="desc-input-btn" class="desc-box-btn" on:click={handleDescription}>
                <i class="fas fa-arrow-right"/>
              </button>
            </div>
          </div>
        {/if}

        {#if stage >= 1}
          <div class="row-content">
            <h2>GPT Understanding</h2>
            <div class="desc-box">
              <div id="desc-output"><pre>{businessDesc}</pre></div>
              {#if stage == 1}
                <button id="desc-output-btn" class="desc-box-btn" on:click={() => stage = 2}>
                  <i class="fas fa-thumbs-up"/>
                </button>
              {/if}
            </div>
            {#if stage == 1}
              <p class="help-tip">We just want to make sure, is this summary of your product description accurate?</p>
            {/if}
          </div>
        {/if}
      </div>

      {#if stage >= 2}
        <h2>Additional Demographics</h2>
        <div class="demographics-section">
          {#each demographics as demo, index}
            <div class="demographic-entry">
              <input
                type="text"
                bind:value={demo.value}
                on:input={() => updateDemographic(demo.id, demo.value)}
                placeholder="Enter target demographic and description"
                bind:this={inputs[index]}
              />
              <button on:click={() => removeDemographic(demo.id)} class="delete-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          {/each}
        </div>
      {/if}

      {#if stage >= 2}
      <div class="report-section">
        <div class="row">
          <button on:click={generateReport}>Generate Report</button>
        </div>

        {#if stage == 3}
          <h2>Report</h2>
          <pre id="report">{personaAnalysis}</pre>
        {/if}
      </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .company {
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-weight: 200;
    color: var(--primary);
  }

  .help-tip {
    font-style: italic;
  }

  .page {
    display: flex;
    height: 100vh;
    margin: 0;
    overflow: hidden;
		background-color: var(--bg-light);
  }

  .side-bar {
    background-color: var(--bg-light);
    border: 1px solid var(--bg-dark);
    padding: 20px;
    width: 300px;
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .menu-items {
      list-style: none;
      padding: 0;
      margin: auto 0;
      top: 0;
      bottom: 0;
    }

    .menu-item {
      padding: 10px;
      margin: 10px 0;
      color: var(--text-dark);
      text-align: center;
      border-bottom: 1px solid transparent;
      cursor: pointer;

      &:hover {
        border-bottom: 1px solid var(--primary);
        transition: ease-in-out border-bottom 0.3s;
      }
    }
  }

  .content-wrapper {
    margin: auto;
    padding: 30px;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .content {
    max-width: 1000px;
    width: 100%;
		background-color: var(--bg-light);
    margin: auto;
    left: auto;
    right: auto;
  }

  .row {
    margin: auto;
    width: 100%;
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .row-content {
    width: 100%;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
  }

  .desc-box {
    width: 100%;
    border: 1px solid var(--bg-dark);
    height: 300px;
    border-radius: 5px;
    background-color: white;
    position: relative;
    overflow: hidden;
  }

  #desc-input, #desc-output {
    border: none;
    padding: 10px 10px 60px 10px;
    width: 100%;
    height: 100%;
    margin: 0;
    font-size: 18px;
    color: var(--text-dark);
    word-wrap: break-word;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    resize: none;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    margin: 0;
  }

  .desc-box-btn {
    padding: 10px;
    background-color: var(--bg-dark);
    color: var(--primary);
    border: none;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    position: absolute;
    left: auto;
    right: 10px;
    top: auto;
    bottom: 10px;
    cursor: pointer;

    &:hover {
      background-color: var(--primary);
      color: white;
      transition: ease-in-out background-color 0.3s;
    }
  }

  .demographics-section {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 100%;
  }

  .demographic-entry {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    input {
      flex-grow: 1;
      margin-right: 10px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }

    .delete-btn {
      color: gray;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      top: auto;
      bottom: auto;

      &:hover {
        color: red;
        transition: ease-in-out color 0.3s;
      }
    }
  }

  .report-section {
    margin: 60px auto;
    width: 100%;

    button {
      padding: 10px 16px;
      color: var(--primary);
      background-color: var(--bg-light);
      border: 1px solid var(--primary);
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;

      &:hover {
        background-color: var(--primary);
        color: white;
        border: 1px solid transparent;
        transition: ease-in-out background-color 0.3s;
      }
    }
  }
</style>
