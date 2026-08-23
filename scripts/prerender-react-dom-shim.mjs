// Used ONLY by the SSR prerender build (see scripts/prerender.mjs and the
// `ssr.noExternal`/alias wiring it sets up at build time).
// ReactDOMServer.renderToStaticMarkup() cannot render React portals
// (e.g. the mobile nav menu / modals that portal into document.body).
// This shim re-exports the real react-dom untouched, except createPortal,
// which is made a no-op that renders its children inline instead of
// throwing. The real client bundle (main.tsx -> App.tsx) never imports
// this file and is completely unaffected.
import ReactDOMReal from 'react-dom';

export * from 'react-dom';

export function createPortal(children) {
  return children;
}

export default { ...ReactDOMReal, createPortal };
