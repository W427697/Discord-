<p align="center">
  <a href="https://storybook.js.org/">
    <img src="https://user-images.githubusercontent.com/321738/63501763-88dbf600-c4cc-11e9-96cd-94adadc2fd72.png" alt="Storybook" width="400" />
  </a>
</p>

<p align="center">Buduj szybciej kuloodporne elementy interfejsu użytkownika</p>

<br/>

<p align="center">
  <a href="https://circleci.com/gh/storybookjs/storybook">
    <img src="https://circleci.com/gh/storybookjs/storybook.svg?style=shield" alt="Build Status on CircleCI" />
  </a>
  <a href="https://www.codefactor.io/repository/github/storybookjs/storybook">
    <img src="https://www.codefactor.io/repository/github/storybookjs/storybook/badge" alt="CodeFactor" />
  </a>
  <a href="https://snyk.io/test/github/storybookjs/storybook">
    <img src="https://snyk.io/test/github/storybookjs/storybook/badge.svg" alt="Known Vulnerabilities" />
  </a>
  <a href="https://codecov.io/gh/storybookjs/storybook">
    <img src="https://codecov.io/gh/storybookjs/storybook/branch/master/graph/badge.svg" alt="codecov" />
  </a>
  <a href="https://github.com/storybookjs/storybook/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/storybookjs/storybook.svg" alt="License" />
  </a>
  <br/>
  <a href="https://discord.gg/sMFvFsG">
    <img src="https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat" />
  </a>
  <a href="https://now-examples-slackin-rrirkqohko.now.sh/">
    <img src="https://now-examples-slackin-rrirkqohko.now.sh/badge.svg?logo=slack" alt="Storybook Slack" />
  </a>
  <a href="#backers">
    <img src="https://opencollective.com/storybook/backers/badge.svg" alt="Backers on Open Collective" />
  </a>
  <a href="#sponsors">
    <img src="https://opencollective.com/storybook/sponsors/badge.svg" alt="Sponsors on Open Collective" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=storybookjs">
    <img src="https://badgen.net/twitter/follow/storybookjs?icon=twitter&label=%40storybookjs" alt="Official Twitter Handle" />
  </a>
</p>

Storybook to środowisko programistyczne dla komponentów interfejsu użytkownika.
Umożliwia przeglądanie biblioteki komponentów, przeglądanie różnych stanów każdego komponentu oraz interaktywne rozwijanie i testowanie komponentów.

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/master/media/storybook-intro.gif" width="100%" />
</center>

<p align="center">
  View README for:<br/>
  <a href="https://github.com/storybookjs/storybook/blob/master/README.md" title="latest"><img alt="latest" src="https://img.shields.io/npm/v/@storybook/core/latest.svg" /></a>
  <a href="https://github.com/storybookjs/storybook/blob/next/README.md" title="next"><img alt="next" src="https://img.shields.io/npm/v/@storybook/core/next.svg" /></a>
</p>

## Wprowadzenie

Storybook działa poza twoją aplikacją. Pozwala to na tworzenie komponentów interfejsu użytkownika w izolacji, co może poprawić ponowne użycie komponentów, testowalność i szybkość programowania. Możesz budować szybko, nie martwiąc się o zależności specyficzne dla aplikacji.

Oto kilka polecanych przykładów, do których możesz się odwołać, aby zobaczyć, jak działa Storybook: <https://storybook.js.org/examples/>

Storybook przychodzi z wieloma [dodatkami](https://storybook.js.org/addons/introduction/) do projektowania komponentów, dokumentacji, testowania, interaktywności i tak dalej. Interfejs API Storybook umożliwia konfigurowanie i rozszerzanie na różne sposoby. Został nawet rozszerzony, aby wspierać rozwój React Native na urządzenia mobilne.

## Tłumaczenia

- [Polski](https://github.com/mbiesiad/storybook/tree/pl_PL)

## Spis treści

- 🚀[Rozpocznij](#rozpocznij)
- 📒[Projekty](#projekty)
  - 🛠[Wspierane frameworki & przykłady](#wspieraneframeworki--przykłady)
  - 🚇[Podprojekty](#podprojekty)
  - 🔗[Rozszerzenia, dodatki](#rozszerzeniadodatki)
- 🏅[Odznaki & materiały prezentacyjne](#odznaki--materiały-prezentacyjne)
- 👥[Społeczność](#społeczność)
- 👏[Współtworzenie](#współtworzenie)
  - 👨‍💻[Skrypty programistyczne](#skrypty-programistyczne)
  - 💵[Backers](#backers)
  - 💸[Sponsorzy](#sponsorzy)
- :memo:[Licencja](#licencja)

## Rozpocznij

Na początku zainstraluj storybook:

```sh
cd my-react-app
npx -p @storybook/cli sb init
```

Jeśli wolisz samodzielnie skonfigurować projekt, zapoznaj się z naszym [Slow Start Guide](https://storybook.js.org/basics/slow-start-guide/).

Po zainstalowaniu możesz `npm run storybook` i uruchomić serwer programistyczny na twoim komputerze lokalnym i uzyskasz URL do przeglądania przykładowych historii.

**Storybook v2.x notatka migracji**:
Jeśli używasz Storybook v2.x i chcesz przejść do wersji 4.x, najłatwiej jest to zrobić tak:

```sh
cd my-storybook-v2-app
npx -p @storybook/cli sb init
```

Działa w trybie codemod, aby zaktualizować wszystkie nazwy pakietów. Przeczytaj wszystkie szczegóły migracji w naszym [Migration Guide](MIGRATION.md)

Aby uzyskać pełną dokumentację dotyczącą korzystania ze Storybook, odwiedź stronę: [storybook.js.org](https://storybook.js.org)

Aby uzyskać dodatkową pomoc, dołącz do nas [na naszym Discord](https://discord.gg/sMFvFsG) lub [Slack](https://now-examples-slackin-rrirkqohko.now.sh/)

## Projekty

### Wspierane frameworki

| Framework                        | Demo                                                                        |                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [React](app/react)               | [v5.3.0](https://storybookjs.netlify.com/official-storybook/?path=/story/*) | [![React](https://img.shields.io/npm/dm/@storybook/react.svg)](app/react)                      |
| [React Native](app/react-native) | -                                                                           | [![React Native](https://img.shields.io/npm/dm/@storybook/react-native.svg)](app/react-native) |
| [Vue](app/vue)                   | [v5.3.0](https://storybookjs.netlify.com/vue-kitchen-sink/)                 | [![Vue](https://img.shields.io/npm/dm/@storybook/vue.svg)](app/vue)                            |
| [Angular](app/angular)           | [v5.3.0](https://storybookjs.netlify.com/angular-cli/)                      | [![Angular](https://img.shields.io/npm/dm/@storybook/angular.svg)](app/angular)                |
| [Marionette.js](app/marionette)  | -                                                                           | [![Marionette.js](https://img.shields.io/npm/dm/@storybook/marionette.svg)](app/marionette)    |
| [Mithril](app/mithril)           | [v5.3.0](https://storybookjs.netlify.com/mithril-kitchen-sink/)             | [![Mithril](https://img.shields.io/npm/dm/@storybook/mithril.svg)](app/mithril)                |
| [Marko](app/marko)               | [v5.3.0](https://storybookjs.netlify.com/marko-cli/)                        | [![Marko](https://img.shields.io/npm/dm/@storybook/marko.svg)](app/marko)                      |
| [HTML](app/html)                 | [v5.3.0](https://storybookjs.netlify.com/html-kitchen-sink/)                | [![HTML](https://img.shields.io/npm/dm/@storybook/html.svg)](app/html)                         |
| [Svelte](app/svelte)             | [v5.3.0](https://storybookjs.netlify.com/svelte-kitchen-sink/)              | [![Svelte](https://img.shields.io/npm/dm/@storybook/svelte.svg)](app/svelte)                   |
| [Riot](app/riot)                 | [v5.3.0](https://storybookjs.netlify.com/riot-kitchen-sink/)                | [![Riot](https://img.shields.io/npm/dm/@storybook/riot.svg)](app/riot)                         |
| [Ember](app/ember)               | [v5.3.0](https://storybookjs.netlify.com/ember-cli/)                        | [![Ember](https://img.shields.io/npm/dm/@storybook/ember.svg)](app/ember)                      |
| [Preact](app/preact)             | [v5.3.0](https://storybookjs.netlify.com/preact-kitchen-sink/)              | [![Preact](https://img.shields.io/npm/dm/@storybook/preact.svg)](app/preact)                   |
| [Rax](app/rax)                   | [v5.3.0](https://storybookjs.netlify.com/rax-kitchen-sink/)                 | [![Rax](https://img.shields.io/npm/dm/@storybook/rax.svg)](app/rax)                            |

### Podprojekty

- [CLI](lib/cli) - Usprawniona instalacja dla różnych typów aplikacji
- [przykłady](examples) - Przykłady kodu ilustrujące różne przypadki użycia Storybook

### Rozszerzenia, dodatki

| Addons                                      |                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| [a11y](addons/a11y/)                        | Test components for user accessibility in Storybook                        |
| [actions](addons/actions/)                  | Log actions as users interact with components in the Storybook UI          |
| [backgrounds](addons/backgrounds/)          | Let users choose backgrounds in the Storybook UI                           |
| [contexts](addons/contexts/)                | Interactively inject component contexts for stories in the Storybook UI    |
| [cssresources](addons/cssresources/)        | Dynamically add/remove css resources to the component iframe               |
| [design assets](addons/design-assets/)      | View images, videos, weblinks alongside your story                         |
| [docs](addons/docs/)                        | Add high quality documentation to your components                          |
| [events](addons/events/)                    | Interactively fire events to components that respond to EventEmitter       |
| [google-analytics](addons/google-analytics) | Reports google analytics on stories                                        |
| [graphql](addons/graphql/)                  | Query a GraphQL server within Storybook stories                            |
| [jest](addons/jest/)                        | View the results of components' unit tests in Storybook                    |
| [knobs](addons/knobs/)                      | Interactively edit component prop data in the Storybook UI                 |
| [links](addons/links/)                      | Create links between stories                                               |
| [options](addons/options/)                  | Customize the Storybook UI in code                                         |
| [query params](addons/queryparams/)         | Mock query params                                                          |
| [storyshots](addons/storyshots/)            | Snapshot testing for components in Storybook                               |
| [storysource](addons/storysource/)          | View the code of your stories within the Storybook UI                      |
| [viewport](addons/viewport/)                | Change display sizes and layouts for responsive components using Storybook |

Zobacz [Addon / Framework Support Table](ADDONS_SUPPORT.md)

### Przestarzałe dodatki

| Addons                                      |                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| [info](https://github.com/storybookjs/storybook/tree/master/addons/info)                                        | Annotate stories with extra component usage information                    |
| [notes](https://github.com/storybookjs/storybook/tree/master/addons/notes)                                       | Annotate Storybook stories with notes                                      |

Aby nadal ulepszać twoje wrażenia, musimy ostatecznie wycofać niektóre dodatki na rzecz nowych, lepszych narzędzi.

Jeśli korzystasz z info/notes, zalecamy migrację do [docs](addons/docs/), a [tutaj jest poradnik](addons/docs/docs/recipes.md#migrating-from-notesinfo-addons), aby ci pomóc.

## Odznaki & materiały prezentacyjne

Mamy badge'a! Połącz go ze swoim przykładem Storybook.

![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)

```md
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](link to site)
```

Jeśli szukasz materiału do wykorzystania w prezentacji na temat Storybook, takiego jak materiał wideo logo i kolory, których używamy itp. Możesz znaleźć to wszystko na naszej stronie [brand repo](https://github.com/storybookjs/brand).

## Społeczność

- Twitter: [@storybookjs](https://twitter.com/storybookjs)
- Blog: [Medium](https://medium.com/storybookjs)
- Chat: [Slack](https://now-examples-slackin-rrirkqohko.now.sh/)
- Dyskusje: [Discord](https://discord.gg/sMFvFsG)
- Streaming zapisany na: [Youtube](https://www.youtube.com/channel/UCr7Quur3eIyA_oe8FNYexfg)

## Współtworzenie

Zachęcamy do współtworzenia Storybook!

- 📥 Pull requesty oraz 🌟 Stars są mile widziane.
- Przeczytaj nasz [contributing guide](CONTRIBUTING.md), aby zacząć.
  lub znajdź nas na [Discord](https://discord.gg/sMFvFsG), poświęcimy czas, aby ci pomóc

Szukasz pierwszego problemu do rozwiązania?

- Oznaczamy problemy za pomocą [![Good First Issue](https://img.shields.io/github/issues/storybookjs/storybook/good%20first%20issue.svg)](https://github.com/storybookjs/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) gdy uważamy, że są one odpowiednie dla osób, które są nowicjuszami w kodowaniu lub ogólnie OSS.
- [Rozmawiaj z nami](https://discord.gg/sMFvFsG), znajdziemy coś odpowiadającego twoim umiejętnościom i zainteresowaniom edukacyjnym.

### Skrypty programistyczne

Storybook jest zorganizowany jako użycie monorepo [Lerna](https://lerna.js.org/). Przydatne skrypty to:

#### `yarn bootstrap`

> Instaluje zależności pakietów i łączy pakiety razem - za pomocą lerna

#### `yarn run publish`

> Push a release to git and npm
> will ask for version in interactive mode - using lerna.

#### `yarn lint`

> boolean check if code conforms to linting rules - uses remark & eslint

- `yarn lint:js` - will check js
- `yarn lint:md` - will check markdown + code samples

- `yarn lint:js --fix` - will automatically fix js

#### `yarn test`

> boolean check if unit tests all pass - uses jest

- `yarn run test --core --watch` - will run core tests in watch-mode

### Sponsorzy

Zostań sponsorem i zdobądź logo na naszym README na GitHub z linkiem do Twojej witryny. \[[Zostań sponsorem](https://opencollective.com/storybook#sponsor)]

<a href="https://opencollective.com/storybook/sponsor/0/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/1/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/2/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/3/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/4/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/5/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/6/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/7/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/8/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/9/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/10/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/11/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/12/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/13/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/14/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/15/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/16/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/17/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/18/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/19/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/20/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/21/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/22/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/23/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/24/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/25/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/26/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/27/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/28/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/29/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/29/avatar.svg"></a>

### Backers

Wesprzyj nas co miesiąc darowizną i pomóż nam kontynuować nasze działania. \[[Zostań backerem](https://opencollective.com/storybook#backer)]

<a href="https://opencollective.com/storybook/backer/0/website" target="_blank"><img src="https://opencollective.com/storybook/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/1/website" target="_blank"><img src="https://opencollective.com/storybook/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/2/website" target="_blank"><img src="https://opencollective.com/storybook/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/3/website" target="_blank"><img src="https://opencollective.com/storybook/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/4/website" target="_blank"><img src="https://opencollective.com/storybook/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/5/website" target="_blank"><img src="https://opencollective.com/storybook/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/6/website" target="_blank"><img src="https://opencollective.com/storybook/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/7/website" target="_blank"><img src="https://opencollective.com/storybook/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/8/website" target="_blank"><img src="https://opencollective.com/storybook/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/9/website" target="_blank"><img src="https://opencollective.com/storybook/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/10/website" target="_blank"><img src="https://opencollective.com/storybook/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/11/website" target="_blank"><img src="https://opencollective.com/storybook/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/12/website" target="_blank"><img src="https://opencollective.com/storybook/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/13/website" target="_blank"><img src="https://opencollective.com/storybook/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/14/website" target="_blank"><img src="https://opencollective.com/storybook/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/15/website" target="_blank"><img src="https://opencollective.com/storybook/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/16/website" target="_blank"><img src="https://opencollective.com/storybook/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/17/website" target="_blank"><img src="https://opencollective.com/storybook/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/18/website" target="_blank"><img src="https://opencollective.com/storybook/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/19/website" target="_blank"><img src="https://opencollective.com/storybook/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/20/website" target="_blank"><img src="https://opencollective.com/storybook/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/21/website" target="_blank"><img src="https://opencollective.com/storybook/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/22/website" target="_blank"><img src="https://opencollective.com/storybook/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/23/website" target="_blank"><img src="https://opencollective.com/storybook/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/24/website" target="_blank"><img src="https://opencollective.com/storybook/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/25/website" target="_blank"><img src="https://opencollective.com/storybook/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/26/website" target="_blank"><img src="https://opencollective.com/storybook/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/27/website" target="_blank"><img src="https://opencollective.com/storybook/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/28/website" target="_blank"><img src="https://opencollective.com/storybook/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/29/website" target="_blank"><img src="https://opencollective.com/storybook/backer/29/avatar.svg"></a>

## Licencja

[MIT](https://github.com/storybookjs/storybook/blob/master/LICENSE)

-Koniec-

_________________________________________

Stworzone przez @[storybookjs](https://github.com/storybookjs) polska wersja od @[mbiesiad](https://github.com/mbiesiad)
