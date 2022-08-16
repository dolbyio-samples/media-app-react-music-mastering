export const environment = {
  production: true,
  mapiApiKey: process.env['NX_PROD_MAPI_KEY']!,
  mapiApiSecret: process.env['NX_PROD_MAPI_SECRET']!,
  mapiServer: process.env['NX_PROD_MAPI_SERVER']!,
  usesSSL: process.env['NX_USES_SSL']!,
  sslKeyPath: process.env['NX_SSL_KEY_PATH']!,
  sslCertPath: process.env['NX_SSL_CERT_PATH']!,
  port: process.env['NX_PORT']!,
  hostname: process.env['NX_HOSTNAME']!,
};
