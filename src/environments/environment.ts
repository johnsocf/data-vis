// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDY-bebet7a6e0FOxCuXRDE4LqBucvqEds',
    authDomain: 'climate-indicators.firebaseapp.com',
    databaseURL: 'https://climate-indicators.firebaseio.com',
    projectId: 'climate-indicators',
    storageBucket: 'climate-indicators.appspot.com',
    messagingSenderId: '764098065850'
  }
};
