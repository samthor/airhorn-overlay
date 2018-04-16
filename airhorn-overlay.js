/*
 * Copyright 2018 Sam Thorogood
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import {sound} from './sound.js';

export class AirhornOverlayElement extends HTMLElement {
  static get observedAttributes() { return ['disabled']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  display: block;
}
:host(:focus-within) {
  outline: #c03 auto 5px;
  outline: -webkit-focus-ring-color auto 5px;
}
@keyframes horn {
  0%   { --horn-rotate: -20deg; }
  100% { --horn-rotate: +20deg; }
}
@keyframes zoom {
  0%   { transform: scale(0.25); }
  100% { transform: scale(4); }
}
#all {
  position: relative;
  width: 100%;
  height: 100%;
}
#overlay {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  cursor: pointer;
  border-radius: 10000px;
  opacity: 0;
  border: 0;
  transition: opacity 0.125s, transform 0.5s;
  pointer-events: none;
}
#overlay::before {
  position: absolute;
  content: '';
  width: var(--emoji-size, 128px);
  height: var(--emoji-size, 128px);
  background: #c03;
  opacity: 0.77;
  box-shadow: 2px 4px 0 0 rgba(0, 0, 0, 0.25);
  padding: 24px;
  border-radius: 100px;
}
#overlay::after {
  position: absolute;
  content: '\ud83d\udce2';
  transform: rotate(var(--horn-rotate, 0deg));
  transition: transform 0.125s;
  display: inline-block;
  position: relative;
}
#overlay.active {
  opacity: 1;
  animation: horn 0.25s infinite cubic-bezier(0.255, -0.440, 0.780, 1.320),
      zoom 0.33s alternate infinite cubic-bezier(0.255, -0.440, 0.780, 1.320);
}
#content {
  position: relative;
  z-index: 0;
  height: 100%;
  will-change: transform;
}
button {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: transparent;
  border: none;
  z-index: 1;
  cursor: pointer;
}
button[disabled] {
  pointer-events: none;
}
button:focus {
  outline: 0;
}
</style>
<div id="all">
  <audio id="audio"></audio>
  <button id="button"></button>
  <div id="overlay"></div>
  <div id="content">
    <slot></slot>
  </div>
</div>
    `;

    this.$ = {};
    root.querySelectorAll('[id]').forEach((el) => {
      this.$[el.id] = el;
    });
    console.info(this.$);

    const source = document.createElement('source');
    source.setAttribute('src', `data:audio/mp3;base64,${sound}`);
    this.$.audio.appendChild(source);

    this.$.button.addEventListener('click', (ev) => this.horn());
    this.$.audio.addEventListener('ended', (ev) => {
      this.$.content.style.transform = null;
      this.$.overlay.classList.remove('active');
      window.cancelAnimationFrame(this._rAF);
      this._rAF = undefined;
    });
  }

  _makeDumb() {
    this._rAF = window.requestAnimationFrame(() => this._makeDumb());

    const skew = this.skew;
    const r = () => (Math.random() * skew - skew / 2) + '%';
    this.$.content.style.transform = `translate(${r()}, ${r()})`;
  }

  get skew() {
    return +this.getAttribute('skew') || 20;
  }

  set skew(v) {
    if (v && v === +v) {
      this.setAttribute('skew', v);
    } else {
      this.removeAttribute('skew');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(v) {
    if (v) {
      this.setAttribute('disabled', this.getAttribute('disabled') || '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    this.$.button.disabled = this.disabled;
  }

  horn() {
    if (this._rAF) {
      return;
    }
    this._makeDumb();
    this.$.overlay.classList.add('active');
    this.$.audio.play();
  }
}

window.customElements.define('airhorn-overlay', AirhornOverlayElement);

