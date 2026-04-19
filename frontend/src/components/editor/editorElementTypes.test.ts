import { describe, expect, test } from 'vitest';
import { EditorElementState, mutations } from './editorElementTypes';

describe('Markdown formatters: bold', () => {
  test('Empty', () => {
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

  test('Zero-selection', () => {
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

  test('One-line selection', () => {
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

  test('All-line selection', () => {
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

  test('Multi-line selection', () => {
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

describe('Markdown formatters: italic', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.italic(state);

    expect(newState).toStrictEqual({
      selectionStart: 1,
      selectionEnd: 1,
      str: '**',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.italic(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 2,
      str: 'a**bc',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.italic(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 3,
      str: 'a*b*c',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.italic(state);

    expect(newState).toStrictEqual({
      selectionStart: 1,
      selectionEnd: 4,
      str: '*abc*',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.italic(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 7,
      str: 'a*bc\nde*f',
    });
  });
});

describe('Markdown formatters: quote', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.quote(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 2,
      str: '> ',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.quote(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 3,
      str: '> abc',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.quote(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: '> abc',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.quote(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '> abc',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.quote(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 10,
      str: '> abc\n> def',
    });
  });
});

describe('Markdown formatters: code', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.code(state);

    expect(newState).toStrictEqual({
      selectionStart: 4,
      selectionEnd: 4,
      str: '```\n\n```',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.code(state);

    expect(newState).toStrictEqual({
      selectionStart: 5,
      selectionEnd: 5,
      str: '```\nabc\n```',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.code(state);

    expect(newState).toStrictEqual({
      selectionStart: 5,
      selectionEnd: 6,
      str: '```\nabc\n```',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.code(state);

    expect(newState).toStrictEqual({
      selectionStart: 4,
      selectionEnd: 7,
      str: '```\nabc\n```',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.code(state);

    expect(newState).toStrictEqual({
      selectionStart: 5,
      selectionEnd: 10,
      str: '```\nabc\ndef\n```',
    });
  });
});

describe('Markdown formatters: ul', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.ul(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 2,
      str: '- ',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.ul(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 3,
      str: '- abc',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.ul(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: '- abc',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.ul(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '- abc',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.ul(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 10,
      str: '- abc\n- def',
    });
  });
});

describe('Markdown formatters: ol', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.ol(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 3,
      str: '1. ',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.ol(state);

    expect(newState).toStrictEqual({
      selectionStart: 4,
      selectionEnd: 4,
      str: '1. abc',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.ol(state);

    expect(newState).toStrictEqual({
      selectionStart: 4,
      selectionEnd: 5,
      str: '1. abc',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.ol(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 6,
      str: '1. abc',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.ol(state);

    expect(newState).toStrictEqual({
      selectionStart: 4,
      selectionEnd: 12,
      str: '1. abc\n1. def',
    });
  });
});

describe('Markdown formatters: link', () => {
  test('Empty, no link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.link(state);

    expect(newState).toStrictEqual({
      selectionStart: 14,
      selectionEnd: 14,
      str: '\n[ ... ](url)\n',
    });
  });

  test('Empty, link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.link(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 15,
      selectionEnd: 15,
      str: '\n[ ... ](link)\n',
    });
  });

  test('Zero-selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.link(state);

    expect(newState).toStrictEqual({
      selectionStart: 15,
      selectionEnd: 15,
      str: 'a\n[ ... ](url)\nbc',
    });
  });

  test('Zero-selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.link(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 16,
      selectionEnd: 16,
      str: 'a\n[ ... ](link)\nbc',
    });
  });

  test('One-line selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.link(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 3,
      str: 'a[b](url)c',
    });
  });

  test('One-line selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.link(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 3,
      str: 'a[b](link)c',
    });
  });

  test('All-line selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.link(state);

    expect(newState).toStrictEqual({
      selectionStart: 1,
      selectionEnd: 4,
      str: '[abc](url)',
    });
  });

  test('All-line selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.link(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 1,
      selectionEnd: 4,
      str: '[abc](link)',
    });
  });

  test('Multi-line selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.link(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 7,
      str: 'a[bc\nde](url)f',
    });
  });

  test('Multi-line selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.link(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 7,
      str: 'a[bc\nde](link)f',
    });
  });
});

describe('Markdown formatters: media', () => {
  test('Empty, no link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.media(state);

    expect(newState).toStrictEqual({
      selectionStart: 21,
      selectionEnd: 21,
      str: '\n![ ... ](media_url)\n',
    });
  });

  test('Empty, link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.media(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 16,
      selectionEnd: 16,
      str: '\n![ ... ](link)\n',
    });
  });

  test('Zero-selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.media(state);

    expect(newState).toStrictEqual({
      selectionStart: 22,
      selectionEnd: 22,
      str: 'a\n![ ... ](media_url)\nbc',
    });
  });

  test('Zero-selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.media(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 17,
      selectionEnd: 17,
      str: 'a\n![ ... ](link)\nbc',
    });
  });

  test('One-line selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.media(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: 'a![b](media_url)c',
    });
  });

  test('One-line selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.media(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: 'a![b](link)c',
    });
  });

  test('All-line selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.media(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '![abc](media_url)',
    });
  });

  test('All-line selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.media(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '![abc](link)',
    });
  });

  test('Multi-line selection, no link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.media(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 8,
      str: 'a![bc\nde](media_url)f',
    });
  });

  test('Multi-line selection, link', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.media(state, 'link');

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 8,
      str: 'a![bc\nde](link)f',
    });
  });
});

describe('Markdown formatters: h1', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.h1(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 2,
      str: '# ',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.h1(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 3,
      str: '# abc',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.h1(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: '# abc',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.h1(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '# abc',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.h1(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 10,
      str: '# abc\n# def',
    });
  });
});

describe('Markdown formatters: ul', () => {
  test('Empty', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 0,
      str: '',
    };

    const newState = mutations.tab(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 2,
      str: '  ',
    });
  });

  test('Zero-selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 1,
      str: 'abc',
    };

    const newState = mutations.tab(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 3,
      str: '  abc',
    });
  });

  test('One-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 2,
      str: 'abc',
    };

    const newState = mutations.tab(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 4,
      str: '  abc',
    });
  });

  test('All-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 0,
      selectionEnd: 3,
      str: 'abc',
    };

    const newState = mutations.tab(state);

    expect(newState).toStrictEqual({
      selectionStart: 2,
      selectionEnd: 5,
      str: '  abc',
    });
  });

  test('Multi-line selection', () => {
    const state: EditorElementState = {
      selectionStart: 1,
      selectionEnd: 6,
      str: 'abc\ndef',
    };

    const newState = mutations.tab(state);

    expect(newState).toStrictEqual({
      selectionStart: 3,
      selectionEnd: 10,
      str: '  abc\n  def',
    });
  });
});
