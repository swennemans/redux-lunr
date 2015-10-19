'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

self.onmessage = function (event) {
  //var lunr = require('lunr');

  var _JSON$parse = JSON.parse(event.data);

  var index = _JSON$parse.options.index;
  var _toIndex = _JSON$parse._toIndex;

  /* Dynamically create lunr.js index */
  var idx = (0, _lunr2['default'])(function () {
    var _this = this;

    Object.keys(index).forEach(function (key) {
      if (key === 'ref') {
        console.log('key is', index[key]);
        _this.ref(index[key]);
      } else {
        _this.field(key, index[key]);
      }
    });
  });

  /* index passed docs */
  _toIndex.forEach(function (doc) {
    idx.add(doc);
  });

  /* Return created index */
  self.postMessage(JSON.stringify(idx.toJSON()));
};