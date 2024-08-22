import type * as CSSType from "csstype";

import { ComputedColor } from "./ComputedColor";
export { ComputedColor } from "./ComputedColor";

type CSSKey = keyof CSSType.PropertiesHyphen;

export function getComputedCSSValueOfClass(key: CSSKey, klass: string): string {
  return getComputedCSSValue(key, (el) => el.classList.add(klass));
}

export function getSizeInPx(size: string): number {
  return parseFloat(getComputedCSSValueFromRaw("width", size));
}

export function getComputedColor(
  color: string,
  alreadyComputed = false,
): ComputedColor | null {
  const computedColor = alreadyComputed
    ? color
    : getComputedCSSValueFromRaw("color", color);
  return ComputedColor.fromComputedString(computedColor);
}

function getComputedCSSValueFromRaw(key: CSSKey, rawValue: string): string {
  return getComputedCSSValue(
    key,
    (el) => el.style[key as unknown as any] = rawValue,
  );
}

function getComputedCSSValue(
  key: CSSKey,
  action: (el: HTMLElement) => void,
): string {
  const containerEl = document.createElement("div");
  containerEl.style.visibility = "hidden";
  containerEl.style.width = "0";
  containerEl.style.height = "0";
  containerEl.style.overflow = "hidden";

  const el = document.createElement("div");
  action(el);

  containerEl.appendChild(el);
  document.body.appendChild(containerEl);

  const value = getComputedStyle(el)[key as any]!;

  containerEl.remove();

  return value;
}

export function computedColorToCSSValue(c: ComputedColor) {
  const { r, g, b, a } = c;
  if (a === null) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgb(${r}, ${g}, ${b}, ${a})`;
}
