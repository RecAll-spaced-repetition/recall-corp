import { beforeAll, describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import indexHtml from '../index.html?raw';
import { mountApp } from './main';

const renderDocument = () => {
  const parsed = new DOMParser().parseFromString(indexHtml, 'text/html');
  document.title = parsed.title;
  document.body.innerHTML = parsed.body.innerHTML;

  for (const link of parsed.head.querySelectorAll('link[rel]')) {
    const href = link.getAttribute('href');
    const rel = link.getAttribute('rel');
    if (!href || !rel) {
      continue;
    }

    const selector = `link[rel="${rel}"][href="${href}"]`;
    if (document.head.querySelector(selector)) {
      continue;
    }

    document.head.append(link.cloneNode(true));
  }

  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container was not found in index.html');
  }

  mountApp(container);
  return container;
};

describe('End-2-End testing', () => {
  let rootElem: HTMLElement;

  beforeAll(() => {
    rootElem = renderDocument();
  });

  test('Test main page', async () => {
    const screen = page.elementLocator(rootElem);
    await expect
      .element(screen.getByText('© 2024-2025 RecAll'))
      .toBeInTheDocument();
  });
});
