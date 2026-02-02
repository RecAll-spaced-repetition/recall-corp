import { atomWithStorage } from 'jotai/utils';

import { EditorElementState } from '@/components/editor/editorElementTypes';
import { createStoredStackAtoms } from './stackAtomsFactory';

export const frontAtoms = createStoredStackAtoms(
  atomWithStorage<EditorElementState[]>('editor-history-front', [])
);
export const backAtoms = createStoredStackAtoms(
  atomWithStorage<EditorElementState[]>('editor-history-back', [])
);
