import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'es-ES'],
  apiUrl: 'http://localhost:3001/api/v1',
};
