<script lang="ts">
  import { onMount } from 'svelte';

  interface Message {
    text: string;
    isBot: boolean;
  };

  let messages: Message[] = [];

  onMount(() => {
    reset();
  });

  function reset() {
    messages = [{ text: 'Hello! I am your customer persona assistant. What is your business about?', isBot: true }];
  }

  function handleDescription(event: KeyboardEvent | MouseEvent) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return;
    }

    // Add user message to the chat
    messages = [...messages, { text: event.target.value, isBot: false }];

    // Add bot message(s)
    // TODO: add request to GPT, and add to messages
    messages = [...messages, { text: 'How is this description? Press "Confirm" if this is good, otherwise let me know what you\'d like to change!', isBot: true }];

    // Clear the input field
    (event.target as HTMLInputElement).value = '';
  }

  function handlePersona() {
    // Add bot message(s)
    messages = [...messages, { text: 'I will now generate a customer persona for you.', isBot: true }];
    // TODO: add request to GPT, and add to messages
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
