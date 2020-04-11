# Storybook dla Vue

Storybook dla Vue to środowisko programistyczne interfejsu użytkownika dla komponentów Vue.
Dzięki niemu możesz wizualizować różne stany składników interfejsu użytkownika i rozwijać je interaktywnie.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif)

Storybook działa poza twoją aplikacją.
Dzięki temu możesz samodzielnie opracowywać komponenty interfejsu użytkownika, nie martwiąc się o zależności i wymagania specyficzne dla aplikacji.

## Rozpocznij

```sh
cd my-vue-app
npx -p @storybook/cli sb init
```

Aby uzyskać więcej informacji zobacz: [storybook.js.org](https://storybook.js.org)

## Projekt początkowy Storybook-for-Vue Boilerplate z [Vuetify](https://github.com/vuetifyjs/vuetify) Material Component Framework

<https://github.com/white-rabbit-japan/vue-vuetify-storybook>

---

Storybook zawiera również wiele [dodatków](https://storybook.js.org/addons/introduction) oraz świetny interfejs API, który można dowolnie dostosowywać.
Możesz także zbudować [wersję statyczną](https://storybook.js.org/basics/exporting-storybook) swojego storybooka i wdrażać go w dowolnym miejscu.

## Notatki Vue

- Podczas korzystania z globalnych niestandardowych komponentów lub rozszerzenia (np. `Vue.use`). Będziesz musiał zadeklarować je w `./storybook/preview.js`.

## Znane ograniczenia

W Storybook i komponentach dekoratora nie można uzyskać dostępu do instancji Vue w funkcjach fabrycznych dla domyślnych wartości prop:

```js
{
  props: {
    foo: {
      default() {
        return this.bar; // does not work!
      }
    }
  }
}
```
