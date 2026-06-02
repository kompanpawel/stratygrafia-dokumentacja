# Instrukcje Copilot – Stratygrafia

## Projekt
Aplikacja Angular 21 o nazwie **Stratygrafia**.

## Stack technologiczny
- **Framework:** Angular 21 (standalone components, signals)
- **Język:** TypeScript ~5.9
- **Testy:** Vitest (`ng test`)
- **Formatowanie:** Prettier (`.prettierrc`)
- **Menadżer pakietów:** npm 11

## Konwencje kodu
- Używaj **standalone components** (bez NgModule)
- Preferuj **Angular Signals** zamiast RxJS tam, gdzie to możliwe
- Trzymaj się konwencji nazewniczych Angular CLI (kebab-case dla plików, PascalCase dla klas)
- Komponenty: jeden komponent per plik
- Importy: pełne ścieżki, bez barrel index.ts chyba że już istnieją
- Styl komunikacji w kodzie: **polski** (komentarze, nazwy zmiennych mogą być po angielsku – standardowa praktyka)

## Struktura projektu
```
src/
  app/          – komponenty, serwisy, trasy
  styles.css    – globalne style
  main.ts       – punkt wejścia
  index.html
```

## Uruchamianie
- Dev server: `ng serve` → http://localhost:4200
- Build: `ng build`
- Testy: `ng test`

## Zasady ogólne
- Zawsze waliduj zmiany uruchamiając testy (`ng test`)
- Nie modyfikuj `angular.json` bez wyraźnej potrzeby
- Zachowaj spójność z istniejącym formatowaniem (Prettier)
