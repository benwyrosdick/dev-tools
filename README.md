# dev-tools

A small collection of browser-based developer utilities.

## Tools

- **Diff** — side-by-side text/code diff viewer
- **JSON Viewer** — parse, format, and explore JSON as a tree
- **JWT Viewer** — decode and inspect JWT headers and payloads
- **Crypto Tools** — hashing and encoding helpers
- **GUID Generator** — generate UUIDs/GUIDs

## Stack

Vite, React, TypeScript, Tailwind CSS, shadcn/ui, React Router.

## Development

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev
```

Other scripts:

- `bun run build` — production build
- `bun run lint` — run ESLint
- `bun run preview` — serve the production build locally

## Docker

A multi-stage `Dockerfile` builds the app and serves it with nginx.

```sh
docker build -t dev-tools .
docker run -p 8080:80 dev-tools
```

A health endpoint is exposed at `/up`.
