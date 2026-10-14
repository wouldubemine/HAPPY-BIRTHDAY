(function () {
  'use strict';

  function startBirthdayScene() {
    var starLayer = document.getElementById('star-layer');
    var heartLayer = document.getElementById('heart-layer');
    var textLayer = document.getElementById('falling-text-layer');
    var phrase = 'Happy birthday Humayra';

    if (typeof window.initBackground === 'function') {
      window.initBackground({
        starLayer: starLayer,
        heartLayer: heartLayer,
      });
    }

    if (typeof window.initFallingText === 'function') {
      window.initFallingText({
        layer: textLayer,
        phrase: phrase,
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBirthdayScene, { once: true });
  } else {
    startBirthdayScene();
  }
})();
