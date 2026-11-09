import { useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql, SQLite } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import {
  acceptCompletion,
  autocompletion,
  closeCompletion,
  moveCompletionSelection,
  startCompletion,
} from '@codemirror/autocomplete';
import { COMPLETION_SCHEMA } from '../db/schema';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
}

const editorTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '14px', backgroundColor: 'transparent' },
  '.cm-scroller': { fontFamily: "'JetBrains Mono', Consolas, monospace", lineHeight: '1.6' },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none' },
  '.cm-content': { paddingTop: '10px' },
});

export function SqlEditor({ value, onChange, onRun, onSubmit }: Props) {
  const handlers = useRef({ onRun, onSubmit });
  handlers.current = { onRun, onSubmit };

  const extensions = useMemo(
    () => [
      sql({ dialect: SQLite, schema: COMPLETION_SCHEMA, upperCaseKeywords: true }),
      editorTheme,
      autocompletion({ defaultKeymap: false }),
      Prec.highest(
        keymap.of([
          { key: 'Mod-Enter', run: () => (handlers.current.onRun?.(), true) },
          { key: 'Mod-Shift-Enter', run: () => (handlers.current.onSubmit?.(), true) },
          {
            key: 'Tab',
            run: (view) => acceptCompletion(view) || (view.dispatch(view.state.replaceSelection('  ')), true),
          },
          { key: 'ArrowDown', run: moveCompletionSelection(true) },
          { key: 'ArrowUp', run: moveCompletionSelection(false) },
          { key: 'PageDown', run: moveCompletionSelection(true, 'page') },
          { key: 'PageUp', run: moveCompletionSelection(false, 'page') },
          { key: 'Escape', run: closeCompletion },
          { key: 'Mod-Space', run: startCompletion },
        ]),
      ),
    ],
    [],
  );

  return (
    <CodeMirror
      className="editor"
      value={value}
      onChange={onChange}
      theme={oneDark}
      extensions={extensions}
      height="100%"
      indentWithTab={false}
      basicSetup={{ highlightActiveLine: true, autocompletion: false, completionKeymap: false, bracketMatching: true }}
    />
  );
}
