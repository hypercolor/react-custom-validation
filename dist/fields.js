'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.handleFieldEvent = handleFieldEvent;
exports.shouldShowValidation = shouldShowValidation;

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _lodash = require('lodash');

var _helpers = require('./helpers');

var _state = require('./state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EVENTS = ['change', 'blur', 'submit', 'reset'];

function normalizeDebounce(state, field, event, debounce) {
  if (event !== 'change') {
    // disallow debounce for other event types
    (0, _helpers.assertSpec)(debounce === false || debounce === 0 || debounce == null, 'Nonzero debounce is allowed only for change event', debounce, 'false or 0 or null');
    return 0;
  }

  (0, _helpers.assertSpec)(typeof debounce === 'number' || typeof debounce === 'boolean' || debounce == null, 'Invalid debounce.', debounce, 'number or boolean or null');

  if (debounce === true || debounce == null) {
    // use default debounce set in (normalized) config
    var _state$config$typingD = state.config.typingDebounce,
        before = _state$config$typingD.before,
        after = _state$config$typingD.after,
        _state$fields = state.fields,
        blur = _state$fields.blur,
        submit = _state$fields.submit;

    return field in blur || field in submit ? after : before;
  } else if (debounce === false) {
    return 0;
  } else {
    return debounce;
  }
}

function normalizeFields(state, fields) {
  var result = fields == null ? state.config.fields : fields;
  result = (0, _lodash.isArray)(result) ? result : [result];

  (0, _helpers.assertSpec)((0, _lodash.isArray)(result) && result.every(function (f) {
    return typeof f === 'string';
  }), 'Invalid field.', fields, 'string or Array<string> or null');
  return result;
}

function withoutKeys(keys) {
  return function (obj) {
    var result = _extends({}, obj);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        delete result[k];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return result;
  };
}

function withKeys(keys, value) {
  return function (obj) {
    var result = _extends({}, obj);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var k = _step2.value;

        result[k] = value;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return result;
  };
}

function handleReset(state, fields) {
  if (fields == null) {
    // delete all recorded field events
    return (0, _immutabilityHelper2.default)(state, { fields: { $set: _state.initialFieldsState } });
  } else {
    var _fields = normalizeFields(state, fields);
    return (0, _immutabilityHelper2.default)(state, {
      fields: {
        change: { $apply: withoutKeys(_fields) },
        blur: { $apply: withoutKeys(_fields) },
        submit: { $apply: withoutKeys(_fields) },
        isTyping: { $apply: withoutKeys(_fields) }
      }
    });
  }
}

function handleFieldEvent(dispatchUpdate, field, event, debounce) {
  dispatchUpdate(function (state) {
    (0, _helpers.assertSpec)(EVENTS.indexOf(event) >= 0, 'Invalid event.', event, 'one of ' + EVENTS);

    if (event === 'reset') {
      return handleReset(state, field);
    }

    var fields = normalizeFields(state, field);
    var debounces = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var f = _step3.value;

        var nd = normalizeDebounce(state, f, event, debounce);
        if (nd > 0) {
          debounces[f] = nd;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var now = new Date().getTime();

    var updateDesc = _defineProperty({}, event, { $apply: withKeys(fields, true) });

    var _loop = function _loop(f) {
      var d = debounces[f];
      if (updateDesc.isTyping == null) {
        updateDesc.isTyping = {};
      }
      updateDesc.isTyping[f] = { $set: now + d };

      setTimeout(function () {
        return dispatchUpdate(function (laterState) {
          var isTyping = laterState.fields.isTyping;
          if (isTyping[f] === now + d) {
            return (0, _immutabilityHelper2.default)(laterState, { fields: { isTyping: { $apply: withoutKeys([f]) } } });
          } else {
            return laterState;
          }
        });
      }, d);
    };

    for (var f in debounces) {
      _loop(f);
    }

    if (event === 'submit' || event === 'blur') {
      updateDesc.isTyping = { $apply: withoutKeys(fields) };
    }

    return (0, _immutabilityHelper2.default)(state, { fields: updateDesc });
  });
}

function shouldShowValidation(validationFields, fields) {
  var change = fields.change,
      blur = fields.blur,
      submit = fields.submit,
      isTyping = fields.isTyping;

  var _validationFields = _slicedToArray(validationFields, 2),
      dependsOn = _validationFields[0],
      needTouch = _validationFields[1];

  var touched = needTouch.every(function (f) {
    return f in change || f in blur || f in submit;
  });
  var typing = dependsOn.some(function (f) {
    return isTyping[f] != null;
  });
  return touched && !typing;
}