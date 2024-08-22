import { Component } from "solid-js";

import styles from "./App.module.css";

import {
  createStyleProviderFromCSSText,
  ShadowRootAttacher,
} from "../src/shadow-root/mod";

const redBorderStyleText = ".border-red { border: solid 1rem red; } ";
const redBorderProvider = //
  createStyleProviderFromCSSText(redBorderStyleText);

const App: Component = () => (
  <>
    <style>{redBorderStyleText}</style>
    <div
      class={styles.App}
      style={{ padding: "1rem", "border": "solid 1rem blue" }}
    >
      <ul>
        <li>
          <div>foo</div>
        </li>
        <li>
          <div class="border-red" style={{ padding: "1rem" }}>bar</div>
        </li>
        <li>
          <ShadowRootAttacher>
            <div class="border-red" style={{ padding: "1rem" }}>baz</div>
          </ShadowRootAttacher>
        </li>
        <li>
          <ShadowRootAttacher styleProviders={[redBorderProvider]}>
            <div class="border-red" style={{ padding: "1rem" }}>qux</div>
          </ShadowRootAttacher>
        </li>
      </ul>
    </div>
  </>
);
export default App;
