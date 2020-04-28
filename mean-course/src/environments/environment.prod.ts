const protocol = 'https://';
const hostname = 'keytrader.xyz';
const portNumber = ''; // portnumber needs to be :numb if used
const url = protocol + hostname + portNumber;

function getApiUrl(apiEndpoint: string) {
  return url + '/api/' + apiEndpoint;
}

export const environment = {
  production: true,
  hostname,
  protocol,
  portNumber,
  url,
  getApiUrl
};
