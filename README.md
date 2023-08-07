# [exchangerate.host](https://exchangerate.host/) API

This is an JavaScript/TypeScript SDK for the [exchangerate.host](https://exchangerate.host/).
The API responses are based on official API documentation

## Requirements

Because this SDK uses `fetch` both in Node and the Browser, and ESM, we require the following:

- Node 18.0.0 or higher
- A modern, version infinite, browser

The package contains both an ESM and CommonJS build, so you can use it in both Node and the Browser.

## Running the example app

First install the dependencies:

```bash
yarn install
```

To run the app:

```bash
yarn run start
```

### Creating a client instance

Creating an instance of the SDK is easy

```js
import {ExchangerateHostApi} from '@checksanity/exchangerate-host-api';

const api = ExchangerateHostApi.create();
```

Each of these factory methods will return a `ExchangerateHostApi` instance, which you can use to
make
requests to the exchangerate.host API.

```js
const result = await api.getLatest();
console.log(result);
```

### Extensibility

All of the constructors support a configuration object that lets you override the default behavior
of the SDK.

```ts
const defaultConfig: SdkConfiguration = {
    fetch: (req: RequestInfo | URL, init: RequestInit | undefined) =>
        fetch(req, init),
    url: '<your custom url>',
};
```

As a general rule, this options should be overridden when you create your instance of the client,
and you probably won't have to change most of them unless you have some very specific requirements.

You can provide the options like this, to any of the constructors or static initialization methods:

```js
const opts = {
    fetch: (req, init) => {
        console.log("Fire custom fetch first");
        return fetch(req, init);
    }
}

const sdk = ExchangerateHostApi.create(opts);
```

All the below examples are in TypeScript, but the same method signatures all apply to JavaScript -
just without the Type information.

## Running the tests

You can run the tests with `yarn run test`.
