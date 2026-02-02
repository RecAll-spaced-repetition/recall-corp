import { FileMeta } from '@/api';
import { getFileFullPath } from '@/query/queryHooks';

export const LINK_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export const getMediaTypedUrl = (meta: FileMeta) =>
  `![${meta.type}/${meta.ext}](${getFileFullPath(meta.id)})`;

export type SelectionType = {
  selectionStart: number;
  selectionEnd: number;
};
export type EditorElementState = SelectionType & {
  str: string;
};

const getSelectionSplittedStr = (state: EditorElementState) => ({
  prevPart: state.str.slice(0, state.selectionStart),
  midPart: state.str.slice(state.selectionStart, state.selectionEnd),
  nextPart: state.str.slice(state.selectionEnd),
});
const getCursorSplittedStr = (state: EditorElementState) => ({
  prevPart: state.str.slice(0, state.selectionEnd),
  nextPart: state.str.slice(state.selectionEnd),
});

export type EditorStateMutator = (
  editorState: EditorElementState,
  payload?: string
) => EditorElementState;

const getCursorPositionFillerMutation = (fillStr: string) => {
  return (state: EditorElementState) => {
    const { prevPart, nextPart } = getCursorSplittedStr(state);
    const res: EditorElementState = {
      selectionStart: state.selectionEnd + fillStr.length, // It's cursor, not selection!
      selectionEnd: state.selectionEnd + fillStr.length,
      str: `${prevPart}${fillStr}${nextPart}`,
    };
    return res satisfies EditorElementState;
  };
};
const getSelectionBordersFillerMutation = (
  fillStr1: string,
  fillStr2?: string
) => {
  return (state: EditorElementState) => {
    const { prevPart, midPart, nextPart } = getSelectionSplittedStr(state);
    const res: EditorElementState = {
      selectionStart: state.selectionStart + fillStr1.length,
      selectionEnd: state.selectionEnd + fillStr1.length,
      str: `${prevPart}${fillStr1}${midPart}${
        fillStr2 ? fillStr2 : fillStr1
      }${nextPart}`,
    };
    return res satisfies EditorElementState;
  };
};
const getEverySelectedLineStartMutation = (prefixStr: string) => {
  return (state: EditorElementState) => {
    const { prevPart, midPart, nextPart } = getSelectionSplittedStr(state);
    const lastPrevPartNewline = prevPart.lastIndexOf('\n');
    const newStr =
      (lastPrevPartNewline < 0
        ? prefixStr + prevPart
        : prevPart.slice(0, lastPrevPartNewline) +
          '\n' +
          prefixStr +
          prevPart.slice(lastPrevPartNewline + 1)) +
      midPart.replaceAll('\n', '\n' + prefixStr) +
      nextPart;
    const res: EditorElementState = {
      selectionStart: state.selectionStart + prefixStr.length,
      selectionEnd: state.selectionEnd + newStr.length - state.str.length,
      str: newStr,
    };
    return res satisfies EditorElementState;
  };
};
const getSelectedBorderLinesMutation = (borderLine: string) => {
  return (state: EditorElementState) => {
    const { prevPart, midPart, nextPart } = getSelectionSplittedStr(state);
    const lastPrevPartNewline = prevPart.lastIndexOf('\n');
    const newStr =
      (lastPrevPartNewline < 0
        ? borderLine + '\n' + prevPart
        : prevPart.slice(0, lastPrevPartNewline) +
          '\n' +
          borderLine +
          '\n' +
          prevPart.slice(lastPrevPartNewline + 1)) +
      midPart +
      (nextPart.includes('\n')
        ? nextPart.replace('\n', '\n' + borderLine + '\n')
        : nextPart + '\n' + borderLine);
    const res: EditorElementState = {
      selectionStart:
        state.selectionStart +
        borderLine.length +
        (lastPrevPartNewline < 0 ? 1 : 2),
      selectionEnd:
        state.selectionEnd +
        borderLine.length +
        (lastPrevPartNewline < 0 ? 1 : 2),
      str: newStr,
    };
    return res satisfies EditorElementState;
  };
};

export type MutationsEnum =
  | 'bold'
  | 'italic'
  | 'code'
  | 'quote'
  | 'ul'
  | 'ol'
  | 'link'
  | 'math'
  | 'media'
  | 'h1'
  | 'tab';
export type Mutations = Record<MutationsEnum, EditorStateMutator>;
export const mutations: Mutations = {
  bold: getSelectionBordersFillerMutation('**'),
  italic: getSelectionBordersFillerMutation('*'),
  quote: getEverySelectedLineStartMutation('> '),
  code: getSelectedBorderLinesMutation('```'),
  ul: getEverySelectedLineStartMutation('- '),
  ol: getEverySelectedLineStartMutation('1. '),
  link: (state, payload) => {
    const url = payload ? payload : 'url';
    return state.selectionStart !== state.selectionEnd
      ? getSelectionBordersFillerMutation('[', `](${url})`)(state)
      : getCursorPositionFillerMutation(`\n[ ... ](${url})\n`)(state);
  },
  math: getSelectedBorderLinesMutation('$$'),
  media: (state, payload) => {
    const url = payload ? payload : 'media_url';
    return state.selectionStart !== state.selectionEnd
      ? getSelectionBordersFillerMutation('![', `](${url})`)(state)
      : getCursorPositionFillerMutation(`\n![ ... ](${url})\n`)(state);
  },
  h1: getEverySelectedLineStartMutation('# '),
  tab: getEverySelectedLineStartMutation('  '),
};

export type EditorMutatorWrapper = (
  mutate: EditorStateMutator,
  payload?: string
) => void;
