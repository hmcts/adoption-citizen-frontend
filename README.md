# Adoption Frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/adoption-frontend.svg)](https://greenkeeper.io/)

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![codecov](https://codecov.io/gh/hmcts/adoption-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/hmcts/adoption-frontend)
## Purpose

This is the frontend application for Adoption. Service provides web UI for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can make adoption application.

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

  * [Node.js](https://nodejs.org/) v12.0.0 or later
  * [yarn](https://yarnpkg.com/)
  * [Gulp](http://gulpjs.com/)
  * [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

 ```bash
$ yarn install
 ```

Run:

```bash
$ gulp
```

The applications's home page will be available at https://localhost:3000

### Running with Docker

Create docker image:

```bash
  docker-compose build
```

Run the application by executing the following command:

```bash
  docker-compose up
```

This will start the frontend container exposing the application's port

In order to test if the application is up, you can visit https://localhost:3000 in your browser.

## Developing

### Code style

We use [TSLint](https://palantir.github.io/tslint/)
alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting:
```bash
$ yarn lint
```

### Running the tests

This template app uses [Mocha](https://mochajs.org/) as the test engine. You can run unit tests by executing
the following command:

```bash
$ yarn test
```

Here's how to run functional tests (the template contains just one sample test):

```bash
$ yarn test:routes
```

Running accessibility tests:

```bash
$ yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

### Security

#### CSRF prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention has already been
set up in this template, at the application level. However, you need to make sure that CSRF token
is present in every HTML form that requires it. For that purpose you can use the `csrfProtection` macro,
included in this template app. Your njk file would look like this:

```
{% from "macros/csrf.njk" import csrfProtection %}
...
<form ...>
  ...
    {{ csrfProtection(csrfToken) }}
  ...
</form>
...
```

#### Helmet

This application uses [Helmet](https://helmetjs.github.io/), which adds various security-related HTTP headers
to the responses. Apart from default Helmet functions, following headers are set:

* [Referrer-Policy](https://helmetjs.github.io/docs/referrer-policy/)
* [Content-Security-Policy](https://helmetjs.github.io/docs/csp/)
* [Public-Key-Pins](https://helmetjs.github.io/docs/hpkp/)

There is a configuration section related with those headers, where you can specify:
* `referrerPolicy` - value of the `Referrer-Policy` header
* `hpkp` - settings for `Public-Key-Pins` header:
  * `sha256s` - [Base64-encoded SHA-256 certificate hashes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Public_Key_Pinning)
  * `maxAge` - time, in seconds, that the browser should remember that this site is only to be accessed using one
  of the defined keys

Here's an example setup:

```json
    "security": {
      "referrerPolicy": "origin",
      "hpkp": {
        "maxAge": 2592000,
        "sha256s": [
          "M1J37nfPyNUdZgLkE3Iyz2BBqsK8Zjd344S5DVrnTVE=",
          "A1PTZTeHlA0idWnJThBl7rrbt1CoynD2vWcziKGDfkY="
        ]
      }
    }
```

Make sure you have those values set correctly for your application.

### Healthcheck

The application exposes a health endpoint (https://localhost:3000/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [health.ts](src/main/routes/health.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


