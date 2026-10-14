import { Frame, Page, type NavigatedData } from '@nativescript/core';
import { renderNativeScriptApp } from '@nativescript-community/octane';

/**
 * A Page showing `Screen`. Each Page is its own Octane root, and it unmounts
 * when you navigate back from it, so effects clean up just as they would on
 * the web.
 */
export function createPage(Screen: () => unknown) {
  const page = new Page();
  page.actionBarHidden = true;
  const root = renderNativeScriptApp(page, Screen);
  page.on('navigatedFrom', (args: NavigatedData) => {
    if (args.isBackNavigation) {
      root.unmount();
    }
  });
  return page;
}

/** Pushes a new Page showing `Screen`. */
export function navigate(Screen: () => unknown) {
  Frame.topmost().navigate({ create: () => createPage(Screen) });
}

export function goBack() {
  Frame.topmost().goBack();
}
