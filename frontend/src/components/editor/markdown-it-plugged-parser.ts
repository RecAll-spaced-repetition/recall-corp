import markdownit from 'markdown-it';

import highligher from 'highlight.js';

import markdownItMedia from '@gotfeedback/markdown-it-media';

import katex from 'katex';
import { tex } from '@mdit/plugin-tex';

export const simpleRenderer = markdownit({
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: (str, lang) => {
    if (highligher.getLanguage(lang)) {
      try {
        return highligher.highlight(str, { language: lang }).value;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        /* empty */
      }
    }
    return '';
  },
})
  .use(tex, {
    render: (content, isParagraph) => {
      const texStr = katex.renderToString(content, {
        output: 'mathml',
        throwOnError: false,
      });
      return isParagraph ? `<p>${texStr}</p>` : texStr;
    },
  })
  .disable('image');

export const extendedMdRenderer = markdownit({ ...simpleRenderer.options })
  .use(markdownItMedia, {
    controls: true,
  })
  .use(tex, {
    render: (content, isParagraph) => {
      const texStr = katex.renderToString(content, {
        output: 'mathml',
        throwOnError: false,
      });
      return isParagraph ? `<p>${texStr}</p>` : texStr;
    },
  });
