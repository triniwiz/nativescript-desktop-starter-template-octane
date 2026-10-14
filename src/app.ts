// The elements Octane can render. Must load first.
import './elements';
import { Application, Frame } from '@nativescript/core';
import { createPage } from './navigation';
import { Home } from './components/Home';

Application.run({
  create: () => {
    const frame = new Frame();
    frame.navigate({ create: () => createPage(Home), animated: false });
    return frame;
  },
});
