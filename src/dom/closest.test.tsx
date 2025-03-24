import { describe, expect, it } from "vitest";

import { render } from "@solidjs/testing-library";

import * as Solid from "solid-js";
import * as SolidWeb from "solid-js/web";
import { customElement } from "solid-element";

import { findClosestElementEx as f } from "./closest";

describe("function findClosestElementEx", () => {
  it("works for basic cases", () => {
    let a!: HTMLDivElement;
    let aChild!: HTMLDivElement;
    let aDeepChild!: HTMLDivElement;
    let b!: HTMLDivElement;

    render(() => {
      return (
        <div>
          <div id="a" ref={a} class="A">
            <div id="a-child" ref={aChild} class="A_CHILD">
              <div id="a-deep-child" ref={aDeepChild} />
            </div>
          </div>
          <div id="b" ref={b} />
        </div>
      );
    });

    expect(f(a, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "a-child")?.className)
      .toBe("A_CHILD");
    expect(f(aDeepChild, (el) => el.id === "a-child")?.className)
      .toBe("A_CHILD");
    expect(f(aDeepChild, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "b"))
      .toBe(null);
    expect(f(b, (el) => el.id === "a"))
      .toBe(null);
  });

  it("works across shadow roots", () => {
    let a!: HTMLDivElement;
    let aChild!: HTMLDivElement;
    let aDeepChild!: HTMLDivElement;

    render(() => {
      return (
        <div>
          <div id="a" ref={a} class="A">
            <ShadowRootAttacherLite>
              <div id="a-child" ref={aChild} class="A_CHILD">
                <ShadowRootAttacherLite>
                  <div id="a-deep-child" ref={aDeepChild} />
                </ShadowRootAttacherLite>
              </div>
            </ShadowRootAttacherLite>
          </div>
        </div>
      );
    });

    expect(f(a, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aDeepChild, (el) => el.id === "a-child")?.className)
      .toBe("A_CHILD");
    expect(f(aDeepChild, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "b"))
      .toBe(null);
  });

  it("works inside and out of custom elements with name slots", () => {
    customElement("custom-element", () => {
      return (
        <div id="x" class="X">
          <slot name="children" />
        </div>
      );
    });

    document.body.innerHTML = /*html*/ `
    <div>
      <div id="a" class="A">
        <custom-element>
          <div slot="children">
            <div id="a-child" class="A_CHILD"></div>
          </div>
        </custom-element>
      </div>
    </div>
    `;

    const a = document.getElementById("a")!;
    const aChild = document.getElementById("a-child")!;

    expect(f(a, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "x")?.className)
      .toBe("X");
    expect(f(aChild, (el) => el.id === "b"))
      .toBe(null);
  });

  it("works inside and out of custom elements with unname slots", () => {
    customElement("custom-element", () => {
      return (
        <div id="x" class="X">
          <slot />
        </div>
      );
    });

    document.body.innerHTML = /*html*/ `
    <div>
      <div id="a" class="A">
        <custom-element>
          <div="children">
            <div id="a-child" class="A_CHILD"></div>
          </div>
        </custom-element>
      </div>
    </div>
    `;

    const a = document.getElementById("a")!;
    const aChild = document.getElementById("a-child")!;

    expect(f(a, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "a")?.className)
      .toBe("A");
    expect(f(aChild, (el) => el.id === "x")?.className)
      .toBe("X");
    expect(f(aChild, (el) => el.id === "b"))
      .toBe(null);
  });
});

const ShadowRootAttacherLite: Solid.Component<{ children: Solid.JSX.Element }> =
  (props) => {
    let hostEl!: HTMLDivElement;
    Solid.onMount(() => {
      const shadowRoot = hostEl.attachShadow({ mode: "open" });
      SolidWeb.render(() => props.children, shadowRoot);
    });
    return <div ref={hostEl} />;
  };
