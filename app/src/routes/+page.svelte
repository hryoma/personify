<script lang="ts">
  import { onMount } from 'svelte';
  import { postApi } from '$lib/api';
  import type { ApiRes } from '$lib/api';


  interface Message {
    text: string;
    isBot: boolean;
  };

  let messages: Message[] = [];
  let businessDesc: string = '';

  interface GptRes {
    gptMsg: string;
  }

  onMount(() => {
    reset();
  });

  function reset() {
    messages = [{ text: 'Hello! I am your customer persona assistant. What is your business about?', isBot: true }];
  }

  async function handleDescription(event: KeyboardEvent | MouseEvent) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return;
    }
    let userInput = event.target.value as string;
    userInput = userInput.trim();

    // Input validation: check if the user input is empty
    if (!userInput || userInput.length <= 5) {
      messages = [...messages, { text: 'Please provide more information about your business.', isBot: true }];
      return;
    }

    // Add user message to the chat
    messages = [...messages, { text: userInput, isBot: false }];

    // Add bot message(s)
    try {
      const { data, error } = await postApi<ApiRes<GptRes>>('description', { userInput });
      if (error) {
        console.error(error);
        return;
      }

      businessDesc = data.gptMsg;
      businessDesc = businessDesc.trim();

      messages = [...messages, { text: businessDesc, isBot: true }];
      messages = [...messages, { text: 'How is this description? Press "Confirm" if this is good, otherwise let me know what you\'d like to change!', isBot: true }];
    } catch (error) {
      console.error('Error handling description:', error);
    }

    // Clear the input field
    (event.target as HTMLInputElement).value = '';
  }

  async function handlePersona() {
    // Make sure the user has provided a business description
    if (!businessDesc || businessDesc.length <= 5) {
      messages = [...messages, { text: 'Please provide a business description first.', isBot: true }];
      return;
    }

    // Add bot message(s)
    messages = [...messages, { text: 'I will now generate a customer persona for you.', isBot: true }];

    try {
      const { data, error } = await postApi<ApiRes<GptRes>>('persona', { businessDesc });
      if (error) {
        console.error(error);
        return;
      }

      const personaAnalysis: string = data.gptMsg;
      messages = [...messages, { text: personaAnalysis, isBot: true }];
    } catch (error) {
      console.error('Error generating persona:', error);
    }
  }

</script>

<h1>Customer Persona Assistant</h1>

<div class="chat">
  {#each messages as msg}
    <div class="msg {msg.isBot ? 'bot-msg' : 'user-msg'}">
      {msg.text}
    </div>
  {/each}
</div>

<div class="chat-input">
  <input type="text" on:keydown={handleDescription} />
  <button on:click={handleDescription}>Send</button>
</div>

<div>
  <button on:click={reset}>Reset</button>
  <button on:click={handlePersona}>Confirm</button>
</div>

<style lang="scss">
  .chat {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 400px;
  }

  .msg {
    padding: 10px;
    border-radius: 5px;
    max-width: 80%;
    white-space: pre-wrap;
  }

  .bot-msg {
    background-color: #f0f0f0;
    align-self: flex-start;
  }

  .user-msg {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
  }
</style>
