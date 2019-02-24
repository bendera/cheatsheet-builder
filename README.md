# Cheatsheet builder

Boilerplate (framework?) for creating printable developer cheatsheets. See src/eleventy/cheatsheets directory for examples.

## Prerequisites

* Node.js
* Docker

## Install

Run following commands in the top level directory of the project:

```shell
npm ci
bash setup-docker.sh
```

## Start development server

```shell
npm run serve
```

If you want to modify the stylesheets you have to execute following command in separated terminal:

```shell
npm run serve:styles
```

## Install custom fonts

1. Generate an API key on the [Google Fonts](https://developers.google.com/fonts/docs/developer_api#identifying_your_application_to_google). Rename config.js.dist to config.js and fill with your api key.

2. Download fonts. Ex.:

```shell
node bin/dlfonts.js Roboto 'Open Sans'
```

3. Add font imports to src/styles/includes/fonts.postcss

```css
@import url(fonts/Roboto-Black.postcss);
@import url(fonts/Roboto-BlackItalic.postcss);
/* etc. */
```

4. Rebuild the container

```
bash setup-docker.sh
```

## Build

And finally build your own beautiful, printable stylesheets. :) You can find the generated pdf files in the dist/pdf directory.

```shell
npm run build
```
