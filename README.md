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

# production
$ npm run build
$ npm run start
```

## Docker Compose

The Docker Compose file allows you to start the bStats web frontend.
You can simply run `docker-compose up` to start it.

## TODOs

Svelte and Sapper are a very new technology and there's a lot of stuff that not working perfectly.

This is an (incomplete) list of things about the current project structure that bother me:

### Imports from `@sapper/common` are not working

IntelliJ is unable to show me any documentation for imports from `@sapper/common`.
However, Typescript compiles just fine and the `@sapper/common` is declared.
So I assume that this is a bug in IntelliJ...

### Api method require you to pass `this.fetch` and `API_BASE_URL`

It's not a supper big deal, but I would prefer to not have to pass them as a parameter for every
single api method.

## License

This project is licensed under the [MIT License](/LICENSE).
