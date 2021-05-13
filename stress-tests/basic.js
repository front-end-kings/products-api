import http from 'k6/http';
import { check } from 'k6';

export default function () {
   // const rnd = Math.floor(Math.random() * 100);
    const response = http.get('http://ec2-54-176-94-164.us-west-1.compute.amazonaws.com:3000/api/products/1');
    // console.log('Response time was ' + String(response.timings.duration) + ' ms');
    check(response, {
        "is status 200": (r) => r.status === 200,
    })
}

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
};
