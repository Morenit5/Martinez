import { env } from './.env';

export const environment = {
  production: false,
  version: env['npm_package_version'] + '-dev',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'es-ES'],

  apiUrl: 'http://192.168.0.52:3001/api/v1',

  auth: { //preguntarle al chamaco si esto esta bien
    user: '', // ⚠️ Poner correo válido
    pass: '',     // ⚠️ Contraseña de aplicación
  },
  subject: 'Martinez - Factura electrónica',
};
