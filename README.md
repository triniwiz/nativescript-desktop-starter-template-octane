# NativeScript Desktop Starter (Octane)

An [Octane](https://octanejs.dev) starter that runs on Windows, iOS and
Android. Layout uses [MasonKit](https://github.com/triniwiz/nativescript-mason)
(Flexbox, CSS Grid and HTML-style elements), and styling uses Tailwind CSS v4.
Octane renders straight to NativeScript views through
[`@nativescript-community/octane`](https://github.com/nativescript-community/octane),
with no DOM in between, so you write React-style JSX: `<div className="flex gap-4">`,
`<button onTap={…}>`.

This is the Octane version of
[nativescript-desktop-starter-template](https://github.com/triniwiz/nativescript-desktop-starter-template)
(NativeScript-Vue). The screens are the same.

## Prerequisites

> NativeScript for Windows is in alpha. Expect rough edges.

To run on Windows you need the following. `npx ns doctor windows` checks them.

| Requirement | Notes |
| --- | --- |
| Windows 10 1809 (build 17763) or later | The app targets `net10.0-windows10.0.26100.0`, with a minimum of `10.0.17763.0`. |
| [Node.js](https://nodejs.org) LTS | Provides `npm` and `npx`. |
| [.NET 10 SDK](https://dotnet.microsoft.com/download) | The build runs `dotnet build`. Check it with `dotnet --version`. |
| Developer Mode | Settings → Privacy & security → For developers. Windows needs it to install and launch the unsigned debug build. |

For iOS and Android, follow the [NativeScript environment setup](https://docs.nativescript.org/setup/).

You don't need to install the NativeScript CLI globally. It's a dev dependency, and the npm scripts run it.

## Getting started

```bash
git clone https://github.com/triniwiz/nativescript-desktop-starter-template-octane my-app
cd my-app
npm install
npm run windows   # or: npm run ios / npm run android
```

`npm run windows` builds the app, installs and launches it, then syncs your
changes into it as you save. `npm run clean` removes the build output, and
`npm run typecheck` runs `tsc`.

Use npm. `package.json` relies on npm `overrides`.

## Project layout

| Path | What it's for |
| --- | --- |
| `src/app.ts` | App entry. Starts a `Frame` on the home screen. |
| `src/elements.ts` | Turns on `View.preflight` and registers MasonKit's elements with Octane. Register plugin views here too. |
| `src/navigation.ts` | `navigate(Screen)` and `goBack()`. Each screen is its own Octane root on a NativeScript `Page`. |
| `src/app.css` | Tailwind, plus the `dark:`, `ios:`, `android:`, `windows:`, `phone:` and `tablet:` variants. |
| `src/components/Home.tsx` | The home screen. |
| `src/components/Playground.tsx` | Flexbox and Grid examples. |
| `types/jsx-runtime.d.ts` | JSX typings: MasonKit's elements plus core NativeScript's. `tsconfig.json` points `jsxImportSource` at it. |
| `patches/` | Lets Octane's NativeScript driver put children and text into MasonKit views. `npm install` applies it (see [Temporary workarounds](#temporary-workarounds)). |
| `postcss-masonkit.mjs` | Keeps the Tailwind layout utilities (`flex`, `grid`, `gap-*`, `max-w-*`, `absolute`, ...) that NativeScript's Tailwind plugin would otherwise remove. |
| `android-workarounds.mjs` | Keeps Android rebuilds from loading a stale activity chunk (see [Temporary workarounds](#temporary-workarounds)). |

## Tips

- **JSX:** write HTML-style tags in lowercase: `<div>`, `<section>`, `<h1>`,
  `<p>`, `<span>`, `<button>`, `<code>`, `<scroll>`. The core NativeScript
  versions of `<button>`, `<span>` and `<label>` are available as
  `<nbutton>`, `<nspan>` and `<nlabel>`, and every other core view by its
  lowercase class name (`<textfield>`, `<switch>`, `<listview>`, ...).
- **Props** are view properties, assigned straight onto the view. Use
  `className`, and a `style` string or object for inline styles.
- **Events:** `onTap` (or `onClick`) listens for a `tap`. Any other `on<Event>`
  prop listens for the NativeScript event of that name, so `onLoaded` gets
  `loaded`. NativeScript events don't bubble.
- **Text** goes inside text elements (`<span>`, `<p>`, `<h1>`, `<button>`,
  ...), not straight inside a `<div>`. Adjacent pieces like `{a} · {b}` are
  joined into one string.
- **Navigation:** `navigate(Screen)` pushes a page and `goBack()` pops it.
  A screen unmounts when you navigate back from it, so `useEffect` cleanups
  run then.
- **Plugin views:** register them in `src/elements.ts` with
  `registerElement('tag', ViewClass)`, and add the tag to
  `types/jsx-runtime.d.ts`.
- **Class names** must appear in full in your source so Tailwind can find them.
  Pick between complete strings (`'flex-row'`, `'flex-col'`) rather than
  building them (`` `flex-${dir}` ``), as the playground does.
- **Responsive layouts:** there are no `sm:` or `md:` breakpoints. Use layouts
  that fit the space they're given instead. They also reflow when the window
  is resized:

  ```tsx
  <div className="grid grid-cols-[repeat(auto-fill,minmax(240,1fr))] gap-4">…</div>
  <div className="flex flex-row flex-wrap gap-4"><div className="flex-1 basis-40">…</div></div>
  <main className="mx-auto w-full max-w-5xl px-5">…</main>
  ```

- **Units:** unitless values are dp, and `px` means physical pixels, so write
  arbitrary values without a unit, for example `auto-rows-[96]`.
- **Avoid** `tracking-*`, `leading-*` and `bg-linear-*`. For gradients, write
  a `@utility` instead, like `bg-hero` in `src/app.css`.
- **Keep** `@import 'tailwindcss/theme'` and `@import 'tailwindcss/utilities'`
  in `src/app.css`, not `@import 'tailwindcss'`. Tailwind's preflight would
  hide every view.

## Troubleshooting

- **Something's missing from your setup:** `npx ns doctor windows` lists what it can't find and how to fix it.
- **The app builds but won't launch** ("deployment failed"): turn on Developer Mode.
- **A stale or broken build:** run `npm run clean`, then `npm run windows` again.

## Temporary workarounds

These can be removed once the fixes are released:

- `octane` and `@octanejs/vite-plugin` are pinned to `0.2.11` and `0.1.52`,
  the pair `@nativescript-community/octane` is built and tested against.
  Octane's newer releases haven't been verified with it yet. `octane` needs
  TypeScript 5.9, so that's pinned too.
- `patches/@nativescript-community+octane+0.2.5.patch` changes
  `@nativescript-community/octane`'s driver, and `patch-package` applies it
  after `npm install`. The driver only inserts children into core layouts
  (`LayoutBase`) and only puts text into core text views (`TextBase`).
  MasonKit's views are neither, so the patch lets the driver treat them the
  same way. It edits the installed file rather than transforming it in Vite
  because during HMR the driver loads from the dev vendor bundle, which
  Vite plugins don't reach. `@nativescript-community/octane` is pinned to
  the exact version the patch is for.
- `@nativescript/core` and `@nativescript/vite` are installed through pkg.pr.new from
  [NativeScript/NativeScript#11468](https://github.com/NativeScript/NativeScript/pull/11468),
  which is the `feat/windows` branch plus percentage sizes inside MasonKit layouts.
- `@nativescript/windows` is pinned to an exact alpha, because a caret range
  would also match older, incompatible betas.
- `android-workarounds.mjs` names core's Android activity chunk without a
  hash. The generated Java activity loads it by the name it had at the last
  native build, so after a rebuild that renamed it, Android started the old
  chunk and crashed ("isEmbedded is not a function").
- `postcss-masonkit.mjs` also keeps `touch-action` and `:hover` rules, which
  `@nativescript/tailwind` strips even though MasonKit supports them.
- `masonkit-hmr.mjs` stops MasonKit from loading twice during HMR.
- `postcss-selector-commas.mjs` makes classes with a comma, like
  `grid-cols-[repeat(auto-fill,minmax(240,1fr))]`, match
  ([NativeScript/NativeScript#11463](https://github.com/NativeScript/NativeScript/pull/11463)).
