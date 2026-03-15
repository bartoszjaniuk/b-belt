# Lista kroków realizacji — b-belt

Lista kroków do zrealizowania w kolejności, na podstawie [prd.md](prd.md) oraz [plan.md](plan.md).

---

## Faza 1: Fundament projektu

### Krok 1. Inicjalizacja repozytorium i package.json
- [ ] Założyć repozytorium Git w katalogu projektu (`git init`).
- [x] Utworzyć **package.json** z:
  - nazwą `b-belt`, wersją `0.0.1`, licencją MIT;
  - `engines`: `"node": ">=20"`;
  - `peerDependencies`: `axios`;
  - `dependencies`: `change-case`;
  - `devDependencies`: TypeScript, tsup, Vitest, ESLint, Prettier, commitlint, husky (zgodnie z PRD);
  - polami: `main`, `module`, `types`, `exports`, `files`.
- [x] Dodać `.gitignore` (node_modules, dist, .env, itp.).

**Dlaczego pierwsze:** Bez poprawnego `package.json` i zależności nie da się budować ani testować kodu.

---

### Krok 2. Konfiguracja TypeScript i buildu
- [x] Dodać **tsconfig.json** (strict mode, target ES2020+, generowanie `.d.ts`).
- [x] Dodać **tsup.config.ts** z dual output:
  - ESM → `dist/index.mjs`;
  - CJS → `dist/index.js`;
  - typy → `dist/index.d.ts`.
- [x] Upewnić się, że w `package.json` są poprawne `main`, `module`, `types` oraz mapowanie `exports` (import / require / types).

**Dlaczego drugie:** Build musi działać, zanim napiszesz interceptory i testy, żeby od razu weryfikować eksporty.

---

## Faza 2: Implementacja interceptora

### Krok 3. Interceptor odpowiedzi (camelize)
- [ ] Utworzyć katalog `src/interceptors/`.
- [ ] Zaimplementować **src/interceptors/camelize-response.ts**:
  - sygnatura zgodna z Axios `ResponseInterceptor`;
  - transformacja kluczy `response.data` z snake_case → camelCase za pomocą `change-case`;
  - obsługa rekurencyjna (zagnieżdżone obiekty/tablice obiektów) lub dokumentacja ograniczenia (tylko top-level).
- [ ] Uruchomić build (`npm run build` lub `npx tsup`) i sprawdzić, że pliki w `dist/` się generują.

---

### Krok 4. Interceptor ciała żądania (decamelize)
- [ ] Zaimplementować **src/interceptors/decamelize-request.ts**:
  - sygnatura zgodna z Axios `RequestInterceptor` (`InternalAxiosRequestConfig`);
  - transformacja kluczy `config.data` z camelCase → snake_case;
  - brak zmiany, gdy `config.data` jest puste lub nie jest zwykłym obiektem.
- [ ] Ponownie uruchomić build.

---

### Krok 5. Interceptor parametrów query (snake_case)
- [ ] Zaimplementować **src/interceptors/snake-case-query-params.ts**:
  - sygnatura jak w kroku 4;
  - transformacja **nazw** parametrów w `config.params` z camelCase → snake_case (wartości bez zmian);
  - w MVP wystarczy obsługa `params` jako zwykłego obiektu.
- [ ] Uruchomić build.

---

### Krok 6. Punkt wejścia pakietu
- [ ] Utworzyć **src/index.ts** z samymi **named exports**:
  - `camelizeResponseInterceptor`;
  - `decamelizeRequestInterceptor`;
  - `snakeCaseQueryParamsInterceptor`.
- [ ] Brak default exportu (zgodnie z planem).
- [ ] Sprawdzić build i poprawność ścieżek w `exports` w package.json.

---

## Faza 3: Testy

### Krok 7. Konfiguracja Vitest
- [ ] Dodać Vitest do `devDependencies` (jeśli nie ma w kroku 1).
- [ ] Skonfigurować Vitest (np. w `vitest.config.ts` lub w `package.json`), target TypeScript.
- [ ] Uruchomić `vitest run` — na razie bez testów (opcjonalnie jeden dummy test), żeby potwierdzić działanie runnera.

---

### Krok 8. Testy jednostkowe interceptora
- [ ] Utworzyć katalog `__tests__/`.
- [ ] **__tests__/camelize-response.test.ts** — happy path: odpowiedź z kluczami snake_case → camelCase (płaskie i ewentualnie zagnieżdżone, jeśli zaimplementowane).
- [ ] **__tests__/decamelize-request.test.ts** — happy path: body z camelCase → snake_case; przypadek bez `data` lub nie-obiektu.
- [ ] **__tests__/snake-case-query-params.test.ts** — happy path: `params` jako obiekt, nazwy camelCase → snake_case.
- [ ] Uruchomić `vitest run` i doprowadzić do 100% przechodzenia testów (zgodnie z PRD).

---

## Faza 4: Jakość kodu i commity

### Krok 9. ESLint i Prettier
- [x] Dodać **ESLint** z `@typescript-eslint` i `eslint-config-prettier`.
- [x] Dodać **Prettier** (np. `.prettierrc`).
- [x] Uruchomić lint i format na `src/` i `__tests__/`, poprawić ewentualne błędy.
- [x] (Opcjonalnie) dodać skrypt `lint` w package.json i ewentualnie hook przed commitem.

---

### Krok 10. commitlint i husky
- [ ] Zainstalować i skonfigurować **commitlint** (Conventional Commits: `feat:`, `fix:`, `chore:`, etc.).
- [ ] Zainstalować **husky** i dodać hook (np. `commit-msg`) uruchamiający commitlint.
- [ ] Przetestować: commit z nieprawidłową wiadomością powinien być odrzucony.

**Dlaczego przed publikacją:** semantic-release opiera się na Conventional Commits; bez tego pierwszy release może być nieprzewidywalny.

---

## Faza 5: CI/CD i dokumentacja

### Krok 11. Workflow publikacji (GitHub Actions)
- [ ] Założyć **publiczne repozytorium GitHub** (jeśli jeszcze nie istnieje) i zpushować kod.
- [ ] Dodać **.github/workflows/release.yml**:
  1. Trigger: push tagu (np. `v*`).
  2. Checkout, setup Node.js 20+.
  3. Install dependencies (z peer dla testów).
  4. Uruchomienie testów (`vitest run`).
  5. Build (`tsup`).
  6. Uruchomienie **semantic-release** (bump wersji, CHANGELOG, publikacja npm, GitHub Release).
- [ ] Dodać **.releaserc.json** (lub odpowiednik) z pluginami: commit-analyzer, release-notes-generator, changelog, npm, github.
- [ ] W ustawieniach repozytorium dodać secret **NPM_TOKEN** (npm Automation Token) — zgodnie z sekcją PRD „Jak wygenerować npm Automation Token”.

---

### Krok 12. README i dokumentacja
- [ ] Napisać **README.md** z:
  - krótkim opisem pakietu;
  - instalacją: `npm i b-belt axios`;
  - przykładem użycia: utworzenie instancji Axios, podpięcie wszystkich trzech interceptora, przykładowe żądanie i odpowiedź z konwersją kluczy;
  - informacją o tree-shaking (named imports);
  - linkami do npm i repozytorium.
- [ ] Upewnić się, że `files` w package.json zawiera `dist` oraz ewentualnie README/LICENSE (zgodnie z PRD).

---

## Faza 6: Pierwsza publikacja

### Krok 13. Checklist przed pierwszym release
- [ ] Repozytorium publiczne na GitHubie.
- [ ] Secret `NPM_TOKEN` ustawiony w GitHub Actions.
- [ ] Wszystkie testy przechodzą (`vitest run`).
- [ ] Build działa; `dist/` zawiera ESM, CJS i typy.
- [ ] commitlint + husky działają; commity w Conventional Commits.
- [ ] Nazwa pakietu `b-belt` zarezerwowana na npm (sprawdzić dostępność).
- [ ] Wykonać commit(y) z odpowiednimi prefiksami (np. `feat: add interceptors`), push.
- [ ] Utworzyć i zpushować tag wersji, np. `git tag v0.0.1 && git push origin v0.0.1`.
- [ ] Sprawdzić uruchomienie workflowu w zakładce Actions; po sukcesie — paczka na npm i GitHub Release.

---

## Podsumowanie kolejności

| Kolejność | Działanie |
|-----------|-----------|
| **1** | Inicjalizacja projektu: Git, package.json, .gitignore |
| **2** | TypeScript + tsup (tsconfig, tsup.config, exports w package.json) |
| **3** | Implementacja trzech interceptora + src/index.ts |
| **4** | Vitest: konfiguracja + testy dla każdego interceptora |
| **5** | ESLint + Prettier |
| **6** | commitlint + husky |
| **7** | Repo GitHub, workflow release.yml, .releaserc.json, NPM_TOKEN |
| **8** | README z przykładami |
| **9** | Checklist przed release → tag → push → weryfikacja na npm |

Po realizacji kroków 1–2 możesz równolegle rozwijać interceptory (3–6) i jakość (9–10), a następnie połączyć wszystko w CI/CD (11–13).
