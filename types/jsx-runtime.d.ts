// JSX types for the tags src/elements.ts registers. tsconfig.json points
// `jsxImportSource` here (through `paths`) instead of at
// @nativescript-community/octane, because MasonKit's <button>, <span> and
// <label> replace core's, and an augmentation can't change a tag's type.
import type {
  Attributes,
  NativeScriptElements,
} from '@nativescript-community/octane/intrinsics';
import type * as MasonKit from '@triniwiz/nativescript-masonkit';
import type * as MasonKitWeb from '@triniwiz/nativescript-masonkit/web';

type ViewClass = abstract new (...args: never[]) => unknown;

/**
 * Drops index signatures. Resolved per platform (`index.ios.d.ts`, ...), as
 * the build's type check does, MasonKit's `[someProperty.setNative]` members
 * become a string index signature, which would swallow every attribute.
 */
type KnownKeys<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: T[K];
};

type Known<C extends ViewClass> = KnownKeys<C> &
  (abstract new () => KnownKeys<
    C extends abstract new (...args: never[]) => infer I ? I : never
  >);

/** One lowercase tag per exported view class: `Div` → `div`, `TextArea` → `textarea`. */
type Tags<Module> = {
  [K in keyof Module as Module[K] extends ViewClass
    ? Lowercase<K & string>
    : never]: Module[K] extends ViewClass ? Attributes<Known<Module[K]>> : never;
};

/** MasonKit's own widgets; the `/web` elements cover <ul>, <ol> and <li>. */
type MasonKitElements = Tags<
  Pick<
    typeof MasonKit,
    'View' | 'Text' | 'Scroll' | 'Img' | 'Button' | 'Input' | 'TextArea' | 'Br'
  >
> &
  Tags<typeof MasonKitWeb>;

/** Core's views for the tags MasonKit takes over. */
interface CoreAliases {
  nbutton: NativeScriptElements['button'];
  nlabel: NativeScriptElements['label'];
  nspan: NativeScriptElements['span'];
}

type CoreElements = Omit<NativeScriptElements, 'button' | 'label' | 'span'>;

export namespace JSX {
  export interface IntrinsicElements
    extends CoreElements,
      MasonKitElements,
      CoreAliases {}
  export interface ElementChildrenAttribute {
    children: {};
  }
  export type Element = unknown;
  export type ElementType = string | ((props: any) => unknown);
}
