# bStats Web

The frontend for the bStats website.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev
```

## Docker Compose

The Docker Compose file allows you to start the bStats web frontend.
You can simply run `docker-compose up` to start it.

## TODOs

Svelte and SvelteKit are a very new technology and there's a lot of stuff that not working perfectly.

This is an (incomplete) list of things about the current project structure that bother me:

### Api method require you to pass `fetch` and `API_BASE_URL`

It's not a supper big deal, but I would prefer to not have to pass them as a parameter for every single api method.

### Load fonts from npm

Currently, the fonts reside in the `/static/fonts` folder and are manually imported in the `app.html` file.
I would prefer to use npm to download and serve the fonts, however this does not work properly (see https://github.com/fontsource/fontsource/issues/133).

## License

This project is licensed under the [MIT License](/LICENSE).
