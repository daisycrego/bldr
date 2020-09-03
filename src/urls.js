const production  = 'https://poem-builder.herokuapp.com';
const development = 'http://localhost:5000';
export const url_base = (process.env.REACT_APP_ENVIRONMENT === 'development' ? development : production);