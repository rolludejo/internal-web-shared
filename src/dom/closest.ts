/**
 * 从 `el` 出发，向外找到第一个符合 `predicate` 的元素并返回。若没有任何元素符合
 * `predicate`，返回 `null`。
 *
 * 与 `Element.prototype.closest` 不同的是，此函数会突破 Shadow Root，且会感知
 * slots。
 */
export function findClosestElementEx(
  el: HTMLElement,
  predicate: (el: HTMLElement) => boolean,
): HTMLElement | null {
  do {
    if (predicate(el)) return el;
    if (el.parentElement) {
      if (el.slot && el.parentElement.shadowRoot) {
        const slotEls = el.parentElement.shadowRoot.querySelectorAll("slot");
        let hasFound = false;
        for (const slotEl of slotEls ?? []) {
          if (slotEl.name === el.slot && slotEl.parentElement) {
            hasFound = true;
            el = slotEl.parentElement;
          }
        }
        if (!hasFound) return null;
      } else {
        el = el.parentElement;
      }
    } else {
      const root = el.getRootNode();
      if ("host" in root) {
        el = (root as ShadowRoot).host as HTMLElement;
      } else {
        break;
      }
    }
  } while (true);
  return null;
}
