import { describe, expect, test } from 'vitest';
import { EditorElementState, mutations } from './editorElementTypes';

describe('Markdown formatters', () => {
  test('Bold empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.bold(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 2,
      str: '****',
    });
  });

  test('Bold zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.bold(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 3,
      str: 'a****bc',
    });
  });

  test('Bold one-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.bold(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: 'a**b**c',
    });
  });

  test('Bold all-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.bold(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '**abc**',
    });
  });

  test('Bold multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.bold(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 8,
      str: 'a**bc\nde**f',
    });
  });
});
