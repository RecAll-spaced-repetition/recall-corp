import React, { HTMLAttributes, useEffect, useMemo, useRef } from 'react';
import {
  simpleRenderer,
  extendedMdRenderer,
} from './markdown-it-plugged-parser';
import clsx from 'clsx';
import { t } from 'i18next';

const mediaLoadErrorHandler = function (this: HTMLSourceElement) {
  if (!this.parentElement?.parentElement) return;
  this.parentElement.classList.add('hidden');
  const pElem = this.parentElement?.parentElement;
  pElem.innerHTML += `<span>${t('editor.mediaError')}</span>`;
  pElem.className = clsx('w-full text-lg font-medium text-red-600');
};

export interface MarkdownRendererProps extends HTMLAttributes<React.FC> {
  rawText: string;
  extended?: boolean;
  unstyled?: boolean;
}

export const MarkdownRenderComponent: React.FC<MarkdownRendererProps> = ({
  rawText,
  extended,
  unstyled,
  className,
}) => {
  const renderer = useMemo(
    () => (extended ? extendedMdRenderer : simpleRenderer),
    [extended]
  );
  const HtmlObject = useMemo(
    () => ({
      __html: renderer.render(rawText),
    }),
    [renderer, rawText]
  );

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const sources = ref.current.querySelectorAll('source');
    sources.forEach((source) => {
      source.addEventListener('error', mediaLoadErrorHandler, { once: true });
    });
  }, [ref, rawText]);

  return (
    <div
      ref={ref}
      className={clsx('full', !unstyled && 'markdown', className)}
      dangerouslySetInnerHTML={HtmlObject}
    ></div>
  );
};
