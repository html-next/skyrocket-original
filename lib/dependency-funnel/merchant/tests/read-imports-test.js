const readImports = require('../read-imports');

function assert(msg, test) {
  if (!test) {
    throw new Error(msg);
  }
}

function expect(source, expected) {
  const imports = readImports(source);

  let isPassing = true;
  let unexpected = [];
  let unfound = [];
  let msg = '';

  expected.forEach((i) => {
    if (imports.indexOf(i) === -1) {
      isPassing = false;
      unfound.push(i);
    }
  });
  imports.forEach((i) => {
    if (expected.indexOf(i) === -1) {
      isPassing = false;
      unexpected.push(i);
    }
  });

  if (unexpected.length) {
    msg += 'Found unexpected imports: ["' + unexpected.join('", "') + '"]';
  }

  if (unfound.length) {
    if (msg.length) { msg += '\n' }
    msg += 'Expected but did not find the following imports: ["' + unfound.join('", "') + '"]';
  }

  assert(msg, isPassing);
}
function expectThrows(source, errorType) {
  let imports;
  let thrown = false;
  try {
    imports = readImports(source);
  } catch (e) {

  }

  if (!thrown) {
    throw new Error('Expected To Throw, did not');
  }
}

const niceTestSource = `
import Foo from './bar';
import { baz } from 'bam';
import { default as what } from '../../shazam';

import * from 'X';

`;
expect(niceTestSource, ['./bar', 'bam', '../../shazam', 'X']);

const hardTestSource = `
/* global foo*/
import Foo from './bar';
/*
import { baz } from 'bam';
*//*
import { default as what } from '../../shazam';*/
/*what
import * from 'X';
*/
import * from 'Y';
`;
expect(hardTestSource, ['./bar', 'Y']);

const openCommentTestSource = `
/* global foo*/
import Foo from './bar';
/*
import { baz } from 'bam';
*/
import { default as what } from '../../shazam';*/
/*what
import * from 'X';
*/
import * from 'Y';
`;
expectThrows(openCommentTestSource, `UnclosedCommentException`);

const openImportTestSource = `
import Foo from './bar';
import { baz from 'bam';
import { default as what } from '../../shazam';

import * from 'X';

`;
expectThrows(openCommentTestSource, `UnclosedImportException`);

const openAsTestSource = `
import Foo from './bar';
import { baz } from 'bam';
import { default as } from '../../shazam';

import * from 'X';

`;

const openStringTestSource = `
import Foo from './bar;
import { baz } from 'bam';
import { default as foo } from '../../shazam';

import * from 'X';

`;


const badPathTestSource = `
import Foo from './bar';
import { baz } from 'bam';
import { default as foo } from '/shazam';

import * from 'X';

`;

const badPathTestSource2 = `
import Foo from './bar';
import { baz } from 'bam';
import { default as foo } from 'foo../shazam';

import * from 'X';

`;

const badCurlyTestSource = `
import Foo from './bar';
import baz } from 'bam';
import { default as foo } from '../shazam';

import * from 'X';

`;

const unexpectedCharTestSource = `
import Foo from './bar';
import s{ baz } from 'bam';
import { default as foo } from '../shazam';

import * from 'X';

`;

const unexpectedCommentTestSource = `
import Foo from './bar';
import { baz /*, bam*/ } from 'bam';
import { default as foo } from '../shazam';

import * from 'X';

`;
const unexpectedCommentTestSource2 = `
import Foo from './bar';
// import { baz } from 'bam';
//import { default as foo } from '../shazam';

import * from 'X';

`;
const expectedCommentTestSource = `
import Foo from './bar';
import { baz } from 'bam'; // is foo
import { default as foo } from '../shazam';

import * from 'X';

`;
const multiLineTestSource = `
import Foo from './bar';
import {
 baz
 } from 'bam'; // is foo
import { default as foo } from '../shazam';

import * from 'X';

`;

const unexpectedCharTestSource2 = `
import Foo from './bar';
import { baz } from s'bam';
import { default as foo } from '../shazam';

import * from 'X';

`;

const unexpectedLineTestSource = `
import Foo from './bar';
import { baz } from 'bam';
const { foo } = baz;
import { default as foo } from '../shazam';

import * from 'X';

`;
const missingNewLineTestSource2 = `
import Foo from './bar';import { baz } from s'bam';
import { default as foo } from '../shazam';

import * from 'X';

`;
