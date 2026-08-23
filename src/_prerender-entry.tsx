// Used ONLY by scripts/prerender.mjs to render each route to static HTML
// for search-engine crawlers. Not imported anywhere in the real client app
// (main.tsx never references this file), so it has zero effect on the
// normal `vite build` client bundle, its size, or its behaviour.
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import App from './App';

export function renderRouteToHtml(): string {
  return ReactDOMServer.renderToStaticMarkup(React.createElement(App));
}
