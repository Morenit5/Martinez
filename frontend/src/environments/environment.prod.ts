import { env } from './.env';

export const environment = {
  production: true,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'es-ES'],
  apiUrl: 'http://192.168.0.224:3001/api/v1',
};
