import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button } from './Button';

test('renders name', async () => {
  const { getByText } = await render(<Button>Aaa</Button>);
  await expect.element(getByText('Hello Vitest!')).toBeInTheDocument();
});
