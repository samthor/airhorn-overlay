Airhorn Web Component.
Quick, [load the demo](https://samthor.github.io/airhorn-overlay)! 📢

<!--
```
<custom-element-demo>
  <template>
    <script src="airhorn-overlay.js" type="module"></script>
    <airhorn-overlay>Horn!</airhorn-overlay>
  </template>
</custom-element-demo>
```
-->
```html
<airhorn-overlay>Horn!</airhorn-overlay>
```

Distributed as an ES6 module.
Requires Custom Elements and Shadow DOM.

## Usage

```html
<airhorn-overlay>
This content is fine, but if you click on me, I'll become very loud.
</airhorn-overlay>
```

Set the `disabled` attribute to disable the airhorn.
Additionally, set `overflow: hidden` on the CSS of element to 'contain' the airhorn to its bounds, rather than expanding out onto the page.

## Install

Install `airhorn-overlay` on NPM and include the ES6 module:

```js
import {AirhornOverlayElement} from './node_modules/airhorn-overlay/airhorn-overlay.js';
// or maybe your transpiler supports...
import `airhorn-overlay`;
```
