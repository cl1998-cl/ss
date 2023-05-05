(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var _toString = Object.prototype.toString;
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
  } // gq-op => gqOp

  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  }); //像对象添加属性

  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }

    return to;
  }
  function cached(fn) {
    var cache = Object.create(null);
    return function cachedFn(str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  function isUndef(v) {
    return v === undefined || v === null;
  }
  function isTrue(v) {
    return v === true;
  }
  function isDef(v) {
    return v !== undefined && v !== null;
  }
  function isPromise(val) {
    return isDef(val) && typeof val.then === 'function' && typeof val["catch"] === 'function';
  }
  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);

    while (i--) {
      ret[i] = list[i + start];
    }

    return ret;
  }
  var emptyObject = Object.freeze({});
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
  }); //空函数

  function noop(a, b, c) {}

  function polyfillBind(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length;
      return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    }

    boundFn._length = fn.length;
    return boundFn;
  }

  function nativeBind(fn, ctx) {
    return fn.bind(ctx);
  } //兼容，有bind直接用，没有就用call或者apply改写


  var bind$1 = Function.prototype.bind ? nativeBind : polyfillBind; //删除数组中第一个匹配的元素

  function remove$1(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);

      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }
  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }

    return expectsLowerCase ? function (val) {
      return map[val.toLowerCase()];
    } : function (val) {
      return map[val];
    };
  }
  var no = function no(a, b, c) {
    return false;
  };
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  function genStaticKeys(modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || []);
    }, []).join(',');
  }

  function invokeWithErrorHandling(handler, context, args, vm, info) {
    var res;

    try {
      res = args ? handler.apply(context, args) : handler.call(context);

      if (res && !res._isVue && isPromise(res)) {
        res = res["catch"](function (e) {
          return handleError(e, vm, info + " (Promise/async)");
        });
      }
    } catch (e) {
    }

    return res;
  }

  function handleError(err, vm, info) {}

  function updateListeners(on, oldOn, add, remove, createOnceHandler, vm) {
    var name, cur, old, event;

    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);

      if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }

        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }

        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }

    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove(event.name, oldOn[name], event.capture);
      }
    }
  }
  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once = name.charAt(0) === '~'; // Prefixed last, checked first

    name = once ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once,
      capture: capture,
      passive: passive
    };
  });
  function createFnInvoker(fns, vm) {
    function invoker() {
      var fns = invoker.fns;

      if (Array.isArray(fns)) {
        var cloned = fns.slice();

        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
      }
    }

    invoker.fns = fns;
    return invoker;
  }

  function initEvents(vm) {
    vm._events = {};
    vm._hasHookEvent = false;
    var listeners = vm.$options._parentListeners;

    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }
  var target;

  function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm);
    target = undefined;
  }

  function add(event, fn) {
    target.$on(event, fn);
  }

  function remove(event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler(event, fn) {
    var _target = target;
    return function onceHandler() {
      var res = fn.apply(null, arguments);

      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    };
  }

  var hookRE = /^hook:/;
  function $on(event, fn) {
    var vm = this;

    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);

      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }

    return vm;
  }
  function $off(event, fn) {
    var vm = this;

    if (!arguments.length) {
      vm._events = {};
      return vm;
    }

    if (Array.isArray(event)) {
      for (var _i = 0, l = event.length; _i < l; _i++) {
        vm.$off(event[_i], fn);
      }

      return vm;
    }

    var cbs = vm._events[event];

    if (!cbs) {
      return vm;
    }

    if (!fn) {
      vm._events[event] = null;
      return vm;
    } // specific handler


    var cb;
    var i = cbs.length;

    while (i--) {
      cb = cbs[i];

      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }

    return vm;
  }
  function $once(event, fn) {
    var vm = this;

    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }

    on.fn = fn;
    vm.$on(event, on);
    return vm;
  }
  function $emit(event) {
    var vm = this;
    var cbs = vm._events[event];

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler";

      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }

    return vm;
  }

  var config = {
    optionMergeStrategies: false
  };

  var strats = config.optionMergeStrategies; //默认子优先

  var defaultStrat = function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  };

  function mergeOptions(parent, child, vm) {
    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child);
    normalizeInject(child);
    normalizeDirectives$1(child);

    if (!child._base) {
      if (child["extends"]) {
        parent = mergeOptions(parent, child["extends"], vm);
      }

      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;

    for (key in parent) {
      mergeField(key);
    }

    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }

    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }

    return options;
  }
  /*
  * 格式化props，变为{type: Number}格式
  * */

  function normalizeProps(options, vm) {
    var props = options.props;
    if (!props) return;
    var res = {};
    var i, val, name;

    if (Array.isArray(props)) {
      i = props.length;

      while (i--) {
        val = props[i];

        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = {
            type: null
          };
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val) ? val : {
          type: val
        };
      }
    }

    options.props = res;
  } //变为对象格式


  function normalizeInject(options, vm) {
    var inject = options.inject;
    if (!inject) return;
    var normalized = options.inject = {};

    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = {
          from: inject[i]
        };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val) ? extend({
          from: key
        }, val) : {
          from: val
        };
      }
    }
  } //变为对象格式


  function normalizeDirectives$1(options) {
    var dirs = options.directives;

    if (dirs) {
      for (var key in dirs) {
        var def = dirs[key];

        if (typeof def === 'function') {
          dirs[key] = {
            bind: def,
            update: def
          };
        }
      }
    }
  }

  var VNode = /*#__PURE__*/function () {
    function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
      _classCallCheck(this, VNode);

      _defineProperty(this, "tag", void 0);

      _defineProperty(this, "data", void 0);

      _defineProperty(this, "children", void 0);

      _defineProperty(this, "text", void 0);

      _defineProperty(this, "elm", void 0);

      _defineProperty(this, "ns", void 0);

      _defineProperty(this, "context", void 0);

      _defineProperty(this, "key", void 0);

      _defineProperty(this, "componentOptions", void 0);

      _defineProperty(this, "componentInstance", void 0);

      _defineProperty(this, "parent", void 0);

      _defineProperty(this, "raw", void 0);

      _defineProperty(this, "isStatic", void 0);

      _defineProperty(this, "isRootInsert", void 0);

      _defineProperty(this, "isComment", void 0);

      _defineProperty(this, "isCloned", void 0);

      _defineProperty(this, "isOnce", void 0);

      _defineProperty(this, "asyncFactory", void 0);

      _defineProperty(this, "asyncMeta", void 0);

      _defineProperty(this, "isAsyncPlaceholder", void 0);

      _defineProperty(this, "ssrContext", void 0);

      _defineProperty(this, "fnContext", void 0);

      _defineProperty(this, "fnOptions", void 0);

      _defineProperty(this, "devtoolsMeta", void 0);

      _defineProperty(this, "fnScopeId", void 0);

      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.fnContext = undefined;
      this.fnOptions = undefined;
      this.fnScopeId = undefined;
      this.key = data && data.key;
      this.componentOptions = componentOptions;
      this.componentInstance = undefined;
      this.parent = undefined;
      this.raw = false;
      this.isStatic = false;
      this.isRootInsert = false;
      this.isComment = false;
      this.isCloned = false;
      this.isOnce = false;
      this.asyncFactory = asyncFactory;
      this.asyncMeta = undefined;
      this.isAsyncPlaceholder = false;
    }

    _createClass(VNode, [{
      key: "child",
      get: function get() {
        return this.componentInstance;
      }
    }]);

    return VNode;
  }();
  function createEmptyVNode() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
  }

  function initLifecycle(vm) {
    var options = vm.$options; //找到当前组建的最近的父亲（非抽象组建）

    var parent = options.parent;

    if (parent && !options["abstract"]) {
      while (parent.$options["abstract"] && parent.$parent) {
        parent = parent.$parent;
      }

      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;
    vm.$children = [];
    vm.$refs = {};
    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }
  function mountComponent(vm, el, hydrating) {
    vm.$el = el;

    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
    }
  }
  function _update$1(vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevNode = vm._vnode;

    vm._vnode = vnode; //上一次的虚拟节点， 若无则代表初始化，若有则是更新

    if (!prevNode) {
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
    } else {
      vm.$el = vm.__patch__(prevNode, vnode);
    }

    if (prevEl) {
      prevEl.__vue__ = null;
    }

    if (vm.$el) {
      vm.$el.__vue__ = vm;
    } // if parent is an HOC, update its $el as well


    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
  }

  function createElement$1(context, tag, data, children, normalizationType, alwaysNormalize) {}

  function initRender(vm) {
    vm._vnode = null;
    vm._staticTrees = null;
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode;
    parentVnode && parentVnode.context; //vm.$slots = resolveSlots(options._renderChildren, renderContext)

    vm.scopedSlots = emptyObject; //tag, data, children, normalizationType, alwaysNormalize

    vm._c = function (a, b, c, d) {
      return createElement$1();
    };

    vm.$createElement = function (a, b, c, d) {
      return createElement$1();
    };

    parentVnode && parentVnode.data; // defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    // defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
  function render() {
    var vm = this;
    var _vm$$options = vm.$options,
        render = _vm$$options.render;
        _vm$$options._parentVnode;
    var vnode;
    vnode = render.call(vm._renderProxy, vm.$createElement);
    console.log('执行了_render');
    return vnode;
  }

  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/; //监测一个方法是否以_或者$开头

  function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F;
  } //obj.key = val

  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  var uid$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      _defineProperty(this, "id", void 0);

      _defineProperty(this, "subs", void 0);

      this.id = uid$1++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) ;
      }
    }, {
      key: "notify",
      value: function notify() {
        var subs = this.subs.slice();

        if (!config.async) {
          subs.sort(function (a, b) {
            return a.id - b.id;
          });
        }

        for (var i = 0, length = subs.length; i < length; i++) {
          subs[i].update();
        }
      }
    }, {
      key: "addSub",
      value: function addSub(sub) {
        this.subs.push(sub);
      }
    }, {
      key: "removeSub",
      value: function removeSub(sub) {
        remove$1(this.subs, sub);
      }
    }]);

    return Dep;
  }();

  _defineProperty(Dep, "target", void 0);

  Dep.target = null;

  var shouldObserve = true;
  function toggleObserving(value) {
    shouldObserve = value;
  }
  function observe(value, asRootData) {
    if (!isPlainObject(value) || value instanceof VNode) {
      return;
    }

    var ob;

    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (shouldObserve && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
      ob = new Observer(value);
    }

    if (asRootData && ob) {
      ob.vmCount++;
    }

    return ob;
  }
  function defineReactive(obj, key, val, customSetter, shallow) {
    var dep = new Dep();
    var prototype = Object.getOwnPropertyDescriptor(obj, key);

    if (prototype && prototype.configurable === false) {
      return;
    }

    var getter = prototype && prototype.get;
    var setter = prototype && prototype.set; //没有get或者有set

    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        var value = getter ? getter.call(obj) : val;

        if (Dep.target) {
          dep.depend();

          if (childOb) {
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        var value = getter ? getter.call(obj) : val; //值未发生实际变化，或者新值及旧值为NaN||Symbol

        if (newValue === value || newValue !== newValue && value !== value) {
          return;
        }

        if (customSetter) {
          customSetter();
        }

        if (getter && !setter) {
          return;
        }

        if (setter) {
          setter.call(obj, newValue);
        } else {
          val = newValue;
        }

        childOb = !shallow && observe(newValue);
        dep.notify();
      }
    });
  }
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      _defineProperty(this, "value", void 0);

      _defineProperty(this, "dep", void 0);

      _defineProperty(this, "vmCount", void 0);

      this.value = value;
      this.dep = new Dep();
      this.vmCount = 0;
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(obj) {
        var keys = Object.keys(obj);

        for (var i = 0, length = keys.length; i < length; i++) {
          defineReactive(obj, keys[i]);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(list) {
        for (var i = 0, length = list.length; i < length; i++) {
          observe(list[i]);
        }
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    for (var i = 0, l = value.length; i < l; i++) {
      var e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();

      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  function validateProp(key, propsOptions, propsData, vm) {
    var prop = propsOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key]; //判断是不是布尔类型，布尔类型特殊处理

    var booleanIndex = getTypeIndex(Boolean, prop.type);

    if (booleanIndex > -1) {
      //没有默认值，没传就是false
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        //传了
        var stringIndex = getTypeIndex(String, prop.type);

        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    } //


    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key); //给prop添加监测

      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }

    return value;
  }
  /*
  * @param a, b
  * 判断b中是否有a类型
  * @return 没有返回-1  有则大于-1
  * */

  function getTypeIndex(type, exceptedTypes) {
    if (!Array.isArray(exceptedTypes)) {
      return isSameType(type, exceptedTypes) ? 0 : -1;
    }

    var length = exceptedTypes.length;

    for (var i = 0; i < length; i++) {
      if (isSameType(type, exceptedTypes[i])) {
        return i;
      }
    }

    return -1;
  }

  function isSameType(a, b) {
    return getType(a) === getType(b);
  }

  function getType(fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
  }
  /*
  * 获取prop的默认值
  * */


  function getPropDefaultValue(vm, prop, key) {
    //没有默认值返回undefined
    if (!hasOwn(prop, 'default')) {
      return undefined;
    }

    var def = prop["default"];

    if (isPlainObject(def)) ;

    if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
      return vm._props[key];
    } //默认值default可能为函数


    return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
  }

  function initState(vm) {
    vm._watchers = [];
    var opts = vm.$options;

    if (opts.props) {
      initProps(vm, opts.props);
    }

    if (opts.methods) {
      initMethods(vm, opts.methods);
    }

    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true
      /* asRootData */
      );
    }
  }

  function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent; //只监测最初的值

    if (!isRoot) {
      toggleObserving(false);
    }

    for (var key in propsOptions) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      defineReactive(props, key, value);

      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    }

    toggleObserving(true);
  }

  function initMethods(vm, methods) {
    //需要监测方法名是否和prop重复
    var props = vm.$options.props;

    for (var key in methods) {
      if (typeof methods[key] !== 'function') ;

      if (props && hasOwn(props, key)) ;

      if (key in vm && isReserved(key)) ; //绑定方法内部的this


      vm[key] = typeof methods[key] !== 'function' ? noop : bind$1(methods[key], vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? getData(vm, data) : data || {}; //data必须为对象

    if (!isPlainObject(data)) {
      data = {};
    } //监测methods和prop中是否有重复的key


    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;

    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];

      if (methods && hasOwn(methods, key)) ;

      if (props && hasOwn(props, key)) ;

      if (!isReserved(key)) {
        //把属性代理到vm上
        proxy(vm, '_data', key);
      }
    }

    observe(data, true);
  }

  function getData(vm, data) {
    data.call(vm, vm);
  }
  /*
  * 把key 从sourceKey上代理到target目标对象上
  * */


  function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        return this[sourceKey][key];
      },
      set: function set(val) {
        this[sourceKey][key] = val;
      }
    });
  }

  var uid = 0;
  function _init(options) {
    var vm = this;
    vm._uid = uid++;
    vm._isVue = true;

    if (options && options._isComponent) ; else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options, vm);
    }

    vm._renderProxy = vm;
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm); //initInjections(vm)

    initState(vm); //initProvide
    //callHook('created')

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  function resolveConstructorOptions(Ctor) {
    var options = Ctor.options;

    if (Ctor["super"]) {
      return {};
    }

    return options;
  }

  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);

      if (!selected) {
        return document.createElement('div');
      }

      return selected;
    } else {
      return el;
    }
  }

  function createElement(tagName, vnode) {
    var _vnode$data, _vnode$data$attrs;

    var elm = document.createElement(tagName);
    if (tagName !== 'select') return elm;

    if (((_vnode$data = vnode.data) === null || _vnode$data === void 0 ? void 0 : (_vnode$data$attrs = _vnode$data.attrs) === null || _vnode$data$attrs === void 0 ? void 0 : _vnode$data$attrs.multiple) !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }

    return elm;
  }
  function createTextNode(text) {
    return document.createTextNode(text);
  }
  function createComment(text) {
    return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
    node.removeChild(child);
  }
  function appendChild(node, child) {
    node.appendChild(child);
  }
  function parentNode(node) {
    return node.parentNode;
  }
  function nextSibling(node) {
    return node.nextSibling;
  }
  function tagName(node) {
    return node.tagName;
  }
  function setTextContent(node, text) {
    node.textContent = text;
  }
  function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createElement: createElement,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  function mergeVNodeHook(def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }

    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook() {
      hook.apply(this, arguments);
      remove$1(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      invoker = createFnInvoker([wrappedHook]);
    } else {
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }
  }

  function resolveAsset(options, type, id, warnMissing) {
    if (typeof id !== 'string') return;
    var assets = options[type];
    if (hasOwn(assets, id)) return assets[id];
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) return assets[camelizedId];
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
    return assets[id] || assets[camelizedId] || assets[PascalCaseId];
  }

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function destroy(vnode) {
      updateDirectives(vnode, emptyNode);
    }
  }; //更新

  function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }
  /**
   * @author pomelo
   * @param oldVnode 。。。
   * @param vnode 。。。
   * @private
   */


  function _update(oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
    var dirsWithInsert = [];
    var dirsWithPostPatch = [];
    var key, oldDir, dir;

    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];

      if (!oldDir) {
        callHook(dir, 'bind', vnode, oldVnode);

        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook(dir, 'update', vnode, oldVnode);

        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostPatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function callInsert() {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };

      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostPatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostPatch.length; i++) {
          callHook(dirsWithPostPatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives(dirs, vm) {
    var res = Object.create(null);
    if (!dirs) return res;
    var i, dir;

    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];

      if (!dir.modifiers) {
        dir.modifiers = emptyModifiers;
      }

      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name);
    }

    return res;
  }

  function getRawDirName(dir) {
    return dir.rawName || "".concat(dir.name, ".").concat(Object.keys(dir.modifiers || {}).join('.'));
  }

  function callHook(dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];

    if (fn) {
      try {
        fn(vnode.elm, dir, oldVnode, isDestroy);
      } catch (e) {
        console.log(e);
      }
    }
  }

  var ref = {
    create: function create(_, vnode) {
      registerRef(vnode);
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef(vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) return;
    var vm = vnode.context;
    var ref = vnode.componentIntance || vnode.elm;
    var refs = vm.$refs;

    if (isRemoval) {
      //删除
      if (Array.isArray(refs[key])) {
        remove$1(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      //添加
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  var baseModules = [ref, directives];

  var validDivisionCharRE = /[\w).+\-_$\]]/;
  function parseFilters(exp) {
    var inSingle = false;
    var inDouble = false;
    var inTemplateString = false;
    var inRegex = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);

      if (inSingle) {
        if (c === 0x27 && prev !== 0x5C) inSingle = false;
      } else if (inDouble) {
        if (c === 0x22 && prev !== 0x5C) inDouble = false;
      } else if (inTemplateString) {
        if (c === 0x60 && prev !== 0x5C) inTemplateString = false;
      } else if (inRegex) {
        if (c === 0x2f && prev !== 0x5C) inRegex = false;
      } else if (c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22:
            inDouble = true;
            break;
          // "

          case 0x27:
            inSingle = true;
            break;
          // '

          case 0x60:
            inTemplateString = true;
            break;
          // `

          case 0x28:
            paren++;
            break;
          // (

          case 0x29:
            paren--;
            break;
          // )

          case 0x5B:
            square++;
            break;
          // [

          case 0x5D:
            square--;
            break;
          // ]

          case 0x7B:
            curly++;
            break;
          // {

          case 0x7D:
            curly--;
            break;
          // }
        }

        if (c === 0x2f) {
          // /
          var j = i - 1;
          var p = void 0; // find first non-whitespace prev char

          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== ' ') break;
          }

          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }

    if (expression === undefined) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    function pushFilter() {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression;
  }

  function wrapFilter(exp, filter) {
    var i = filter.indexOf('(');

    if (i < 0) {
      // _f: resolveFilter
      return "_f(\"".concat(filter, "\")(").concat(exp, ")");
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return "_f(\"".concat(name, "\")(").concat(exp).concat(args !== ')' ? ',' + args : args);
    }
  }

  function pluckModuleFunction(modules, key) {
    return modules ? modules.map(function (m) {
      return m[key];
    }).filter(function (_) {
      return _;
    }) : [];
  }
  function getAndRemoveAttr(el, name, removeFromMap) {
    var val;

    if ((val = el.attrsMap[name]) !== null) {
      var list = el.attrsList;

      for (var i = 0; i < list.length; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break;
        }
      }
    }

    if (removeFromMap) {
      delete el.attrsMap[name];
    }

    return val;
  }
  function getBindingAttr(el, name, getStatic) {
    var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);

    if (dynamicValue != null) {
      return parseFilters(dynamicValue);
    } else if (getStatic !== false) {
      var staticValue = getAndRemoveAttr(el, name);

      if (staticValue != null) {
        return JSON.stringify(staticValue);
      }
    }
  }

  function transformNode$1(el, options) {
    var staticClass = getAndRemoveAttr(el, 'class');

    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }

    var classBinding = getBindingAttr(el, 'class', false
    /* getStatic */
    );

    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData$2(el) {
    var data = '';

    if (el.staticClass) {
      data += "staticClass:".concat(el.staticClass, ",");
    }

    if (el.classBinding) {
      data += "class:".concat(el.classBinding, ",");
    }

    return data;
  }

  var klass = {
    staticKeys: ['staticClass'],
    transformNode: transformNode$1,
    genData: genData$2
  };

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res;
  });

  /* @flow */

  function transformNode(el, options) {
    var staticStyle = getAndRemoveAttr(el, 'style');

    if (staticStyle) {
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }

    var styleBinding = getBindingAttr(el, 'style', false
    /* getStatic */
    );

    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$1(el) {
    var data = '';

    if (el.staticStyle) {
      data += "staticStyle:".concat(el.staticStyle, ",");
    }

    if (el.styleBinding) {
      data += "style:(".concat(el.styleBinding, "),");
    }

    return data;
  }

  var style = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode,
    genData: genData$1
  };

  var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');
  var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr'); // Elements that you can, intentionally, leave open
  // (and which close themselves)

  var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
  };
  var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*");
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var comment = /^<!\--/;
  var conditionalComment = /^<!\[/;
  var doctype = /^<!DOCTYPE [^>]+>/i;

  function decodeAttr(value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) {
      return decodingMap[match];
    });
  }

  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
  var isPlainTextElement = makeMap('script,style,textarea', true);

  var shouldIgnoreFirstNewline = function shouldIgnoreFirstNewline(tag, html) {
    return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
  };

  function parseHTML(html, options) {
    console.log(html, 'html===========================>');
    var expectHTML = options.expectHTML;
    var isUnaryTag = options.isUnaryTag || no;
    var canBeLeftOpenTag = options.canBeLeftOpenTag || no;
    var stack = [];
    var index = 0,
        lastTag;

    while (html) {

      if (!lastTag || !isPlainTextElement(lastTag)) {
        var textEnd = html.indexOf('<');

        if (textEnd === 0) {
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');
            advance(commentEnd + 3);
            continue;
          }

          if (conditionalComment.test(html)) ;

          var doctypeMatch = html.match(doctype);

          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue;
          } // End tag:


          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            var curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue;
          } // Start tag:


          var startTagMatch = parseStartTag();

          if (startTagMatch) {
            handleStartTag(startTagMatch);

            if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
              advance(1);
            }

            continue;
          }
        }

        var text = void 0,
            next = void 0,
            rest = void 0;

        if (textEnd >= 0) {
          rest = html.slice(textEnd);

          while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) break;
            textEnd += next;
            rest = html.slice(textEnd);
          }

          text = html.substring(0, textEnd);
        }

        if (textEnd < 0) {
          text = html;
        }

        if (text) {
          advance(text.length);
        }

        if (options.chars && text) {
          options.chars(text, index - text.length, index);
        }
      }
    }

    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        var end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
          attr.start = index;
          advance(attr[0].length);
          attr.end = index;
          match.attrs.push(attr);
        }

        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match;
        }
      }
    } //入栈且匹配属性


    function handleStartTag(match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }

        if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      var unary = isUnaryTag(tagName) || !!unarySlash;
      var l = match.attrs.length;
      var attrs = new Array(l);

      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        var value = args[3] || args[4] || args[5] || '';
        var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href' ? options.shouldDecodeNewlinesForHref : options.shouldDecodeNewlines;
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        };
      }

      if (!unary) {
        stack.push({
          tag: tagName,
          lowerCasedTag: tagName.toLowerCase(),
          attrs: attrs,
          start: match.start,
          end: match.end
        });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    } //出栈


    function parseEndTag(tagName, start, end) {
      var pos, lowerCasedTagName;
      if (start == null) start = index;
      if (end == null) end = index;

      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();

        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break;
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var i = stack.length - 1; i >= pos; i--) {
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        } // Remove the open elements from the stack


        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }

        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  function isServerRendering() {
    return false;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
  });
  function parseText(text, delimiters) {
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;

    if (!tagRE.test(text)) {
      return;
    }

    var tokens = [];
    var rawTokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, tokenValue;

    while (match = tagRE.exec(text)) {
      index = match.index; // push text token

      if (index > lastIndex) {
        rawTokens.push(tokenValue = text.slice(lastIndex, index));
        tokens.push(JSON.stringify(tokenValue));
      } // tag token


      var exp = match[1].trim();
      tokens.push("_s(".concat(exp, ")"));
      rawTokens.push({
        '@binding': exp
      });
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      rawTokens.push(tokenValue = text.slice(lastIndex));
      tokens.push(JSON.stringify(tokenValue));
    }

    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    };
  }

  var delimiters;
  //暂不处理关于指令方面的编译

  function parse(template, options) {
    var num = 0;

    function closeElement(element) {
      if (currentParent && !element.forbidden) {
        currentParent.children.push(element);
        element.parent = currentParent;
      }
    }

    pluckModuleFunction(options.modules, 'transformNode');
    pluckModuleFunction(options.modules, 'preTransformNode');
    pluckModuleFunction(options.modules, 'postTransformNode');
    var stack = [];
    var root;
    var currentParent;
    parseHTML(template, {
      start: function start(tag, attrs, unary, _start, end) {
        var element = createASTElement(tag, attrs, currentParent);

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
        }

        if (!root) {
          root = element;
        }

        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          closeElement(element);
        }
      },
      end: function end() {
        var element = stack[stack.length - 1];
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        closeElement(element);
      },
      chars: function chars(text, start, end) {
        if (!currentParent) return;
        var children = currentParent.children;

        if (text.trim()) {
          text = text; //text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
        } else if (!children.length) {
          text = ' ';
        } else {
          text = ' ';
        }

        console.log(text !== ' ', ++num, text);
        var res;
        var child;

        if (text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          };
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          child = {
            type: 3,
            text: text
          };
        }

        if (child) {
          children.push(child);
        }
      },
      comment: function comment() {}
    });
    console.log(root, 'root=====================>');
    return root;
  }
  function createASTElement(tag, attrs, parent) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      rawAttrsMap: {},
      parent: parent,
      children: []
    };
  }

  function makeAttrsMap(attrs) {
    var map = {};

    for (var i = 0, l = attrs.length; i < l; i++) {
      map[attrs[i].name] = attrs[i].value;
    }

    return map;
  }

  function isForbiddenTag(el) {
    return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
  }

  function preTransformNode(el, options) {
    if (el.tag === 'input') {
      var map = el.attrsMap;

      if (!map['v-model']) {
        return;
      }

      var typeBinding;

      if (map[':type'] || map['v-bind:type']) {
        typeBinding = getBindingAttr(el, 'type');
      }

      if (!map.type && !typeBinding && map['v-bind']) {
        typeBinding = "(".concat(map['v-bind'], ").type");
      }

      if (typeBinding) {
        getAndRemoveAttr(el, 'v-if', true);
        getAndRemoveAttr(el, 'v-else', true) != null;
        getAndRemoveAttr(el, 'v-else-if', true);
      }
    }
  }

  var model = {
    preTransformNode: preTransformNode
  };

  var modules$1 = [klass, style, model];

  var modules = [].concat(_toConsumableArray(baseModules), _toConsumableArray(modules$1));
  var emptyNode = new VNode('', {}, []);
  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
  function patch() {
    return createPatchFunction({
      nodeOps: nodeOps,
      modules: modules
    });
  }
  function createPatchFunction(backend) {
    var i,
        j,
        cbs = {};
    var modules = backend.modules;
        backend.nodeOps; //合并

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];

      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    } //定义了许多函数


    return function (oldVnode, vnode, hydrating, removeOnly) {
      console.log('执行了patch');
      return 'patch';
    };
  }

  var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
  var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');
  var isPreTag = function isPreTag(tag) {
    return tag === 'pre';
  };
  function getTagNamespace(tag) {
    if (isSVG(tag)) {
      return 'svg';
    } // basic support for MathML
    // note it doesn't support other MathML elements being component roots


    if (tag === 'math') {
      return 'math';
    }
  }
  var isReservedTag = function isReservedTag(tag) {
    return isHTMLTag(tag) || isSVG(tag);
  };

  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function mustUseProp(tag, type, attr) {
    return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
  };

  var baseOptions = {
    exceptHTML: true,
    modules: modules$1,
    directives: directives,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

  function createCompileToFunctionFn(compile) {
    var cache = Object.create(null);
    return function (template, options, vm) {
      options = extend({}, options);
      options.warn;
      delete options.warn;
      var key = options.delimiters ? String(options.delimiters) + template : template;

      if (cache[key]) {
        return cache[key];
      }

      var compiled = compile(template, options);
      var res = {};
      res.render = createFunction(compiled.render);
      res.staticRenderFns = 'res.staticRenderFns';
      return cache[key] = res;
    };
  }

  function createFunction(code, errors) {
    try {
      return new Function(code);
    } catch (err) {
      errors.push({
        err: err,
        code: code
      });
      return noop;
    }
  }

  function createCompilerCreator(baseCompile) {
    return function (baseOptions) {
      function compiler(template, options) {
        var finalOptions = Object.create(baseOptions);

        if (options) {
          if (options.modules) {
            finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
          } // merge custom directives


          if (options.directives) {
            finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives);
          } // copy other options


          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        var compiled = baseCompile(template.trim(), finalOptions);
        compiled.a = 'return compiled';
        return compiled;
      }

      return {
        compiler: compiler,
        compileToFunctions: createCompileToFunctionFn(compiler) // compileToFunctions: () => {
        // 	console.log('compileToFunctions')
        // }

      };
    };
  }

  function genHandlers(events, isNative) {}

  function on(el, dir) {
    el.wrapListeners = function (code) {
      return "_g(".concat(code, ",").concat(dir.value, ")");
    };
  }

  function bind(el, dir) {
    el.wrapData = function (code) {
      return "_b(".concat(code, ",'").concat(el.tag, "',").concat(dir.value, ",").concat(dir.modifiers && dir.modifiers.prop ? 'true' : 'false').concat(dir.modifiers && dir.modifiers.sync ? ',true' : '', ")");
    };
  }

  var baseDirectives = {
    on: on,
    bind: bind,
    cloak: noop
  };

  var CodegenState = /*#__PURE__*/_createClass(function CodegenState(options) {
    _classCallCheck(this, CodegenState);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "warn", void 0);

    _defineProperty(this, "transforms", void 0);

    _defineProperty(this, "dataGenFns", void 0);

    _defineProperty(this, "directives", void 0);

    _defineProperty(this, "maybeComponent", void 0);

    _defineProperty(this, "onceId", void 0);

    _defineProperty(this, "staticRenderFns", void 0);

    _defineProperty(this, "pre", void 0);

    this.options = options;
    this.warn = options.warn || noop;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    var isReservedTag = options.isReservedTag || no;

    this.maybeComponent = function (el) {
      return !!el.component || !isReservedTag(el.tag);
    };

    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  });
  function generate(ast, options) {
    var state = new CodegenState(options);
    var code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: "with(this){return ".concat(code, "}"),
      staticRenderFns: state.staticRenderFns
    };
  }

  function genElement(el, state) {
    if (el.parent) {
      el.pre = el.pre || el.parent.pre;
    }

    if (el["if"]) ; else {

      if (el.component) {
        genComponent(el.component, el, state);
      } else {
        var data;

        if (!el.plain || el.pre && state.maybeComponent(el)) {
          data = genData(el, state);
          console.log(data, el, 'data=============>');
        }
      }
    }
  }

  function genComponent(componentName, el, state) {
    var children = el.inlineTemplate ? null : genChildren();
    return "_c(".concat(componentName, ",").concat(genData(el, state)).concat(children ? ",".concat(children) : '', ")");
  }

  function genChildren(el, state) {}

  function genData(el) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    console.log(state, 'state=///////////');
    debugger;
    var data = '{'; //指令优先

    var dirs = genDirectives(el, state);
    if (dirs) data += dirs + ','; // key

    if (el.key) {
      data += "key:".concat(el.key, ",");
    } // ref


    if (el.ref) {
      data += "ref:".concat(el.ref, ",");
    }

    if (el.component) {
      data += "tag:\"".concat(el.tag, "\",");
    }

    for (var i = 0; i < ((_state$dataGenFns = state.dataGenFns) === null || _state$dataGenFns === void 0 ? void 0 : _state$dataGenFns.length); i++) {
      var _state$dataGenFns;

      data += state.dataGenFns[i](el);
    }

    debugger;

    if (el.attrs) {
      data += "attrs:".concat(genProps(el.attrs), ",");
    } // DOM props


    if (el.props) {
      data += "domProps:".concat(genProps(el.props), ",");
    }

    if (el.events) {
      data += "".concat(genHandlers(el.events), ",");
    }

    if (el.nativeEvents) {
      data += "".concat(genHandlers(el.nativeEvents), ",");
    }

    if (el.slotTarget && !el.slotScope) {
      data += "slot:".concat(el.slotTarget, ",");
    }

    if (el.scopedSlots) {
      data += "".concat(genScopedSlots(el, el.scopedSlots, state), ",");
    }

    if (el.model) {
      data += "model:{value:".concat(el.model.value, ",callback:").concat(el.model.callback, ",expression:").concat(el.model.expression, "},");
    }

    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);

      if (inlineTemplate) {
        data += "".concat(inlineTemplate, ",");
      }
    }

    data = data.replace(/,$/, '') + '}';

    if (el.dynamicAttrs) {
      data = "_b(".concat(data, ",\"").concat(el.tag, "\",").concat(genProps(el.dynamicAttrs), ")");
    } // v-bind data wrap


    if (el.wrapData) {
      data = el.wrapData(data);
    } // v-on data wrap


    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }

    return data;
  }

  function genProps(props) {}

  function genDirectives(el, state) {
    var dirs = el.directives;
    if (!dirs) return;
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;

    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = state.directives[dir.name];

      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
      }

      if (needRuntime) {
        hasRuntime = true;
        res += "{name:\"".concat(dir.name, "\",rawName:\"").concat(dir.rawName, "\"").concat(dir.value ? ",value:(".concat(dir.value, "),expression:").concat(JSON.stringify(dir.value)) : '').concat(dir.arg ? ",arg:".concat(dir.isDynamicArg ? dir.arg : "\"".concat(dir.arg, "\"")) : '').concat(dir.modifiers ? ",modifiers:".concat(JSON.stringify(dir.modifiers)) : '', "},");
      }
    }

    if (hasRuntime) {
      return res.slice(0, -1) + ']';
    }
  }

  var createCompiler = createCompilerCreator(function (templates) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var ast = parse(templates.trim(), options);
    /*
    @todo 暂时不做静态标记
    * */

    if (options.optimize !== false) ;

    回gyiuguygiughjghjbghvvb;
    /*
    * @todo 暂时只做简单的生成
    * */

    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    };
  });

  var _createCompiler = createCompiler(baseOptions),
      compileToFunctions = _createCompiler.compileToFunctions;

  var View = /*#__PURE__*/function () {
    function View(options) {
      _classCallCheck(this, View);

      this.init(options);
    }

    _createClass(View, [{
      key: "init",
      value: function init(options) {
        _init.call(this, options);
      }
    }, {
      key: "$on",
      value: function $on$1(event, fn) {
        return $on(event, fn);
      }
    }, {
      key: "$off",
      value: function $off$1(event, fn) {
        return $off(event, fn);
      }
    }, {
      key: "$emit",
      value: function $emit$1(event) {
        return $emit(event);
      }
    }, {
      key: "$once",
      value: function $once$1(event, fn) {
        return $once(event, fn);
      }
    }, {
      key: "$mount",
      value: function $mount(el, hydrating) {
        el = query(el);
        return mountComponent(this, el);
      }
    }, {
      key: "_update",
      value: function _update(vnode, hydrating) {
        _update$1.call(this, vnode, hydrating);
      }
    }, {
      key: "__patch__",
      value: function __patch__() {
        return patch.call(this);
      }
    }, {
      key: "_render",
      value: function _render() {
        return render().call(this);
      }
    }]);

    return View;
  }();

  var mount = View.prototype.$mount;

  View.prototype.$mount = function (el, hydrating) {
    el = el && query(el);
    var options = this.$options;

    if (!options.render) {
      var template = options.template;

      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          return this;
        }
      } else if (el) {
        template = getOuterHTML(el);
      }

      if (template) {
        var _compileToFunctions = compileToFunctions(template, {
          outputSourceRange: true,
          shouldDecodeNewlines: false,
          shouldDecodeNewlinesForHref: false,
          delimiters: options.delimiters,
          comments: options.comments
        }, this),
            _render2 = _compileToFunctions.render,
            staticRenderFns = _compileToFunctions.staticRenderFns;

        options.render = _render2;
        options.staticRenderFns = staticRenderFns;
      }
    }

    return mount.call(this, el, hydrating);
  };

  View.options = {
    components: {},
    directives: {},
    filters: {},
    _base: View
  };

  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML;
  });
  window.View = View;

}));
//# sourceMappingURL=vue.js.map
