# TBD

## Developing

Create a `.env` file in the root directory of the app (`/app/.env`). In the file, add the OpenAI API key, in this format:

```bash
OPENAI_API_KEY="paste_your_key_value_here"
```

Then, install dependencies using `npm install` (or `pnpm install` or `yarn`).

Finally, start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
