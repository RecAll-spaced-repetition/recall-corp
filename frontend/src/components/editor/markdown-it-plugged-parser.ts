import markdownit from 'markdown-it';

import highligher from 'highlight.js';

import markdownItMedia from '@gotfeedback/markdown-it-media';

import katex from 'katex';
import { tex } from '@mdit/plugin-tex';

export const simpleRenderer = markdownit({
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: (str, lang, attrs) => {
    if (highligher.getLanguage(lang)) {
      try {
        return highligher.highlight(str, { language: lang }).value;
      } catch (_) {
        /* empty */
      }
    }
    return '';
  },
})
  .use(tex, {
    render: (content, mode) => {
      const texStr = katex.renderToString(content, {
        output: 'mathml',
        throwOnError: false,
      });
      return !mode ? texStr : `<p>${texStr}</p>`;
    },
  })
  .disable('image');

export const extendedMdRenderer = markdownit({ ...simpleRenderer.options })
  .use(markdownItMedia, {
    controls: true,
  })
  .use(tex, {
    render: (content, mode) => {
      const texStr = katex.renderToString(content, {
        output: 'mathml',
        throwOnError: false,
      });
      return !mode ? texStr : `<p>${texStr}</p>`;
    },
  });
