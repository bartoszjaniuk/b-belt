# NPM Package Publication Plan — b-belt

## 1. Overview

This plan covers the implementation, API design, and publication flow for the `b-belt` npm package: Axios interceptors for automatic snake_case ↔ camelCase conversion, built with TypeScript and tsup (ESM + CJS), tested with Vitest, and released via GitHub Actions and semantic-release.

---

## 2. Public API (Main Resources)

The package exposes a single entry point with **named exports only**. No default export.

| Export                            | Type                 | Axios hook               | Responsibility                                          |
| --------------------------------- | -------------------- | ------------------------ | ------------------------------------------------------- |
| `camelizeResponseInterceptor`     | Response interceptor | `onFulfilled` (response) | Transform response data keys: snake_case → camelCase    |
| `decamelizeRequestInterceptor`    | Request interceptor  | `onFulfilled` (request)  | Transform request body keys: camelCase → snake_case     |
| `snakeCaseQueryParamsInterceptor` | Request interceptor  | `onFulfilled` (request)  | Transform query parameter names: camelCase → snake_case |

**Entry:** `index.ts` (built as `dist/index.mjs` / `dist/index.js`).  
**Tree-shaking:** Relies on ESM and bundler; consumers import only what they use.

---

## 3. API Contract (Endpoints / Surfaces)

### 3.1 `camelizeResponseInterceptor`

- **Signature:** Compatible with Axios `ResponseInterceptor`:  
  `(response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>`
- **Input:** Axios response object; `response.data` is the payload to transform.
- **Behavior:** Recursively convert every **key** of `response.data` from snake_case to camelCase using `change-case`. Leave values and structure unchanged except for key names. Return the same response with mutated `response.data`.
- **Edge (MVP):** No configuration; assume JSON-like data. Nested objects and arrays of objects are in scope if recursive conversion is implemented; otherwise document limitation (e.g. top-level only).

### 3.2 `decamelizeRequestInterceptor`

- **Signature:** Compatible with Axios `RequestInterceptor`:  
  `(config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>`
- **Input:** Axios request config; `config.data` is the body to transform (e.g. POST/PUT/PATCH).
- **Behavior:** Recursively convert every **key** of `config.data` from camelCase to snake_case using `change-case`. Return the same config with mutated `config.data`. If `config.data` is absent or not a plain object, leave config unchanged.
- **Edge (MVP):** No configuration; assume JSON-like body.

### 3.3 `snakeCaseQueryParamsInterceptor`

- **Signature:** Same as above:  
  `(config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>`
- **Input:** Axios request config; `config.params` (or equivalent) holds query parameter names.
- **Behavior:** Convert each **query parameter name** from camelCase to snake_case using `change-case`. Parameter values are not transformed. If params are provided as an object, transform its keys; if as URLSearchParams or string, parse and rebuild with transformed keys where applicable.
- **Edge (MVP):** No configuration; support at least plain object `params`.

---

## 4. Implementation Structure

- **Source:**
  - `src/interceptors/camelize-response.ts`
  - `src/interceptors/decamelize-request.ts`
  - `src/interceptors/snake-case-query-params.ts`
  - `src/index.ts` — re-exports the three interceptors (named only).
- **Types:** Emit `.d.ts` from TypeScript; depend on Axios types (via `@types/axios` or Axios’ own types if present) and expose no custom config types in MVP.
- **Transformations:** Use only `change-case` (e.g. `camelCase`, `snakeCase`). No custom character logic.
- **Dependencies:** `axios` as `peerDependency`; `change-case` as `dependency`. Node `>=20`.

---

## 5. Build and Package Layout

- **Build tool:** tsup.
- **Outputs:**
  - ESM: `dist/index.mjs`
  - CJS: `dist/index.js`
  - Types: `dist/index.d.ts` (or equivalent from tsup).
- **package.json:**
  - `main`, `module`, `types` pointing to `dist/`;
  - `exports` map for conditional entry (import / require / types);
  - `files`: include only `dist` and optionally README/LICENSE;
  - `engines`: `"node": ">=20"`;
  - No config options in package API for MVP.

---

## 6. Testing Strategy

- **Runner:** Vitest.
- **Location:** `__tests__/` with one file per interceptor (e.g. `camelize-response.test.ts`, `decamelize-request.test.ts`, `snake-case-query-params.test.ts`).
- **Scope (MVP):** At least happy path for each interceptor (flat object keys; request/response shape as in real Axios usage). Optionally add nested objects and array-of-objects if recursive transform is implemented; document or defer edge cases (null, undefined, circular refs, already-converted keys) per PRD “Nierozwiązane kwestie”.
- **Success criterion:** All tests pass (`vitest run`); aim for 100% pass rate as per PRD.

---

## 7. Publication and CI/CD

- **Trigger:** Push of a version tag (e.g. `v0.0.1`).
- **Pipeline (GitHub Actions):**
  1. Checkout.
  2. Setup Node (20+).
  3. Install dependencies (including peer for tests).
  4. Run tests.
  5. Build (tsup).
  6. Run semantic-release: analyze commits (Conventional Commits), bump version, generate CHANGELOG, publish to npm, create GitHub Release.
- **Secrets:** `NPM_TOKEN` (npm Automation Token) in GitHub Actions secrets.
- **Versioning:** Semver; initial version `0.0.1`; `fix:` → patch, `feat:` → minor, `BREAKING CHANGE` → major.
- **Prerequisites:** Public GitHub repository; npm package `@i3artosh/b-belt` (scoped); commitlint + husky enforcing Conventional Commits so semantic-release can run correctly.

---

## 8. Quality and Conventions

- **Linting/formatting:** ESLint + Prettier (TypeScript; `@typescript-eslint`, `eslint-config-prettier`). Scope of rules and whether lint blocks merge can be decided separately.
- **Commits:** commitlint + husky to enforce Conventional Commits on commit (and optionally in CI).

---

## 9. Documentation

- **README:** Installation (`npm i @i3artosh/b-belt axios`), minimal usage example: create Axios instance, attach all three interceptors, show one request and response with converted keys. Mention tree-shaking (named imports). Link to npm and repo. Satisfies PRD success criterion for “README zawiera przykłady użycia”.

---

## 10. Checklist Before First Publish

1. Repository created and public on GitHub.
2. `NPM_TOKEN` added to GitHub Actions secrets.
3. Project structure, three interceptors, and `index.ts` in place.
4. tsup build produces ESM + CJS + types; `package.json` and `exports` correct.
5. All Vitest tests pass.
6. semantic-release and release workflow run on tag push (e.g. `v0.0.1`).
7. README with usage examples; package visible on npm and installable.

---

## 11. Out of Scope (MVP)

- Configurable interceptors (e.g. custom key maps or toggles).
- Support for HTTP clients other than Axios.
- Formal handling of edge cases: circular references, non-plain objects, mixed/custom casing; these can be documented as limitations or best-effort.
- Lazy or optional recursive behavior is an implementation detail; the plan assumes either recursive key conversion or clearly documented shallow behavior.
