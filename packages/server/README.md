# server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Ollama configuration

The chat service now calls a local [Ollama](https://ollama.com) instance instead of the OpenAI API. Make sure you have a model pulled (for example `ollama pull llama3.1`) and that the daemon is running at the URL specified via `OLLAMA_BASE_URL` (defaults to `http://127.0.0.1:11434`). Tune the model, temperature, and token limit through the variables listed in `.env.example`.
