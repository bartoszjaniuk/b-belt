# b-belt

[![npm version](https://img.shields.io/npm/v/b-belt.svg)](https://www.npmjs.com/package/b-belt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of contents

- [Project description](#project-description)
- [Tools](#tools)
- [Getting started locally](#getting-started-locally)
- [Available scripts](#available-scripts)
- [Project status](#project-status)
- [License](#license)

---

## Project description

**b-belt** is a public npm package written in TypeScript that provides ready-to-use interceptors for the [Axios](https://github.com/axios/axios) HTTP client. It automatically converts field naming between **snake_case** and **camelCase** when talking to APIs, so you don’t have to manually map keys in every project.

The package exports three interceptors from a single entry point:

| Interceptor | Direction | Description |
|-------------|-----------|-------------|
| `camelizeResponseInterceptor` | response | Converts response keys from `snake_case` → `camelCase` |
| `decamelizeRequestInterceptor` | request | Converts request body keys from `camelCase` → `snake_case` |
| `snakeCaseQueryParamsInterceptor` | request | Converts query parameter names from `camelCase` → `snake_case` |

Key conversions are done with the [change-case](https://github.com/blakeembrey/change-case) library. You can import only the interceptors you need; ESM and tree-shaking keep your bundle small.

### Quick usage

```ts
import axios from 'axios';
import {
  camelizeResponseInterceptor,
  decamelizeRequestInterceptor,
  snakeCaseQueryParamsInterceptor,
} from 'b-belt';

const client = axios.create({ baseURL: 'https://api.example.com' });

client.interceptors.request.use(decamelizeRequestInterceptor);
client.interceptors.request.use(snakeCaseQueryParamsInterceptor);
client.interceptors.response.use(camelizeResponseInterceptor);

// Request body and query params are sent as snake_case;
// response data keys are returned as camelCase.
```

---

## Tools

- **Language:** TypeScript (strict mode, exported type definitions)
- **Build:** [tsup](https://github.com/ewkn/tsup) — dual output ESM (`dist/index.mjs`) and CJS (`dist/index.js`) plus types (`dist/index.d.ts`)
- **Runtime:** [Node.js](https://nodejs.org/) 20+
- **Testing:** [Vitest](https://vitest.dev/)
- **Key conversion:** [change-case](https://github.com/blakeembrey/change-case)
- **HTTP client:** [Axios](https://github.com/axios/axios) (peer dependency)
- **Code quality:** ESLint, Prettier, [commitlint](https://commitlint.js.org/) + [Husky](https://typicode.github.io/husky/) for [Conventional Commits](https://www.conventionalcommits.org/)
- **Release:** [semantic-release](https://github.com/semantic-release/semantic-release) (version bump, changelog, npm publish, GitHub Release) via GitHub Actions

---

## Getting started locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/bartoszjaniuk/b-belt.git
   cd b-belt
   ```

2. **Use Node.js 20+**  
   The project uses [.nvmrc](.nvmrc). If you use [nvm](https://github.com/nvm-sh/nvm):
   ```bash
   nvm use
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   Note: **Axios** is a peer dependency. Ensure your app (or this repo’s dev setup) has Axios installed where you run the code.

4. **Build**
   ```bash
   npm run build
   ```
   Output is in `dist/` (ESM, CJS, and type definitions).

5. **Run tests**
   ```bash
   npm test
   ```

---

## Available scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `npm test` | Run unit tests with Vitest |
| `build` | `npm run build` | Build the package with tsup (ESM + CJS + types) |

---

## Project status

- **Current version:** 0.0.1  
- **Status:** MVP. Package is set up for publication on [npm](https://www.npmjs.com/package/b-belt), with CI/CD (GitHub Actions) for tests, build, and release on tag push using semantic-release.  
- **Versioning:** [Semantic Versioning](https://semver.org/) (semver), managed automatically by semantic-release from commit types (`fix:` → patch, `feat:` → minor, `BREAKING CHANGE` → major).

---

## License

[MIT](LICENSE)
