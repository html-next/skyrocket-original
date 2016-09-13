import { Worker } from 'skyrocket';
import api from './interface';

export default Worker.extend({
  'interface': api,
  myFunction() {},
  totallyUniqueFunctionName() {}
});
