import Content from 'content/Content';
import { DEFAULT_SETTINGS, SettingsProvider } from 'context/SettingsContext';
import styles from 'css/app.css?inline';
import 'i18n';
import { createRoot } from 'react-dom/client';

import type { Json } from 'types/json';

const isJson =
  document.contentType === 'application/json' ||
  document.contentType === 'text/json';

const injectCSS = () => {
  // Clean up existing style element
  import.meta.hot?.data.styleElement?.remove();

  // Create new style element
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Store in hot context for HMR
  if (import.meta.hot) {
    import.meta.hot.data.styleElement = styleElement;
  }
};

const injectReact = (data: Json) => {
  const root = document.createElement('div');
  root.id = 'json-viewer-root';
  document.body.appendChild(root);

  createRoot(root).render(
    <SettingsProvider>
      <Content data={data} />
    </SettingsProvider>,
  );
};

const injectSettings = () => {
  chrome.storage.sync.get(DEFAULT_SETTINGS).then((stored) => {
    document.body.setAttribute('data-color-mode', stored.colorMode);
    document.body.setAttribute('data-theme', stored.theme);
    document.body.style.setProperty('--tab-width', `${stored.tabWidth}ch`);
  });
};

if (isJson) {
  const raw = import.meta.hot?.data.raw ?? document.body.innerText;

  if (import.meta.hot) {
    import.meta.hot.data.raw = raw;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Not valid JSON — leave the page alone
  }

  if (parsed !== undefined) {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    injectCSS();
    injectSettings();
    injectReact(parsed as Json);
  }
}

import.meta.hot?.accept();
