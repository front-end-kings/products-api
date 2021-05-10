import { check, sleep } from 'k6';
import { NewRel } from './nr-statsd.js'
import http from 'k6/http';

const apiKey = 'NRAK-W3HMPO358T7S9GCXVIAAZCZYJSV';
const nr = new NewRel(apiKey);

export const options = {
  vus: 10,
  duration: '10s',
  // tags: {
  //   testName: 'Tuesdays are for testing',
  //   user: 'nerd@newrelic.com'
  // }
}

export function setup() {
  nr.PrintAlertingStatus();
  nr.Notify(
    'Sunday load test - short',
    'START',
    'Beginning E2E load test script',
    'gspencer@newrelic.com',
  );
}

export default function () {
  const rnd = Math.floor(Math.random() * 100);
  const response = http.get(`http://localhost:3030/api/products/${rnd}`);
  // console.log('Response time was ' + String(response.timings.duration) + ' ms');
  check(response, {
      "is status 200": (r) => r.status === 200,
  })
}

// function execFrontPage() {
//   const res = http.get(
//     'http://nodeworkshop.eu-west-2.elasticbeanstalk.com',
//     { type: 'part-of-test' },
//   );

//   check(res, {
//     'was succesful': (r) => r.status == 200,
//     'contains the header': (r) => r.body.includes('New Relic Node Workshop')
//   })
// }

// function execMathUrl(url) {
//   const res = http.get(url, { type: 'part-of-test' });

//   return check(res, {
//     'was succesful': (r) => r.status === 200,
//     'has body': (r) => r.body && r.body != '',
//     'returns 10': (r) => parseInt(JSON.parse(r.body).x, 10) === 10
//   })
// }

export function teardown(data) {
  nr.Notify(
    'Sunday load test - short',
    'END',
    'Finishing E2E load test script',
    'gspencer@newrelic.com'
    );
  nr.PrintAlertingStatus();
}