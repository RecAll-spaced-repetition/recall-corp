import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Button } from './Button';

test('Test btn click', async () => {
  const f = vi.fn();
  const { baseElement } = await render(<Button onClick={f}>Aaa</Button>);
  const screen = page.elementLocator(baseElement);
  const btn = screen.getByText('Aaa');
  await btn.click();
  expect(f).toHaveBeenCalled();
});
