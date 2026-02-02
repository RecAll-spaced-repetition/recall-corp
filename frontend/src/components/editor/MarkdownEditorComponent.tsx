import React, { HTMLAttributes, useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { match } from 'ts-pattern';

import { EditorControls } from './EditorControls';
import { MarkdownRenderComponent } from './MarkdownRenderComponent';
import {
  EditorElementState,
  EditorMutatorWrapper,
  getMediaTypedUrl,
  LINK_REGEX,
  mutations,
  SelectionType,
} from './editorElementTypes';
import { checkedFileProcessing } from '@/components/files';
import { useFileUpload } from '@/query/mutationHooks';
import { useTranslation } from 'react-i18next';
import { StoredStackAtoms } from '@/state';
import { useAtomValue, useSetAtom } from 'jotai';

interface MarkdownEditorComponentProps extends HTMLAttributes<React.FC> {
  historyAtoms: StoredStackAtoms<EditorElementState>;
  state: string;
  setState: (newState: string) => void;
  extended?: boolean;
  placeholder?: string;
  previewClassName?: string;
}

export const MarkdownEditorComponent: React.FC<
  MarkdownEditorComponentProps
> = ({
  historyAtoms,
  state,
  setState,
  extended,
  placeholder,
  previewClassName,
}) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(true);
  const [selection, setSelection] = useState<SelectionType>();

  const prevState = useAtomValue(historyAtoms.topValueAtom);
  const push = useSetAtom(historyAtoms.pushAtom);
  const canPop = useAtomValue(historyAtoms.canPopAtom);
  const pop = useSetAtom(historyAtoms.popAtom);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorActionWrapper: EditorMutatorWrapper = (mutate, payload) => {
    if (!selection) return;
    const editorElementState: EditorElementState = {
      ...selection,
      str: state,
    };
    push(editorElementState);

    const newEditorElementState = mutate(editorElementState, payload);
    setEditorSelection(newEditorElementState);
    setState(newEditorElementState.str);
  };

  const undo = () => {
    if (!prevState) return;
    setState(prevState.str);
    setEditorSelection(prevState);
    pop();
  };

  const getEditorSelection = useCallback(() => {
    if (!editorRef.current) return;
    const { selectionStart, selectionEnd } = editorRef.current;
    return { selectionStart, selectionEnd } satisfies SelectionType;
  }, [editorRef]);
  const setEditorSelection = useCallback(
    ({ selectionStart, selectionEnd }: SelectionType) => {
      requestAnimationFrame(() => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        editorRef.current.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    [editorRef]
  );

  const { uploadFile } = useFileUpload((response) => {
    editorActionWrapper(mutations.media, getMediaTypedUrl(response));
  });
  const alertingUploading = useCallback(
    (file: File) => {
      if (checkedFileProcessing(file, uploadFile)) return;
      alert(t('editor.notAllowedFile')); // TODO: Сделать что-то более красивое (возможно)
    },
    [uploadFile, t]
  );

  return (
    <>
      <EditorControls
        isExtended={extended}
        isActive={active}
        switchActive={() => setActive((a) => !a)}
        editorActionWrapper={editorActionWrapper}
        undo={canPop && undo}
      />
      {active ? (
        <textarea
          ref={editorRef}
          className={clsx(
            'p-1 md:p-2 full',
            'bg-transparent resize-none',
            'transition-all duration-200',
            'rounded-lg text-o-black font-mono',
            'hover:shadow-inner hover:shadow-neutral-400',
            'focus:shadow-inner hover:shadow-neutral-400',
            'focus:apperance-none focus:outline-none'
          )}
          placeholder={placeholder}
          value={state}
          onSelect={() => {
            setSelection(getEditorSelection);
          }}
          onChange={(e) => {
            if (!selection) return;
            push({
              ...selection,
              str: state,
            });
            setState(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              editorActionWrapper(mutations.tab);
            }
            if (e.ctrlKey) {
              match(e.code)
                .with('KeyB', () => editorActionWrapper(mutations.bold))
                .with('KeyI', () => editorActionWrapper(mutations.italic))
                .with('KeyZ', () => undo());
            }
          }}
          onPaste={(e) => {
            if (e.clipboardData.types.length == 0) return;
            match(e.clipboardData.items[0].kind)
              .with('string', () => {
                const text = e.clipboardData.getData('text/plain');
                if (!LINK_REGEX.test(text)) return;
                e.preventDefault();
                editorActionWrapper(mutations.link, text);
              })
              .with('file', () => {
                if (!extended) return;
                e.preventDefault();
                alertingUploading(e.clipboardData.files[0]);
              });
          }}
          onDragEnter={(e) => {
            if (!extended) return;
            e.preventDefault();
            e.currentTarget.classList.remove('bg-transparent');
            e.currentTarget.classList.add(
              'bg-black/10',
              'shadow-inner',
              'shadow-neutral-400'
            );
          }}
          onDragLeave={(e) => {
            if (!extended) return;
            e.preventDefault();
            e.currentTarget.classList.add('bg-transparent');
            e.currentTarget.classList.remove(
              'bg-black/10',
              'shadow-inner',
              'shadow-neutral-400'
            );
          }}
          onDrop={(e) => {
            if (!extended) return;
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
              alertingUploading(e.dataTransfer.files[0]);
            }
            e.currentTarget.classList.add('bg-transparent');
            e.currentTarget.classList.remove(
              'bg-black/10',
              'shadow-inner',
              'shadow-neutral-400'
            );
          }}
        />
      ) : (
        <MarkdownRenderComponent
          rawText={state}
          extended={extended}
          className={clsx(
            'p-2 md:p-4 font-sans',
            'overflow-y-auto overflow-x-hidden',
            previewClassName
          )}
        />
      )}
    </>
  );
};
