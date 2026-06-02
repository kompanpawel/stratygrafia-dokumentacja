# AGENTS.md – Stratygrafia

Instrukcje dla agentów AI pracujących w tym repozytorium.

## Kontekst projektu
Angular 21, TypeScript, Vitest, Prettier. Szczegóły w `.github/copilot-instructions.md`.

## Zasady pracy agenta

### Przed wprowadzeniem zmian
1. Sprawdź istniejącą strukturę plików (`src/app/`)
2. Przeczytaj powiązane pliki, zanim je zmodyfikujesz
3. Nie instaluj nowych zależności bez potwierdzenia użytkownika

### Podczas wprowadzania zmian
- Stosuj **standalone components** (bez `NgModule`)
- Używaj `inject()` zamiast konstruktor-injection tam, gdzie to sensowne
- Nie dodawaj zbędnych komentarzy – kod powinien być samo-dokumentujący
- Formatuj kod zgodnie z Prettier (`.prettierrc`)

### Po wprowadzeniu zmian
- Uruchom testy: `ng test`
- Uruchom build: `ng build`
- Upewnij się, że nie ma błędów TypeScript

### Czego NIE robić
- Nie używaj `any` w TypeScript bez uzasadnienia
- Nie twórz NgModule – projekt używa standalone API
- Nie commituj do `main` bezpośrednio bez przeglądu
- Nie modyfikuj `angular.json`, `tsconfig.json` bez wyraźnej potrzeby

## Komendy
| Cel | Komenda |
|-----|---------|
| Start dev | `ng serve` |
| Build prod | `ng build` |
| Testy | `ng test` |
| Generuj komponent | `ng generate component nazwa` |
| Generuj serwis | `ng generate service nazwa` |
