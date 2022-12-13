import a from './a';
// require('./index.scss');
import './index.scss';

console.log('hello webpack!!!')
a();

// process.env.NODE_ENV
if (process.env.NODE_ENV === 'development') {
  console.log('baseurl is localhost!');
} else {
  console.log('baseurl is prod')
}
