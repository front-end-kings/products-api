import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const rnd = Math.floor(Math.random() * 100);
    const response = http.get(`http://localhost:3030/api/products/${rnd}`);
    console.log('Response time was ' + String(response.timings.duration) + ' ms');
    // check(response, {
    //     "is status 200": (r) => r.status === 200,
    // })
}

export let options = {
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 }, // spike to 1400 users
    { duration: '3m', target: 1400 }, // stay at 1400 for 3 minutes
    { duration: '10s', target: 100 }, // scale down. Recovery stage.
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};