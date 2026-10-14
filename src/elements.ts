import { Button, Label, Span } from '@nativescript/core';
import { registerElement } from '@nativescript-community/octane';
import { View } from '@triniwiz/nativescript-masonkit';
import { getMasonKitElements } from '@triniwiz/nativescript-masonkit/elements';

// Start every MasonKit element from Tailwind's preflight baseline
// (border-box, no UA margins/padding). Must run before any view is created.
View.preflight = true;

// Core's versions of the tags MasonKit takes over stay reachable as
// <nbutton>, <nlabel> and <nspan>.
registerElement('nbutton', Button);
registerElement('nlabel', Label);
registerElement('nspan', Span as never);

// MasonKit's elements (<view>, <text>, <scroll>, <button>, ...) and the
// HTML-shaped ones (<div>, <section>, <h1>, <p>, <span>, ...).
for (const { tag, ctor } of getMasonKitElements()) {
  registerElement(tag.toLowerCase(), ctor);
}

// Re-registering a tag with a new class recreates its live instances in place,
// so an update to this module needs no remount.
import.meta.hot?.accept();
