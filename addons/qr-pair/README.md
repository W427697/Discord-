# Storybook Addon Qr Pair

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

Storybook for React Native supports hosting Storybook manager in a server. It supports multiple users but there is no way to
pair them. QR Pair addon displays necessary data to connect manager and preview.

![Screenshot](docs/screenshot.png)

## Getting Started

### Install:

```sh
npm i -D @storybook/addon-qr-pair
```

Then, add following content to `.storybook/addons.js`

```javascript
import '@storybook/addon-qr-pair/register';
```

### Reading the Qr Code:
React Native can be used in many different ways (expo, crna, with custom navigation solutions) so there is no common solution for qr code reading.
[https://github.com/Gongreg/RNStorybookClientExample/blob/master/App.js](Client example).
