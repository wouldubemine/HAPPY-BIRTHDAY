(function exposeBackground(global) {
  'use strict';

  var STYLE_ID = 'birthday-background-animation-styles';
  var STAR_COUNT = 90;
  var HEART_COUNT = 14;

  var ANIMATION_CSS = [
    '[data-birthday-background="layer"] {',
    '  pointer-events: none;',
    '  overflow: hidden;',
    '}',
    '',
    '.birthday-background-star,',
    '.birthday-background-heart {',
    '  position: absolute;',
    '  display: block;',
    '  pointer-events: none;',
    '  user-select: none;',
  '}',
    '',
    '.birthday-background-star {',
    '  border-radius: 50%;',
    '  background: #fff;',
    '  box-shadow: 0 0 4px rgba(255, 255, 255, 0.95);',
    '  animation: birthday-background-twinkle var(--birthday-star-duration, 4s) ease-in-out var(--birthday-star-delay, 0s) infinite alternate;',
    '}',
    '',
    '.birthday-background-heart {',
    '  color: #ff355d;',
    '  font-family: Georgia, "Times New Roman", serif;',
    '  font-size: 1.5rem;',
    '  font-weight: 700;',
    '  line-height: 1;',
    '  text-shadow:',
    '    0 0 4px rgba(255, 36, 83, 0.95),',
    '    0 0 10px rgba(255, 36, 83, 0.8),',
    '    0 0 20px rgba(255, 36, 83, 0.55);',
    '  animation: birthday-background-heart-float var(--birthday-heart-duration, 7s) ease-in-out var(--birthday-heart-delay, 0s) infinite;',
    '}',
    '',
    '@keyframes birthday-background-twinkle {',
    '  0% {',
    '    opacity: var(--birthday-star-opacity, 0.65);',
    '    transform: translate3d(0, 0, 0) scale(0.72);',
    '  }',
    '  50% {',
    '    opacity: 1;',
    '    transform: translate3d(var(--birthday-star-drift-x, 0px), var(--birthday-star-drift-y, 0px), 0) scale(1.18);',
    '  }',
    '  100% {',
    '    opacity: var(--birthday-star-opacity, 0.65);',
    '    transform: translate3d(0, 0, 0) scale(0.82);',
    '  }',
    '}',
    '',
    '@keyframes birthday-background-heart-float {',
    '  0%, 100% {',
    '    opacity: var(--birthday-heart-opacity, 0.7);',
    '    transform: translate3d(0, 0, 0) rotate(-8deg) scale(0.92);',
    '  }',
    '  50% {',
    '    opacity: 1;',
    '    transform: translate3d(var(--birthday-heart-drift-x, 0px), var(--birthday-heart-drift-y, -14px), 0) rotate(8deg) scale(1.08);',
    '  }',
    '}'
  ].join('\n');

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round(value * factor) / factor;
  }

  function asCssNumber(value, decimals) {
    return String(round(value, decimals));
  }

  function getDocument(layer) {
    if (layer && layer.ownerDocument) {
      return layer.ownerDocument;
    }

    if (global && global.document) {
      return global.document;
    }

    return null;
  }

  function resolveLayer(layer, doc) {
    if (typeof layer === 'string') {
      if (doc && typeof doc.querySelector === 'function') {
        return doc.querySelector(layer);
      }
      return null;
    }

    if (layer && typeof layer.appendChild === 'function') {
      return layer;
    }

    return null;
  }

  function ensureAnimationStyles(doc) {
    if (!doc || typeof doc.createElement !== 'function') {
      return;
    }

    if (typeof doc.getElementById === 'function' && doc.getElementById(STYLE_ID)) {
      return;
    }

    var style = doc.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.textContent = ANIMATION_CSS;

    var target = doc.head || doc.documentElement || doc.body;
    if (target && typeof target.appendChild === 'function') {
      target.appendChild(style);
    }
  }

  function setDataMarker(element, value) {
    if (typeof element.setAttribute === 'function') {
      element.setAttribute('data-birthday-background', value);
    } else if (element.dataset) {
      element.dataset.birthdayBackground = value;
    }
  }

  function isGeneratedNode(node) {
    if (!node) {
      return false;
    }

    if (typeof node.getAttribute === 'function') {
      return Boolean(node.getAttribute('data-birthday-background'));
    }

    return Boolean(node.dataset && node.dataset.birthdayBackground);
  }

  function clearGeneratedNodes(layer) {
    if (!layer || !layer.children) {
      return;
    }

    for (var index = layer.children.length - 1; index >= 0; index -= 1) {
      var child = layer.children[index];
      if (isGeneratedNode(child)) {
        layer.removeChild(child);
      }
    }
  }

  function prepareLayer(layer) {
    if (!layer) {
      return;
    }

    setDataMarker(layer, 'layer');

    // Supply sensible defaults while preserving styles supplied by the scene.
    if (layer.style) {
      if (!layer.style.position) {
        layer.style.position = 'absolute';
      }
      if (!layer.style.inset) {
        layer.style.inset = '0';
      }
      if (!layer.style.overflow) {
        layer.style.overflow = 'hidden';
      }
    }
  }

  function createStar(doc) {
    var star = doc.createElement('span');
    var size = randomBetween(1, 3.8);
    var opacity = randomBetween(0.35, 0.95);

    star.className = 'birthday-background-star';
    star.setAttribute('aria-hidden', 'true');
    setDataMarker(star, 'star');
    star.style.left = asCssNumber(randomBetween(0, 100), 3) + '%';
    star.style.top = asCssNumber(randomBetween(0, 100), 3) + '%';
    star.style.width = asCssNumber(size, 2) + 'px';
    star.style.height = asCssNumber(size, 2) + 'px';
    star.style.opacity = asCssNumber(opacity, 2);
    star.style.setProperty('--birthday-star-opacity', asCssNumber(opacity, 2));
    star.style.setProperty('--birthday-star-delay', asCssNumber(randomBetween(-6, 0), 2) + 's');
    star.style.setProperty('--birthday-star-duration', asCssNumber(randomBetween(2.4, 6.5), 2) + 's');
    star.style.setProperty('--birthday-star-drift-x', asCssNumber(randomBetween(-5, 5), 2) + 'px');
    star.style.setProperty('--birthday-star-drift-y', asCssNumber(randomBetween(-5, 5), 2) + 'px');

    return star;
  }

  function createHeart(doc) {
    var heart = doc.createElement('span');
    var opacity = randomBetween(0.45, 0.9);

    heart.className = 'birthday-background-heart';
    heart.textContent = '\u2665';
    heart.setAttribute('aria-hidden', 'true');
    setDataMarker(heart, 'heart');
    heart.style.left = asCssNumber(randomBetween(2, 98), 3) + '%';
    heart.style.top = asCssNumber(randomBetween(5, 96), 3) + '%';
    heart.style.fontSize = asCssNumber(randomBetween(0.9, 2.1), 2) + 'rem';
    heart.style.opacity = asCssNumber(opacity, 2);
    heart.style.setProperty('--birthday-heart-opacity', asCssNumber(opacity, 2));
    heart.style.setProperty('--birthday-heart-delay', asCssNumber(randomBetween(-8, 0), 2) + 's');
    heart.style.setProperty('--birthday-heart-duration', asCssNumber(randomBetween(5, 10), 2) + 's');
    heart.style.setProperty('--birthday-heart-drift-x', asCssNumber(randomBetween(-12, 12), 2) + 'px');
    heart.style.setProperty('--birthday-heart-drift-y', asCssNumber(randomBetween(-22, -8), 2) + 'px');

    return heart;
  }

  function populateLayer(layer, count, createNode) {
    var nodes = [];
    if (!layer) {
      return nodes;
    }

    clearGeneratedNodes(layer);

    var doc = getDocument(layer);
    if (!doc || typeof doc.createElement !== 'function') {
      return nodes;
    }

    for (var index = 0; index < count; index += 1) {
      var node = createNode(doc);
      layer.appendChild(node);
      nodes.push(node);
    }

    return nodes;
  }

  function initBackground(config) {
    config = config || {};

    var suppliedStarLayer = config.starLayer;
    var suppliedHeartLayer = config.heartLayer;
    var doc = getDocument(suppliedStarLayer) || getDocument(suppliedHeartLayer);
    var starLayer = resolveLayer(suppliedStarLayer, doc);
    var heartLayer = resolveLayer(suppliedHeartLayer, doc);

    if (!doc && (starLayer || heartLayer)) {
      doc = getDocument(starLayer) || getDocument(heartLayer);
    }

    ensureAnimationStyles(doc);
    prepareLayer(starLayer);
    prepareLayer(heartLayer);

    var stars = populateLayer(starLayer, STAR_COUNT, createStar);
    var hearts = populateLayer(heartLayer, HEART_COUNT, createHeart);

    return {
      starLayer: starLayer,
      heartLayer: heartLayer,
      stars: stars,
      hearts: hearts
    };
  }

  if (global) {
    global.initBackground = initBackground;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
