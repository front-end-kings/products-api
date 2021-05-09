import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const rnd = Math.floor(Math.random() * 100);
    const response = http.get(`http://localhost:3030/api/products/${rnd}`);
    console.log('Response time was ' + String(response.timings.duration) + ' ms');
    check(response, {
        "is status 200": (r) => r.status === 200,
    })
}

export let options = {
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};