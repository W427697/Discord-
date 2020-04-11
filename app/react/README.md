# Storybook dla React

Storybook dla React to środowisko programistyczne interfejsu użytkownika dla komponentów React.
Dzięki niemu możesz wizualizować różne stany składników interfejsu użytkownika i rozwijać je interaktywnie.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif)

Storybook działa poza twoją aplikacją.
Dzięki temu możesz samodzielnie opracowywać komponenty interfejsu użytkownika, nie martwiąc się o zależności i wymagania specyficzne dla aplikacji.

## Rozpocznij

```sh
cd my-react-app
npx -p @storybook/cli sb init
```

Aby uzyskać więcej informacji sprawdź: [storybook.js.org](https://storybook.js.org)

---

Storybook przychodzi również z wieloma [addons](https://storybook.js.org/addons/introduction) oraz świetny interfejs API, który można dowolnie dostosowywać.
Możesz także zbudować [wersję statyczną](https://storybook.js.org/basics/exporting-storybook) swojego storybooka i wdrożyć go w dowolnym miejscu.

Oto kilka polecanych scenariuszy, do których można się odwołać, aby zobaczyć, jak działa Storybook:

- [Demo of React Dates](http://airbnb.io/react-dates/) - [źródło](https://github.com/airbnb/react-dates)
- [Demo of React Native Web](https://necolas.github.io/react-native-web/docs/) - [źródło](https://github.com/necolas/react-native-web)

## Utwórz aplikację React

Wsparcie dla [Create React App](https://create-react-app.dev/) jest obsługiwany przez [`@storybook/preset-create-react-app`](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app).

To ustawienie wstępne obsługuje wszystkie funkcje Create React App, w tym Sass / SCSS i TypeScript.

## Typescript

`@storybook/react` teraz eksportuje własne typy do użycia z Typescript.
Nie potrzebujesz mieć zainstalowanego `@types/storybook__react` już więcej razy, jeśli to był twój przypadek.
Ale prawdopodobnie potrzebujesz także użyć typów z `@types/node @types/react`.

## Dokumentacja

- [Podstawy](https://storybook.js.org/basics/introduction)
- [Konfiguracja](https://storybook.js.org/configurations/default-config)
- [Dodatki](https://storybook.js.org/addons/introduction)
