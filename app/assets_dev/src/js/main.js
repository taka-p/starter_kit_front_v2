// import {async} from 'babel-polyfill';

// const sleep = (msec) => new Promise((resolve) => {
//   setTimeout(resolve, msec);
// });

// (async () => {
//   console.log('start');
//   await sleep(2000);
//   console.log('end');
// })();

const hoge = 'hoge';

class Hoge {
  constructor(hoge) {
    this.hoge + hoge;
  }
  init() {
    this.name = 'hoge';
  }
}

new Hoge('foo');
