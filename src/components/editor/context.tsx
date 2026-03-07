import React, { createContext, useContext, useMemo } from 'react';
import {
  EditorTheme,
  EditorSlots,
  ComponentRegistry,
  EditorCallbacks,
  EmailTemplate,
  HtmlRenderer,
} from './types';

interface EditorContextValue {
  components: ComponentRegistry;
  theme: EditorTheme;
  slots: EditorSlots;
  templates: EmailTemplate[];
  callbacks: EditorCallbacks;
  htmlRenderers: Record<string, HtmlRenderer>;
  title: string;
  logo?: React.ReactNode;
  showToolbar: boolean;
  showToolbox: boolean;
  showSettingsPanel: boolean;
}

const defaultTheme: EditorTheme = {
  paperWidth: 600,
  paperMinHeight: 800,
  paperBackground: '#ffffff',
};

const EditorContext = createContext<EditorContextValue>({
  components: {},
  theme: defaultTheme,
  slots: {},
  templates: [],
  callbacks: {},
  htmlRenderers: {},
  title: 'Email Editor',
  showToolbar: true,
  showToolbox: true,
  showSettingsPanel: true,
});

export const useEditorConfig = () => useContext(EditorContext);

interface EditorProviderProps {
  children: React.ReactNode;
  value: Omit<EditorContextValue, 'theme'> & { theme: EditorTheme };
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, value }) => {
  const mergedTheme = useMemo(
    () => ({ ...defaultTheme, ...value.theme }),
    [value.theme]
  );

  const ctx = useMemo(
    () => ({ ...value, theme: mergedTheme }),
    [value, mergedTheme]
  );

  return <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>;
};
