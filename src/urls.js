const production = 'https://poem-builder.herokuapp.com';
const development = 'http://localhost:3000';
export const url_base = (process.env.REACT_APP_ENVIRONMENT === 'development' ? development : production);