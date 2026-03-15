# PRD — paczka npm `b-belt`

## Opis projektu

`b-belt` to publiczna paczka npm napisana w TypeScript, dostarczająca gotowe interceptory dla klienta HTTP Axios. Jej celem jest automatyczna konwersja nazewnictwa pól (snake_case ↔ camelCase) między frontendem a API — bez potrzeby ręcznego mapowania w każdym projekcie.

---

## Główne wymagania funkcjonalne

Paczka eksportuje trzy interceptory przez pojedynczy plik `index.ts`:

| Interceptor | Kierunek | Opis |
|---|---|---|
| `camelizeResponseInterceptor` | response | Konwertuje klucze odpowiedzi z `snake_case` → `camelCase` |
| `decamelizeRequestInterceptor` | request | Konwertuje klucze ciała żądania z `camelCase` → `snake_case` |
| `snakeCaseQueryParamsInterceptor` | request | Konwertuje query params z `camelCase` → `snake_case` |

Transformacje kluczy realizowane wyłącznie przez bibliotekę **`change-case`**.

---

## Architektura techniczna

- **Język**: TypeScript (strict mode, eksportowane typy)
- **Build**: `tsup` → dual output: ESM (`dist/index.mjs`) + CJS (`dist/index.js`) + typy (`dist/index.d.ts`)
- **`package.json`**: pola `exports`, `main`, `module`, `types`, `files`, `peerDependencies`
- **Zależności**: `axios` jako `peerDependency`, `change-case` jako `dependency`
- **Node.js**: minimalne wsparcie v20+
- **Licencja**: MIT

---

## Struktura projektu

```
b-belt/
├── src/
│   ├── interceptors/
│   │   ├── camelize-response.ts
│   │   ├── decamelize-request.ts
│   │   └── snake-case-query-params.ts
│   └── index.ts
├── __tests__/
│   ├── camelize-response.test.ts
│   ├── decamelize-request.test.ts
│   └── snake-case-query-params.test.ts
├── dist/                    ← generowane przez tsup
├── .github/
│   └── workflows/
│       └── release.yml
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .releaserc.json
└── README.md
```

---

## Kluczowe historie użytkownika

1. **Jako deweloper** chcę zainstalować `b-belt` i w kilku linijkach podpiąć interceptory do mojej instancji Axios, żeby nie pisać ręcznie mapowania kluczy.
2. **Jako deweloper** chcę importować tylko potrzebne interceptory (`import { camelizeResponseInterceptor } from 'b-belt'`), a bundler automatycznie usunął nieużywane.
3. **Jako autor paczki** chcę, żeby po wykonaniu `git push` z odpowiednim tagiem cały proces publikacji na npm odbył się automatycznie bez mojej interwencji.

---

## Kryteria sukcesu

| Kryterium | Sposób weryfikacji |
|---|---|
| Paczka opublikowana na npmjs.com | Widoczna pod `npmjs.com/package/b-belt` |
| Automatyczna publikacja przez CI/CD | GitHub Actions przechodzi zielono po pushu tagu |
| Wszystkie 3 interceptory przetestowane | 100% testów Vitest przechodzi (`vitest run`) |
| Dual build działa | Import działa w projekcie ESM i CJS |
| README zawiera przykłady użycia | Dokumentacja widoczna na stronie paczki npm |

---

## Pipeline CI/CD

**Trigger**: push tagu git (np. `v0.0.1`)

**Kroki w GitHub Actions**:
1. Checkout kodu
2. Setup Node.js
3. Install dependencies
4. Uruchomienie testów (Vitest)
5. Build (tsup)
6. `semantic-release` → bump wersji + CHANGELOG + publikacja na npm + GitHub Release

**Wymagany secret**: `NPM_TOKEN` (Automation Token z npmjs.com) zapisany w `GitHub → Settings → Secrets and variables → Actions`.

### Jak wygenerować npm Automation Token

1. Zaloguj się na [npmjs.com](https://www.npmjs.com).
2. Przejdź do `Account Settings → Access Tokens → Generate New Token`.
3. Wybierz typ **Automation** (omija 2FA przy publikacji z CI/CD).
4. Skopiuj wygenerowany token.
5. W repozytorium GitHub przejdź do `Settings → Secrets and variables → Actions → New repository secret`.
6. Nadaj nazwę `NPM_TOKEN` i wklej skopiowany token.

---

## Zarządzanie jakością kodu

- **ESLint + Prettier** — linting i formatowanie TypeScript (`@typescript-eslint` + `eslint-config-prettier`)
- **commitlint + husky** — wymuszanie Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) jako warunek działania `semantic-release`
- **Vitest** — testy jednostkowe każdego interceptora w katalogu `__tests__/`

---

## Wersjonowanie

- Pierwsza wersja: **`0.0.1`**
- Standard: **semver** zarządzany automatycznie przez `semantic-release` na podstawie typu commitu:
  - `fix:` → patch
  - `feat:` → minor
  - `BREAKING CHANGE` → major
- Pluginy `semantic-release`: `commit-analyzer`, `release-notes-generator`, `changelog`, `npm`, `github`

---

## Decyzje projektowe

1. Axios jako jedyny wspierany klient HTTP.
2. TypeScript z eksportowanymi definicjami typów.
3. Dual build ESM + CJS przez `tsup`.
4. Node.js 20+ jako minimalna wersja.
5. Interceptory działają out-of-the-box — brak opcji konfiguracyjnych w MVP.
6. Transformacje wyłącznie przez bibliotekę `change-case`.
7. `axios` jako `peerDependency`.
8. Jeden `index.ts` z named exports — tree-shaking zapewnia bundler przez ESM.
9. Repozytorium GitHub publiczne od początku.
10. Wersja startowa `0.0.1`.

---

## Nierozwiązane kwestie (poza zakresem MVP)

1. **Obsługa edge case'ów** — nie zdefiniowano zachowania dla zagnieżdżonych obiektów, tablic, wartości `null`/`undefined`, okrągłych referencji ani kluczy będących już w docelowym formacie.
2. **Konfiguracja ESLint** — do ustalenia szczegółowy zestaw reguł oraz czy lint blokuje merge w CI.
3. **Zakres testów** — nie określono, czy testy mają pokrywać wyłącznie happy path, czy też scenariusze negatywne i edge case'y.
4. **GitHub repo** — nie zostało jeszcze założone; konieczne przed konfiguracją CI/CD i dodaniem `NPM_TOKEN` jako secret.
