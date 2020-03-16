import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import { i18n } from 'i18next';

export class Nunjucks {
  constructor(public developmentMode: boolean, public i18next: i18n) {
    this.developmentMode = developmentMode;
    this.i18next = i18next;
  }

  enableFor (app: express.Express): void {
    app.set('view engine', 'njk');
    const govUkFrontendPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'node_modules',
      'govuk-frontend',
    );

    const nunjucksEnv = nunjucks.configure([
      path.join(__dirname,'..','..','views'),
      path.join(__dirname,'..','..','app','case'),
      govUkFrontendPath,
    ], {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

    // Enables i18next translate method globally in nujucks
    nunjucksEnv.addGlobal('t', (key: string): string => this.i18next.t(key));

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
