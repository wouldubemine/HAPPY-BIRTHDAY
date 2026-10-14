(function (global) {
  "use strict";

  var STYLE_ID = "falling-text-engine-styles";
  var instances = typeof WeakMap === "function" ? new WeakMap() : null;
  var random = Math.random;

  function between(min, max) {
    return min + random() * (max - min);
  }

  function roundedBetween(min, max, digits) {
    var factor = Math.pow(10, digits || 0);
    return Math.round(between(min, max) * factor) / factor;
  }

  function resolveLayer(target, documentRef) {
    if (typeof target === "string") {
      return documentRef.querySelector(target);
    }
    return target;
  }

  function ensureStyles(documentRef) {
    if (documentRef.getElementById(STYLE_ID)) {
      return;
    }

    var style = documentRef.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".falling-text-engine__item {",
      "  position: absolute;",
      "  top: 0;",
      "  left: 0;",
      "  display: block;",
      "  white-space: nowrap;",
      "  pointer-events: none;",
      "  user-select: none;",
      "  transform-origin: center center;",
      "  transform-style: preserve-3d;",
      "  backface-visibility: hidden;",
      "  will-change: transform, opacity, filter;",
      "  font: inherit;",
      "  color: inherit;",
      "}",
      "@keyframes falling-text-engine__fall {",
      "  0% {",
      "    opacity: 0;",
      "    filter: blur(var(--falling-text-blur));",
      "    transform: translate3d(var(--falling-text-x-start), -24vh, var(--falling-text-z-start)) rotateX(var(--falling-text-rx-start)) rotateY(var(--falling-text-ry-start)) rotateZ(var(--falling-text-rz-start)) scale(var(--falling-text-scale-start));",
      "  }",
      "  12% {",
      "    opacity: var(--falling-text-opacity);",
      "  }",
      "  48% {",
      "    opacity: var(--falling-text-opacity);",
      "    transform: translate3d(var(--falling-text-x-middle), 48vh, var(--falling-text-z-middle)) rotateX(var(--falling-text-rx-middle)) rotateY(var(--falling-text-ry-middle)) rotateZ(var(--falling-text-rz-middle)) scale(var(--falling-text-scale-middle));",
      "  }",
      "  78% {",
      "    opacity: calc(var(--falling-text-opacity) * 0.72);",
      "  }",
      "  100% {",
      "    opacity: 0;",
      "    filter: blur(var(--falling-text-blur));",
      "    transform: translate3d(var(--falling-text-x-end), 124vh, var(--falling-text-z-end)) rotateX(var(--falling-text-rx-end)) rotateY(var(--falling-text-ry-end)) rotateZ(var(--falling-text-rz-end)) scale(var(--falling-text-scale-end));",
      "  }",
      "}",
    ].join("\n");

    (documentRef.head || documentRef.documentElement).appendChild(style);
  }

  function addStyleWithRestore(layer, property, value, ownedStyles) {
    if (!ownedStyles[property]) {
      ownedStyles[property] = {
        value: layer.style.getPropertyValue(property),
        priority: layer.style.getPropertyPriority(property),
      };
    }
    layer.style.setProperty(property, value);
  }

  function restoreStyles(layer, ownedStyles) {
    Object.keys(ownedStyles).forEach(function (property) {
      var previous = ownedStyles[property];
      if (previous.value) {
        layer.style.setProperty(property, previous.value, previous.priority);
      } else {
        layer.style.removeProperty(property);
      }
    });
  }

  function setParticleVariables(node) {
    var depth = roundedBetween(-520, 260, 1);
    var depthEnd = depth + roundedBetween(-80, 80, 1);
    var scale = roundedBetween(0.48, 1.52, 3);
    var opacity = roundedBetween(0.2, 0.78, 3);
    var rotationX = roundedBetween(-32, 32, 2);
    var rotationY = roundedBetween(-42, 42, 2);
    var rotationZ = roundedBetween(-18, 18, 2);

    node.style.left = roundedBetween(-8, 100, 2) + "%";
    node.style.setProperty("--falling-text-x-start", roundedBetween(-8, 8, 2) + "vw");
    node.style.setProperty("--falling-text-x-middle", roundedBetween(-16, 16, 2) + "vw");
    node.style.setProperty("--falling-text-x-end", roundedBetween(-22, 22, 2) + "vw");
    node.style.setProperty("--falling-text-z-start", depth + "px");
    node.style.setProperty("--falling-text-z-middle", roundedBetween(depth - 70, depth + 70, 1) + "px");
    node.style.setProperty("--falling-text-z-end", depthEnd + "px");
    node.style.setProperty("--falling-text-scale-start", roundedBetween(scale * 0.9, scale * 1.1, 3));
    node.style.setProperty("--falling-text-scale-middle", roundedBetween(scale * 0.94, scale * 1.08, 3));
    node.style.setProperty("--falling-text-scale-end", roundedBetween(scale * 0.86, scale * 1.04, 3));
    node.style.setProperty("--falling-text-opacity", opacity);
    node.style.setProperty("--falling-text-blur", roundedBetween(0, 3.5, 2) + "px");
    node.style.setProperty("--falling-text-rx-start", rotationX + "deg");
    node.style.setProperty("--falling-text-ry-start", rotationY + "deg");
    node.style.setProperty("--falling-text-rz-start", rotationZ + "deg");
    node.style.setProperty("--falling-text-rx-middle", roundedBetween(rotationX - 20, rotationX + 20, 2) + "deg");
    node.style.setProperty("--falling-text-ry-middle", roundedBetween(rotationY - 24, rotationY + 24, 2) + "deg");
    node.style.setProperty("--falling-text-rz-middle", roundedBetween(rotationZ - 28, rotationZ + 28, 2) + "deg");
    node.style.setProperty("--falling-text-rx-end", roundedBetween(-50, 50, 2) + "deg");
    node.style.setProperty("--falling-text-ry-end", roundedBetween(-58, 58, 2) + "deg");
    node.style.setProperty("--falling-text-rz-end", roundedBetween(-45, 45, 2) + "deg");

    return {
      duration: roundedBetween(5.8, 11.5, 2),
      delay: roundedBetween(0, 1.4, 2),
      scale: scale,
      opacity: opacity,
      depth: depth,
    };
  }

  function createParticle(documentRef, phrase, state, animated) {
    var node = documentRef.createElement("span");
    var timing = setParticleVariables(node);

    node.className = "falling-text-engine__item";
    node.textContent = phrase;
    node.setAttribute("aria-hidden", "true");
    node.style.zIndex = String(Math.round(timing.depth + 520));

    if (animated) {
      node.style.animationName = "falling-text-engine__fall";
      node.style.animationDuration = timing.duration + "s";
      node.style.animationDelay = timing.delay + "s";
      node.style.animationTimingFunction = "linear";
      node.style.animationFillMode = "both";

      var remove = function () {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
        state.nodes.delete(node);
      };

      node.addEventListener("animationend", remove, { once: true });
      node.addEventListener("animationcancel", remove, { once: true });
      global.setTimeout(remove, (timing.duration + timing.delay + 1.2) * 1000);
    } else {
      var staticX = roundedBetween(-5, 98, 2);
      var staticY = roundedBetween(-3, 92, 2);
      var staticScale = roundedBetween(0.52, 1.48, 3);
      var staticOpacity = roundedBetween(0.18, 0.72, 3);

      node.style.left = staticX + "%";
      node.style.top = staticY + "%";
      node.style.opacity = staticOpacity;
      node.style.filter = "blur(" + roundedBetween(0, 2.5, 2) + "px)";
      node.style.transform = [
        "translate3d(0, 0, " + timing.depth + "px)",
        "rotateX(" + roundedBetween(-28, 28, 2) + "deg)",
        "rotateY(" + roundedBetween(-35, 35, 2) + "deg)",
        "rotateZ(" + roundedBetween(-16, 16, 2) + "deg)",
        "scale(" + staticScale + ")",
      ].join(" ");
    }

    state.nodes.add(node);
    state.layer.appendChild(node);
  }

  function initFallingText(options) {
    options = options || {};

    var documentRef = global.document;
    if (!documentRef) {
      return function () {};
    }

    var layer = resolveLayer(options.layer, documentRef);
    if (!layer || typeof layer.appendChild !== "function" || !layer.style) {
      throw new TypeError("initFallingText requires a DOM element in the layer option.");
    }

    var previous = instances && instances.get(layer);
    if (previous) {
      previous.destroy();
    }

    ensureStyles(documentRef);

    var phrase = options.phrase == null ? "Happy Birthday" : String(options.phrase);
    var state = {
      layer: layer,
      nodes: new Set(),
      timer: null,
      destroyed: false,
      reduced: false,
      mediaQuery: null,
      ownedStyles: {},
    };

    var computed = global.getComputedStyle ? global.getComputedStyle(layer) : null;
    if (!computed || computed.position === "static") {
      addStyleWithRestore(layer, "position", "relative", state.ownedStyles);
    }
    if (!computed || computed.perspective === "none") {
      addStyleWithRestore(layer, "perspective", "980px", state.ownedStyles);
    }
    addStyleWithRestore(layer, "transform-style", "preserve-3d", state.ownedStyles);
    if (!computed || computed.overflow === "visible") {
      addStyleWithRestore(layer, "overflow", "hidden", state.ownedStyles);
    }

    function clearParticles() {
      state.nodes.forEach(function (node) {
        if (node.parentNode === layer) {
          layer.removeChild(node);
        }
      });
      state.nodes.clear();
    }

    function stopSpawner() {
      if (state.timer !== null) {
        global.clearInterval(state.timer);
        state.timer = null;
      }
    }

    function spawn() {
      if (!state.destroyed && !state.reduced) {
        createParticle(documentRef, phrase, state, true);
      }
    }

    function startAnimation() {
      stopSpawner();
      clearParticles();

      var initialCount = 30;
      for (var i = 0; i < initialCount; i += 1) {
        spawn();
      }
      state.timer = global.setInterval(spawn, 180);
    }

    function renderStatic() {
      stopSpawner();
      clearParticles();

      for (var i = 0; i < 26; i += 1) {
        createParticle(documentRef, phrase, state, false);
      }
    }

    function onMotionPreferenceChange(event) {
      state.reduced = !!event.matches;
      if (state.reduced) {
        renderStatic();
      } else {
        startAnimation();
      }
    }

    state.mediaQuery = typeof global.matchMedia === "function"
      ? global.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };
    state.reduced = !!state.mediaQuery.matches;

    if (typeof state.mediaQuery.addEventListener === "function") {
      state.mediaQuery.addEventListener("change", onMotionPreferenceChange);
    } else if (typeof state.mediaQuery.addListener === "function") {
      state.mediaQuery.addListener(onMotionPreferenceChange);
    }

    state.destroy = function () {
      if (state.destroyed) {
        return;
      }
      state.destroyed = true;
      stopSpawner();
      clearParticles();

      if (state.mediaQuery) {
        if (typeof state.mediaQuery.removeEventListener === "function") {
          state.mediaQuery.removeEventListener("change", onMotionPreferenceChange);
        } else if (typeof state.mediaQuery.removeListener === "function") {
          state.mediaQuery.removeListener(onMotionPreferenceChange);
        }
      }

      restoreStyles(layer, state.ownedStyles);
      if (instances && instances.get(layer) === state) {
        instances.delete(layer);
      }
    };

    if (instances) {
      instances.set(layer, state);
    }

    if (state.reduced) {
      renderStatic();
    } else {
      startAnimation();
    }

    return state.destroy;
  }

  global.initFallingText = initFallingText;
}(typeof globalThis !== "undefined" ? globalThis : window));
