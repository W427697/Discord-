/// <reference types="webpack-env" />

// optimization: stop HMR propagation in webpack
if (typeof module !== 'undefined') module?.hot?.decline();
