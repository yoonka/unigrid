'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _defineProperty = (function (obj, key, value) {
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
})

var _objectWithoutProperties = (function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
})

var _classCallCheck = (function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
})

var _createClass = (function () {
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
})();

var _possibleConstructorReturn = (function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
})

var _inherits = (function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
})

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

var UnigridEmptyCell = function (_React$Component) {
  _inherits(UnigridEmptyCell, _React$Component);

  function UnigridEmptyCell() {
    _classCallCheck(this, UnigridEmptyCell);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridEmptyCell).apply(this, arguments));
  }

  _createClass(UnigridEmptyCell, [{
    key: "render",
    value: function render() {
      return this.props.rowAs === "header" ? React.createElement("th", this.props) : React.createElement("td", this.props);
    }
  }]);

  return UnigridEmptyCell;
}(React.Component);

var UnigridTextCell = function (_React$Component2) {
  _inherits(UnigridTextCell, _React$Component2);

  function UnigridTextCell() {
    _classCallCheck(this, UnigridTextCell);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridTextCell).apply(this, arguments));
  }

  _createClass(UnigridTextCell, [{
    key: "render",
    value: function render() {
      var p = this.props;
      return p.rowAs === "header" ? React.createElement(
        "th",
        p,
        p.cell
      ) : React.createElement(
        "td",
        p,
        p.cell
      );
    }
  }]);

  return UnigridTextCell;
}(React.Component);

var UnigridNumberCell = function (_React$Component3) {
  _inherits(UnigridNumberCell, _React$Component3);

  function UnigridNumberCell() {
    _classCallCheck(this, UnigridNumberCell);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridNumberCell).apply(this, arguments));
  }

  _createClass(UnigridNumberCell, [{
    key: "render",
    value: function render() {
      var p = this.props;
      return p.rowAs === "header" ? React.createElement(
        "th",
        p,
        p.cell.toString()
      ) : React.createElement(
        "td",
        p,
        p.cell.toString()
      );
    }
  }]);

  return UnigridNumberCell;
}(React.Component);

var UnigridRow = function (_React$Component) {
  _inherits(UnigridRow, _React$Component);

  function UnigridRow() {
    _classCallCheck(this, UnigridRow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridRow).apply(this, arguments));
  }

  _createClass(UnigridRow, [{
    key: 'mkProps',
    value: function mkProps(cell, item, value, rowAs, mixIn) {
      if (item !== undefined) {
        Object.assign(cell, { item: item });
      }
      if (value !== undefined) {
        Object.assign(cell, { cell: value });
      }
      if (rowAs !== undefined) {
        Object.assign(cell, { rowAs: rowAs });
      }
      Object.assign(cell, mixIn);
      return cell;
    }
  }, {
    key: 'createCellForType',
    value: function createCellForType(type, oProps) {
      var show = oProps.show;
      var using = oProps.using;
      var as = oProps.as;
      var bindToCell = oProps.bindToCell;

      var nProps = _objectWithoutProperties(oProps, ['show', 'using', 'as', 'bindToCell']);

      if (typeof type !== 'string') {
        return React.createElement(type, nProps);
      }

      if (this.props.hasOwnProperty('cellTypes') && this.props.cellTypes && this.props.cellTypes.hasOwnProperty(type)) {
        return React.createElement(this.props.cellTypes[type], nProps);
      }

      switch (type) {
        case 'string':
          return React.createElement(UnigridTextCell, nProps);
        case 'number':
          return React.createElement(UnigridNumberCell, nProps);
        case 'empty':
          return React.createElement(UnigridEmptyCell, nProps);
      }

      // 'error' type
      return React.createElement(UnigridTextCell, _extends({}, nProps, { cell: "Error: " + nProps.cell }));
    }
  }, {
    key: 'getItemValue',
    value: function getItemValue(item, cell) {
      var property = cell.show;

      if (typeof property === 'function') {
        var fakeCell = Object.assign({ item: item }, cell);
        return property.apply(fakeCell, arguments);
      }

      return property && item.hasOwnProperty(property) ? item[property] : undefined;
    }
  }, {
    key: 'getCell',
    value: function getCell(item, cell, rowAs, mixIn) {
      var tCell = typeof cell;

      if (tCell === 'string' || tCell === 'function') {
        var _value = this.getItemValue(item, { show: cell });
        if (_value !== undefined) {
          return [typeof _value, this.mkProps({}, item, _value, rowAs, mixIn)];
        } else {
          return ['error', this.mkProps({}, item, cell, rowAs, mixIn)];
        }
      }
      if (cell === null) {
        return ['empty', this.mkProps({}, item, undefined, rowAs, mixIn)];
      }
      if (tCell !== 'object') {
        return ['error', this.mkProps({}, item, cell.toString(), rowAs, mixIn)];
      }

      var value = this.getItemValue(item, cell);

      // create a shallow copy to avoid modifying the cell config (which props is based on)
      var nProps = Object.assign({}, cell);
      nProps = this.mkProps(nProps, item, value, rowAs, mixIn);

      if (cell.hasOwnProperty('using')) {
        return [cell.using, nProps];
      }
      if (cell.hasOwnProperty('as')) {
        return [cell.as, nProps];
      }

      if (value !== undefined) {
        return [typeof value, nProps];
      }

      Object.assign(nProps, { cell: JSON.stringify(cell) });
      return ['error', nProps];
    }
  }, {
    key: 'createAndProcessCell',
    value: function createAndProcessCell(item, cell, rowAs, mixIn) {
      var _getCell = this.getCell(item, cell, rowAs, mixIn);

      var _getCell2 = _slicedToArray(_getCell, 2);

      var type = _getCell2[0];
      var props = _getCell2[1];

      var binds = props.bindToCell || [];
      if (typeof binds === 'string') {
        binds = [binds];
      }
      var toAdd = [];

      var _loop = function _loop(i) {
        var funName = binds[i];
        var oldFun = props[funName];
        if (oldFun !== undefined) {
          var newFun = function newFun() {
            return oldFun.apply(this.unigridCell, arguments);
          };
          toAdd.push(newFun);
          props[funName] = newFun.bind(newFun);
        }
      };

      for (var i = 0; i < binds.length; i++) {
        _loop(i);
      }
      var component = this.createCellForType(type, props);
      for (var _i = 0; _i < toAdd.length; _i++) {
        toAdd[_i].unigridCell = component;
      }
      return component;
    }
  }, {
    key: 'render',
    value: function render() {
      var cfg = this.props;
      var elems = cfg.cells || [];
      var cfgMixIn = cfg.mixIn;
      var arr = [];
      for (var i = 0; i < elems.length; i++) {
        arr.push(this.createAndProcessCell(cfg.item, elems[i], cfg.rowAs, cfgMixIn));
      }

      var cells = cfg.cells;
      var rowAs = cfg.rowAs;
      var mixIn = cfg.mixIn;
      var item = cfg.item;
      var cellTypes = cfg.cellTypes;

      var nProps = _objectWithoutProperties(cfg, ['cells', 'rowAs', 'mixIn', 'item', 'cellTypes']);

      return React.createElement('tr', nProps, arr);
    }
  }]);

  return UnigridRow;
}(React.Component);

var UnigridSection = function (_React$Component) {
  _inherits(UnigridSection, _React$Component);

  function UnigridSection() {
    _classCallCheck(this, UnigridSection);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridSection).apply(this, arguments));
  }

  _createClass(UnigridSection, [{
    key: 'makeElement',
    value: function makeElement(name) {
      var _props = this.props;
      var children = _props.children;

      var other = _objectWithoutProperties(_props, ['children']);

      return React.createElement(name, other, children);
    }
  }]);

  return UnigridSection;
}(React.Component);

var UnigridHeader = function (_UnigridSection) {
  _inherits(UnigridHeader, _UnigridSection);

  function UnigridHeader() {
    _classCallCheck(this, UnigridHeader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridHeader).apply(this, arguments));
  }

  _createClass(UnigridHeader, [{
    key: 'render',
    value: function render() {
      return this.makeElement('thead');
    }
  }]);

  return UnigridHeader;
}(UnigridSection);

var UnigridSegment = function (_UnigridSection2) {
  _inherits(UnigridSegment, _UnigridSection2);

  function UnigridSegment() {
    _classCallCheck(this, UnigridSegment);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridSegment).apply(this, arguments));
  }

  _createClass(UnigridSegment, [{
    key: 'render',
    value: function render() {
      return this.makeElement('tbody');
    }
  }]);

  return UnigridSegment;
}(UnigridSection);

var UnigridFooter = function (_UnigridSection3) {
  _inherits(UnigridFooter, _UnigridSection3);

  function UnigridFooter() {
    _classCallCheck(this, UnigridFooter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridFooter).apply(this, arguments));
  }

  _createClass(UnigridFooter, [{
    key: 'render',
    value: function render() {
      return this.makeElement('tfoot');
    }
  }]);

  return UnigridFooter;
}(UnigridSection);

var Unigrid = function (_React$Component2) {
  _inherits(Unigrid, _React$Component2);

  function Unigrid() {
    _classCallCheck(this, Unigrid);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Unigrid).apply(this, arguments));
  }

  _createClass(Unigrid, [{
    key: 'createChildren',
    value: function createChildren(cfg, data, item) {
      var acc = [];
      this.addChildren(acc, cfg, data, item);
      return acc;
    }
  }, {
    key: 'addChildren',
    value: function addChildren(acc, cfg, data, item) {
      if (item === undefined) {
        this.executeSelect(acc, 0, cfg, data);
      } else {
        this.addRows(acc, cfg, data, item);
      }
    }
  }, {
    key: 'executeSelect',
    value: function executeSelect(acc, select, cfg, data) {
      var _this6 = this;

      var it = _defineProperty({}, Symbol.iterator, function () {
        return _this6.makeIterator(data, select);
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = it[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          this.addRows(acc, cfg, data, i);
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
    }
  }, {
    key: 'makeIterator',
    value: function makeIterator(data, select) {
      switch (typeof select) {
        case 'number':
          return this.makeNumberIterator(data, select);
        case 'string':
          return this.makeStringIterator(data, select);
      }
    }
  }, {
    key: 'makeNumberIterator',
    value: function makeNumberIterator(data, select) {
      var delivered = false;
      return {
        next: function next() {
          if (!delivered && select >= 0 && select < data.length) {
            delivered = true;
            return { value: data[select], done: false };
          }
          return { done: true };
        }
      };
    }
  }, {
    key: 'makeStringIterator',
    value: function makeStringIterator(data, select) {
      if (select === 'all') {
        return this.makeAllIterator(data);
      }
    }
  }, {
    key: 'makeAllIterator',
    value: function makeAllIterator(data) {
      var nextIndex = 0;
      return {
        next: function next() {
          return nextIndex < data.length ? { value: data[nextIndex++], done: false } : { done: true };
        }
      };
    }
  }, {
    key: 'addRows',
    value: function addRows(acc, cfg, data, item) {
      if (cfg.hasOwnProperty('condition')) {
        if (this.shouldSkip(cfg.condition, item)) return;
      }

      if (cfg.hasOwnProperty('fromProperty')) {
        var condition = cfg.condition;
        var fromProperty = cfg.fromProperty;

        var nCfg = _objectWithoutProperties(cfg, ['condition', 'fromProperty']);

        this.addChildren(acc, nCfg, item[cfg.fromProperty], undefined);
        return;
      }

      if (cfg.hasOwnProperty('select')) {
        var _condition = cfg.condition;
        var _fromProperty = cfg.fromProperty;
        var select = cfg.select;

        var _nCfg = _objectWithoutProperties(cfg, ['condition', 'fromProperty', 'select']);

        this.executeSelect(acc, cfg.select, _nCfg, data);
        return;
      }

      if (cfg.hasOwnProperty('section')) {
        var _condition2 = cfg.condition;
        var _fromProperty2 = cfg.fromProperty;
        var _select = cfg.select;
        var section = cfg.section;

        var _nCfg2 = _objectWithoutProperties(cfg, ['condition', 'fromProperty', 'select', 'section']);

        acc.push(this.createSection(cfg.section, _nCfg2, data, item));
        return;
      }

      if (cfg.hasOwnProperty('cells')) {
        var _condition3 = cfg.condition;
        var _fromProperty3 = cfg.fromProperty;
        var _select2 = cfg.select;
        var _section = cfg.section;

        var _nCfg3 = _objectWithoutProperties(cfg, ['condition', 'fromProperty', 'select', 'section']);

        var cTypes = this.props.cellTypes;
        acc.push(React.createElement(UnigridRow, _extends({}, _nCfg3, { item: item, cellTypes: cTypes })));
      }

      if (cfg.hasOwnProperty('show')) {
        for (var i = 0; i < cfg.show.length; i++) {
          this.addChildren(acc, cfg.show[i], data, item);
        }
      }
    }
  }, {
    key: 'shouldSkip',
    value: function shouldSkip(condition, item) {
      if (condition.hasOwnProperty('ifDoes')) {
        if (condition.ifDoes === 'exist') {
          if (condition.hasOwnProperty('property')) {
            if (!item.hasOwnProperty(condition.property)) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }, {
    key: 'createSection',
    value: function createSection(section, cfg, data, item) {

      function getComponent(section) {
        switch (section) {
          case 'header':
            return UnigridHeader;
          case 'body':
            return UnigridSegment;
          case 'footer':
            return UnigridFooter;
        }
      }

      var children = this.createChildren(cfg, data, item);
      var cells = cfg.cells;
      var show = cfg.show;
      var rowAs = cfg.rowAs;
      var mixIn = cfg.mixIn;

      var other = _objectWithoutProperties(cfg, ['cells', 'show', 'rowAs', 'mixIn']);

      Object.assign(other, { children: children });
      return React.createElement(getComponent(section), other);
    }
  }, {
    key: 'cleanProps',
    value: function cleanProps(props) {
      var condition = props.condition;
      var fromProperty = props.fromProperty;
      var select = props.select;
      var section = props.section;
      var cells = props.cells;
      var show = props.show;
      var rowAs = props.rowAs;
      var mixIn = props.mixIn;

      var other = _objectWithoutProperties(props, ['condition', 'fromProperty', 'select', 'section', 'cells', 'show', 'rowAs', 'mixIn']);

      return other;
    }
  }, {
    key: 'render',
    value: function render() {
      var table = this.props.table;
      var children = this.createChildren(table, this.props.data, undefined);
      return React.createElement('table', this.cleanProps(table), children);
    }
  }]);

  return Unigrid;
}(React.Component);

exports.UnigridHeader = UnigridHeader;
exports.UnigridSegment = UnigridSegment;
exports.UnigridFooter = UnigridFooter;
exports.Unigrid = Unigrid;
exports.UnigridRow = UnigridRow;
exports.UnigridEmptyCell = UnigridEmptyCell;
exports.UnigridTextCell = UnigridTextCell;
exports.UnigridNumberCell = UnigridNumberCell;
//# sourceMappingURL=unigrid.js.map