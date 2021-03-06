import * as postProcessor from 'i18next-sprintf-postprocessor';
import * as middleware from 'i18next-express-middleware';
import * as express from 'express';
import Backend from 'i18next-node-fs-backend';

import i18next from 'i18next';

/**
 * Module that enables i18n support for Express.js applications
 */
export class I18Next {

  static enableFor (app: express.Express) { // eslint-disable-line
    i18next
      .use(Backend)
      .use(postProcessor)
      .use(middleware.LanguageDetector)
      .init({
        ns: ['common', 'taskList'],
        backend: {
          loadPath: __dirname + '/../../locales/{{lng}}/{{ns}}.json',
          addPath: __dirname + '/../../locales/{{lng}}/{{ns}}.missing.json',
        },
        detection: {
          order: ['querystring', 'cookie'],
          lookupQuerystring: 'lang',
          lookupCookie: 'lang',
          caches: ['cookie'],
        },
        interpolation: {
          escapeValue: false, // Escaping is already handled by Nunjucks
        },
        fallbackLng: 'en',
        preload: ['en', 'cy'],
        saveMissing: true,
      });
    app.use(middleware.handle(i18next));
    return i18next;
  }
}
