// Used ONLY by scripts/prerender.mjs to render each route to static HTML
// for search-engine crawlers. Not imported anywhere in the real client app
// (main.tsx never references this file), so it has zero effect on the
// normal `vite build` client bundle, its size, or its behaviour.
//
// Deliberately imports AppSSR (eager-loaded routes), NOT App (which
// lazy-loads routes for the browser bundle) — see the comment at the top
// of AppSSR.tsx for why mixing lazy-loading into this synchronous
// SSR render would silently break every prerendered page.
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import App from './AppSSR';

export function renderRouteToHtml(route = '/'): string {
  return ReactDOMServer.renderToString(React.createElement(App, { initialUrl: route }));
}


