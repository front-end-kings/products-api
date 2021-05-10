import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '3m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '3m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '3m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '5m', target: 0 }, // scale down. Recovery stage.
  ],
};
// export default function () {
//   const BASE_URL = 'http://localhost:3030/api'; // make sure this is not production
//   let responses = http.batch([
//     [
//       'GET',
//       `${BASE_URL}/products`,
//     ],
//     [
//       'GET',
//       `${BASE_URL}/products/1`,
//     ],
//     [
//       'GET',
//       `${BASE_URL}/products/1/styles`,
//     ],
//   ]);
//   sleep(1);
// }

export default function () {
  // const rnd = Math.floor(Math.random() * 100);
  const response = http.get(`http://localhost:3030/api/products/1`);
  // console.log('Response time was ' + String(response.timings.duration) + ' ms');
  // check(response, {
  //     "is status 200": (r) => r.status === 200,
  // })
}