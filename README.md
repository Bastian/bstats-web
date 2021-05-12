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

## Dependencies

bStats uses Firebase Auth for authentication.
Thus, you have to create a [Firebase](https://firebase.google.com/) project and set the following environment variables:

| Variable                       | Default Value               | Description                                                                         |
| ------------------------------ | --------------------------- | ----------------------------------------------------------------------------------- |
| GOOGLE_APPLICATION_CREDENTIALS | ./service-account-file.json | The path to your service account file (Can be downloaded from the Firebase Console) |
| FIREBASE_DATABASE_NAME         | bstats-testing              | The id of your firebase project                                                     |

Additionally, you need to create a `firebase-config.json` file with the content of the firebase config in JSON format.
To obtain this config file, you have to create a web project first.
See [Learn about the Firebase config object](https://firebase.google.com/docs/web/setup?authuser=0#config-object) from the Firebase docs.

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
