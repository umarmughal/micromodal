(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MicroModal = factory());
}(this, (function () { 'use strict';

var version = "0.1.1";

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var MicroModal = function () {
  'use strict';

  var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

  var Modal = function () {
    function Modal() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          targetModal = _ref.targetModal,
          _ref$triggers = _ref.triggers,
          triggers = _ref$triggers === undefined ? [] : _ref$triggers,
          _ref$disableScroll = _ref.disableScroll,
          disableScroll = _ref$disableScroll === undefined ? false : _ref$disableScroll,
          _ref$debugMode = _ref.debugMode,
          debugMode = _ref$debugMode === undefined ? false : _ref$debugMode,
          _ref$onShow = _ref.onShow,
          onShow = _ref$onShow === undefined ? function () {} : _ref$onShow,
          _ref$onClose = _ref.onClose,
          onClose = _ref$onClose === undefined ? function () {} : _ref$onClose;

      classCallCheck(this, Modal);

      this.modal = document.getElementById(targetModal);
      if (triggers.length > 0) this.registerTriggers.apply(this, toConsumableArray(triggers));

      this.disableScroll = disableScroll;
      this.callbacks = { onShow: onShow, onClose: onClose };

      this.onClick = this.onClick.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
    }

    createClass(Modal, [{
      key: 'registerTriggers',
      value: function registerTriggers() {
        var _this = this;

        for (var _len = arguments.length, triggers = Array(_len), _key = 0; _key < _len; _key++) {
          triggers[_key] = arguments[_key];
        }

        triggers.forEach(function (trigger) {
          trigger.addEventListener('click', function () {
            return _this.showModal();
          });
        });
      }
    }, {
      key: 'showModal',
      value: function showModal() {
        this.activeElement = document.activeElement;
        this.modal.setAttribute('aria-hidden', 'false');
        this.scrollBehaviour('disable');
        this.setFocusToFirstNode();
        this.addEventListeners();
        this.callbacks.onShow(this.modal);
      }
    }, {
      key: 'closeModal',
      value: function closeModal() {
        this.modal.setAttribute('aria-hidden', 'true');
        this.removeEventListeners();
        this.scrollBehaviour('enable');
        this.activeElement.focus();
        this.callbacks.onClose(this.modal);
      }
    }, {
      key: 'scrollBehaviour',
      value: function scrollBehaviour(toggle) {
        if (this.disableScroll === false) return;

        var body = document.querySelector('body');
        switch (toggle) {
          case 'enable':
            Object.assign(body.style, { overflow: 'initial', height: 'initial' });
            break;
          case 'disable':
            Object.assign(body.style, { overflow: 'hidden', height: '100vh' });
            break;
          default:
        }
      }
    }, {
      key: 'addEventListeners',
      value: function addEventListeners() {
        this.modal.addEventListener('touchstart', this.onClick);
        this.modal.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);
      }
    }, {
      key: 'removeEventListeners',
      value: function removeEventListeners() {
        this.modal.removeEventListener('touchstart', this.onClick);
        this.modal.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);
      }
    }, {
      key: 'onClick',
      value: function onClick(event) {
        if (event.target.hasAttribute('data-micromodal-close')) {
          this.closeModal();
          event.preventDefault();
        }
      }
    }, {
      key: 'onKeydown',
      value: function onKeydown(event) {
        if (event.keyCode === 27) this.closeModal(event);
        if (event.keyCode === 9) this.maintainFocus(event);
      }
    }, {
      key: 'getFocusableNodes',
      value: function getFocusableNodes() {
        var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
        return Object.keys(nodes).map(function (key) {
          return nodes[key];
        });
      }
    }, {
      key: 'setFocusToFirstNode',
      value: function setFocusToFirstNode() {
        var focusableNodes = this.getFocusableNodes();
        if (focusableNodes.length) focusableNodes[0].focus();
      }
    }, {
      key: 'maintainFocus',
      value: function maintainFocus(event) {
        var focusableNodes = this.getFocusableNodes();
        var focusedItemIndex = focusableNodes.indexOf(document.activeElement);

        if (event.shiftKey && focusedItemIndex === 0) {
          focusableNodes[focusableNodes.length - 1].focus();
          event.preventDefault();
        }

        if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
          focusableNodes[0].focus();
          event.preventDefault();
        }
      }
    }]);
    return Modal;
  }();

  var generateTriggerMap = function generateTriggerMap(triggers) {
    var triggerMap = [];

    triggers.forEach(function (trigger) {
      var targetModal = trigger.dataset.micromodalTrigger;
      if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
      triggerMap[targetModal].push(trigger);
    });

    return triggerMap;
  };

  var validateModalPresence = function validateModalPresence(id) {
    if (!document.getElementById(id)) {
      console.warn('MicroModal v' + version + ': \u2757Seems like you have missed %c\'' + id + '\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.');
      console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<div class="modal" id="' + id + '"></div>');
      return false;
    }
  };

  var validateTriggerPresence = function validateTriggerPresence(triggers) {
    if (triggers.length <= 0) {
      console.warn('MicroModal v' + version + ': \u2757Please specify at least one %c\'micromodal-trigger\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.');
      console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<a href="#" data-micromodal-trigger="my-modal"></a>');
      return false;
    }
  };

  var validateArgs = function validateArgs(triggers, triggerMap) {
    validateTriggerPresence(triggers);
    if (!triggerMap) return true;
    for (var id in triggerMap) {
      validateModalPresence(id);
    }return true;
  };

  var init = function init(config) {
    var options = config || {};

    var triggers = document.querySelectorAll('[data-micromodal-trigger]');
    var triggerMap = generateTriggerMap(triggers);

    if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return;

    for (var key in triggerMap) {
      var value = triggerMap[key];
      options.targetModal = key;
      options.triggers = [].concat(toConsumableArray(value));
      new Modal(options); // eslint-disable-line no-new
    }
  };

  var activeModal = null;

  /**
   * Shows a particular modal
   * @param  {string} targetModal [The id of the modal to display]
   * @param  {{object}} config [The configuration object to pass]
   * @return {void}
   */
  var show = function show(targetModal, config) {
    var options = config || {};
    options.targetModal = targetModal;

    if (options.debugMode === true && validateModalPresence(targetModal) === false) return;

    activeModal = new Modal(options); // eslint-disable-line no-new
    activeModal.showModal();
  };

  var close = function close() {
    activeModal.closeModal();
  };

  return { init: init, show: show, close: close };
}();

return MicroModal;

})));
