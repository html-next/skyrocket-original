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

function readImports(source) {
  const state = {
    imports: [],
    isInCommentBlock: 0,
    isInCommentLine: false,
    isInString: false,
    isInQuoteString: false,
    isInTickString: false,
    isInCurly: false,
    isInExplicitDeclaration: false,
    hasOpenImport: false,
    openImport: ''
  };

  for (let i = 0; i < source.length; i++) {
    let char = source[i];

    if (isUnexpectedChar(state, char)) {
      break;
    }

    if (isSafeWhiteSpace(state, char)) {
      continue;
    }

    switch (char) {
      case '/':
        break;
      case '*':
        break;
      case 'i':
        break;
      case ';':
        break;
      case '{':
        break;
      case '}':
        break;
      default:
        break;
    }
  }

  return state.imports;
}

function isUnexpectedChar(state, char) {

}

const WHITE_SPACE = /\s/;

function isSafeWhiteSpace(state, char) {
  let isWhiteSpace = WHITE_SPACE.test(char);

  if (!isWhiteSpace) {
    return false;
  }

  if (state.hasOpenImport) {
    if (state.isInString) {
      throw new Error('Unexpected Whitespace in Import Location String');
    }
  }

  return true;
}

module.exports = readImports;
