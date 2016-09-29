'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var _objectWithoutProperties = (function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
})

/*
Copyright (c) 2016, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// *** Utility functions ***

var isDefined = function isDefined(obj, prop) {
  var undefined; // really undefined
  return obj.hasOwnProperty(prop) && obj[prop] !== undefined;
};

var cleanCellProps = function cleanCellProps(props) {
  var cell = props.cell;
  var item = props.item;
  var rowAs = props.rowAs;
  var amend = props.amend;
  var treeAmend = props.treeAmend;

  var other = _objectWithoutProperties(props, ['cell', 'item', 'rowAs', 'amend', 'treeAmend']);

  return other;
};

// *** Data iterators ***

var makeIterator = function makeIterator(pData, pSelect) {

  function makeAllIterator(data) {
    var nextIndex = 0;
    return {
      next: function next() {
        return nextIndex < data.length ? { value: data[nextIndex++], done: false } : { done: true };
      }
    };
  }

  function makeStringIterator(data, select) {
    if (select === 'all') {
      return makeAllIterator(data);
    }
  }

  function makeNumberIterator(data, select) {
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

  switch (typeof pSelect) {
    case 'number':
      return makeNumberIterator(pData, pSelect);
    case 'string':
      return makeStringIterator(pData, pSelect);
  }
  return undefined;
};

// *** Processing expression objects ***

var applyFormatter = function applyFormatter(pProps) {
  var propertyFormatter = function propertyFormatter(props) {
    return isDefined(props, 'show') && isDefined(props.item, props.show) ? props.item[props.show] : undefined;
  };

  var functionFormatter = function functionFormatter(props) {
    return props.show(props);
  };

  var tShow = typeof pProps.show;
  switch (tShow) {
    case 'string':
      return propertyFormatter(pProps);
    case 'function':
      return functionFormatter(pProps);
  }
  return undefined;
};

var tryAmend = function tryAmend(pCfg, pItem, pExpr) {
  var pDef = arguments.length <= 3 || arguments[3] === undefined ? 'cells' : arguments[3];


  function applyAmend(cfg, item, fun) {
    var retObj = fun(cfg, item);
    return Object.assign({}, cfg, retObj /*fun(cfg, item)*/);
  }

  function amend(cfg, expr, item, how) {
    if (typeof how === 'function') {
      // if 'how' isn't an object then the default is to amend for 'cells'
      if (expr === pDef) {
        return applyAmend(cfg, item, how);
      }
    } else if (isDefined(how, expr)) {
      return applyAmend(cfg, item, how[expr]);
    }
    return cfg;
  }

  if (isDefined(pCfg, 'amend')) {
    return amend(pCfg, pExpr, pItem, pCfg.amend);
  } else if (isDefined(pCfg, 'treeAmend')) {
    return amend(pCfg, pExpr, pItem, pCfg.treeAmend);
  }
  return pCfg;
};

// *** Sorting functions ***

var getSorter = function getSorter(colToFields, defOrder) {
  var compareString = function compareString(a, b) {
    var la = a.toLowerCase();
    var lb = b.toLowerCase();

    if (la < lb) return -1;
    if (la > lb) return 1;
    return 0;
  };

  var compareAttributes = function compareAttributes(oAttrA, oAttrB) {
    var attrA = typeof oAttrA === 'object' ? oAttrA.valueOf() : oAttrA;
    var attrB = typeof oAttrB === 'object' ? oAttrB.valueOf() : oAttrB;

    var aType = typeof attrA;
    var bType = typeof attrB;

    if (aType !== bType) return 0;

    if (aType === 'string') {
      var retVal = compareString(attrA, attrB);
      if (retVal !== 0) return retVal;
    } else if (aType === 'number') {
      var _retVal = attrA - attrB;
      if (_retVal !== 0) return _retVal;
    }
    return 0;
  };

  var compareObjects = function compareObjects(a, b, attrs, isAsc) {
    for (var i = 0; i < attrs.length; i++) {
      var aVal = applyFormatter({ show: attrs[i], item: a });
      var bVal = applyFormatter({ show: attrs[i], item: b });
      var retVal = compareAttributes(aVal, bVal);
      if (retVal === 0) {
        continue;
      } else {
        return isAsc ? retVal : -retVal;
      }
    }
    return 0;
  };

  // fields - The list of fields in the 'item' by which the input 'data'
  //   should be sorted. If it's a function then it will be called, with the
  //   selected column as its argument, to obtain the list of fields.
  // defOrder - default order if 'box.order' isn't defined.
  var sorter = function sorter(data, box) {
    var fields = arguments.length <= 2 || arguments[2] === undefined ? function (col) {
      return [col];
    } : arguments[2];
    var defOrder = arguments.length <= 3 || arguments[3] === undefined ? 'asc' : arguments[3];

    var nColumns = typeof fields === 'function' ? fields(box.column) || [] : fields;
    var isAsc = (box.order || defOrder) === 'asc';
    var comparer = function comparer(a, b) {
      return compareObjects(a, b, nColumns, isAsc);
    };
    return data.slice().sort(comparer);
  };

  return function (data, box) {
    return sorter(data, box, colToFields, defOrder);
  };
};

// 'column' is used to track a change in sorting order. This name is supplied
//   to the sorter function, so if it's a name of a field in the data item
//   the default columnToFields mapper function can be used.
// 'order' is the order to be used when sorting. Its behaviour depends on
//     values supplied to this function in previous calls (if there were any).
//   Valid values are: undefined, 'alter', 'old:alter',
//     'asc', 'desc', 'new:asc' and 'new:desc'.
//   If undefined is supplied then 'new:asc' is used as default.
//   Value 'alter' means that subsequnt calls will alternate the order
//     ('asc' to 'desc' and 'desc' to 'asc').
//   Value 'old:alter' is similar to 'alter' but it will alternate only if the
//     supplied 'column' value is the same as supplied in the previous call.
//     If a new 'column' is supplied then it will leave the order unchanged.
//   Value 'asc' or 'desc' will unconditionally sort in ascending or
//     descending order.
//   Values 'new:asc' and 'new:desc' mean that the order (ascending or
//     descending) is to be used only if a new 'column' is supplied,
//     i.e. if 'box.column' != 'column. Otherwise the order will alternate.
// The first argument can be a function to override this with a new behaviour.
var sort = function sort(unigrid, column, order) {
  var alternate = function alternate(o) {
    return o === 'asc' ? 'desc' : 'asc';
  };
  var box = unigrid.getBox();
  if (typeof column === 'function') {
    box = column(box, order);
  } else {
    var nOrder = order || 'new:asc';
    var _box = box;
    var bColumn = _box.column;
    var bOrder = _box.order;

    var isNew = !bColumn || bColumn !== column;
    bColumn = isNew ? column : bColumn;

    switch (nOrder) {
      case 'alter':
        bOrder = alternate(bOrder);
        break;
      case 'old:alter':
        bOrder = isNew ? bOrder : alternate(bOrder);
        break;
      case 'asc':
        bOrder = 'asc';
        break;
      case 'desc':
        bOrder = 'desc';
        break;
      case 'new:asc':
        bOrder = isNew ? 'asc' : alternate(bOrder);
        break;
      case 'new:desc':
        bOrder = isNew ? 'desc' : alternate(bOrder);
        break;
    }

    box = Object.assign({}, box, { column: bColumn, order: bOrder });
  }
  unigrid.setBox(box);
};

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

var UnigridEmptyCell = function (_React$Component) {
  _inherits(UnigridEmptyCell, _React$Component);

  function UnigridEmptyCell() {
    _classCallCheck(this, UnigridEmptyCell);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridEmptyCell).apply(this, arguments));
  }

  _createClass(UnigridEmptyCell, [{
    key: 'render',
    value: function render() {
      var cleaned = cleanCellProps(this.props);
      var Tx = this.props.rowAs === "header" ? 'th' : 'td';
      return React.createElement(Tx, cleaned);
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
    key: 'render',
    value: function render() {
      var p = this.props;
      var cleaned = cleanCellProps(p);
      var Tx = p.rowAs === "header" ? 'th' : 'td';
      return React.createElement(
        Tx,
        cleaned,
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
    key: 'render',
    value: function render() {
      var p = this.props;
      var cleaned = cleanCellProps(p);
      var Tx = p.rowAs === "header" ? 'th' : 'td';
      return React.createElement(
        Tx,
        cleaned,
        p.cell.toString()
      );
    }
  }]);

  return UnigridNumberCell;
}(React.Component);

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

var UnigridRow = function (_React$Component) {
  _inherits(UnigridRow, _React$Component);

  function UnigridRow() {
    _classCallCheck(this, UnigridRow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridRow).apply(this, arguments));
  }

  _createClass(UnigridRow, [{
    key: 'mkProps',
    value: function mkProps(oCell, item, rowAs, mixIn, addProp) {
      var cell = undefined;
      var props = Object.assign({}, addProp, mixIn);

      // create a shallow copy to avoid mutating props
      if (typeof oCell === 'object') {
        Object.assign(props, oCell);
      } else {
        cell = oCell;
      }

      if (cell !== undefined) {
        Object.assign(props, { show: cell });
      }
      if (!isDefined(props, 'item') && item !== undefined) {
        Object.assign(props, { item: item });
      }
      if (!isDefined(props, 'rowAs') && rowAs !== undefined) {
        Object.assign(props, { rowAs: rowAs });
      }
      return props;
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

      if (isDefined(this.props, 'cellTypes') && isDefined(this.props.cellTypes, type)) {
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

      // 'undefined' type
      return React.createElement(UnigridTextCell, _extends({}, nProps, { cell: "Error: " + JSON.stringify(oProps) }));
    }
  }, {
    key: 'getCell',
    value: function getCell(cell, item, rowAs, mixIn, addProp) {
      if (cell === null) {
        var props = this.mkProps(undefined, item, rowAs, mixIn, addProp);
        return ['empty', tryAmend(props, item, 'cell', 'cell')];
      }

      var cellProps = this.mkProps(cell, item, rowAs, mixIn, addProp);

      if (!isDefined(cellProps, 'cell') && isDefined(cellProps, 'show')) {
        Object.assign(cellProps, { cell: applyFormatter(cellProps) });
      }

      cellProps = tryAmend(cellProps, item, 'cell', 'cell');

      if (isDefined(cellProps, 'as')) {
        return [cellProps.as, cellProps];
      }

      return [typeof cellProps.cell, cellProps];
    }
  }, {
    key: 'createAndProcessCell',
    value: function createAndProcessCell(cell, item, rowAs, mixIn, addProp) {
      var _getCell = this.getCell(cell, item, rowAs, mixIn, addProp);

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
      var addProp = isDefined(cfg, 'treeAmend') ? { treeAmend: cfg.treeAmend } : undefined;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          arr.push(this.createAndProcessCell(i, cfg.item, cfg.rowAs, cfgMixIn, addProp));
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

      var amend = cfg.amend;
      var treeAmend = cfg.treeAmend;
      var cells = cfg.cells;
      var rowAs = cfg.rowAs;
      var mixIn = cfg.mixIn;
      var item = cfg.item;
      var cellTypes = cfg.cellTypes;
      var $do = cfg.$do;

      var nProps = _objectWithoutProperties(cfg, ['amend', 'treeAmend', 'cells', 'rowAs', 'mixIn', 'item', 'cellTypes', '$do']);

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

  _createClass(Unigrid, null, [{
    key: 'cleanProps',
    value: function cleanProps(props) {
      var amend = props.amend;
      var treeAmend = props.treeAmend;
      var condition = props.condition;
      var fromProperty = props.fromProperty;
      var process = props.process;
      var select = props.select;
      var section = props.section;
      var cells = props.cells;
      var rowAs = props.rowAs;
      var mixIn = props.mixIn;
      var $do = props.$do;

      var other = _objectWithoutProperties(props, ['amend', 'treeAmend', 'condition', 'fromProperty', 'process', 'select', 'section', 'cells', 'rowAs', 'mixIn', '$do']);

      return other;
    }
  }]);

  function Unigrid(props) {
    _classCallCheck(this, Unigrid);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Unigrid).call(this, props));

    _this5.state = isDefined(_this5.props, 'box') ? _this5.props.box : undefined;
    return _this5;
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
      var it = _defineProperty({}, Symbol.iterator, function () {
        return makeIterator(data, select);
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
    key: 'addRows',
    value: function addRows(acc, cfg, data, item) {
      function prepAmend(iCfg, iItem, expr) {
        if (isDefined(iCfg, expr)) {
          var _aCfg = tryAmend(iCfg, iItem, expr);
          if (isDefined(_aCfg, expr)) {
            return _aCfg;
          }
        }
        return false;
      }

      var aCfg = prepAmend(cfg, item, 'condition');
      if (aCfg) {
        if (this.shouldSkip(aCfg.condition, item)) return;
      }

      aCfg = prepAmend(cfg, item, 'fromProperty');
      if (aCfg) {
        var _aCfg2 = aCfg;
        var condition = _aCfg2.condition;
        var fromProperty = _aCfg2.fromProperty;

        var nCfg = _objectWithoutProperties(_aCfg2, ['condition', 'fromProperty']);

        this.addChildren(acc, nCfg, item[aCfg.fromProperty], undefined);
        return;
      }

      aCfg = prepAmend(cfg, item, 'process');
      if (aCfg) {
        var _aCfg3 = aCfg;
        var _condition = _aCfg3.condition;
        var _fromProperty = _aCfg3.fromProperty;
        var process = _aCfg3.process;

        var _nCfg = _objectWithoutProperties(_aCfg3, ['condition', 'fromProperty', 'process']);

        this.addChildren(acc, _nCfg, aCfg.process(data, this.state), undefined);
        return;
      }

      aCfg = prepAmend(cfg, item, 'select');
      if (aCfg) {
        var _aCfg4 = aCfg;
        var _condition2 = _aCfg4.condition;
        var _fromProperty2 = _aCfg4.fromProperty;
        var _process = _aCfg4.process;
        var select = _aCfg4.select;

        var _nCfg2 = _objectWithoutProperties(_aCfg4, ['condition', 'fromProperty', 'process', 'select']);

        this.executeSelect(acc, aCfg.select, _nCfg2, data);
        return;
      }

      aCfg = prepAmend(cfg, item, 'section');
      if (aCfg) {
        var _aCfg5 = aCfg;
        var _condition3 = _aCfg5.condition;
        var _fromProperty3 = _aCfg5.fromProperty;
        var _process2 = _aCfg5.process;
        var _select = _aCfg5.select;
        var section = _aCfg5.section;

        var _nCfg3 = _objectWithoutProperties(_aCfg5, ['condition', 'fromProperty', 'process', 'select', 'section']);

        acc.push(this.createSection(aCfg.section, _nCfg3, data, item));
        return;
      }

      aCfg = prepAmend(cfg, item, 'cells');
      if (aCfg) {
        var _aCfg6 = aCfg;
        var _condition4 = _aCfg6.condition;
        var _fromProperty4 = _aCfg6.fromProperty;
        var _process3 = _aCfg6.process;
        var _select2 = _aCfg6.select;
        var _section = _aCfg6.section;

        var _nCfg4 = _objectWithoutProperties(_aCfg6, ['condition', 'fromProperty', 'process', 'select', 'section']);

        var cTypes = this.props.cellTypes;
        acc.push(React.createElement(UnigridRow, _extends({}, _nCfg4, { item: item, cellTypes: cTypes })));
      }

      aCfg = prepAmend(cfg, item, '$do');
      if (aCfg) {
        var addProp = isDefined(aCfg, 'treeAmend') ? { treeAmend: aCfg.treeAmend } : undefined;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = aCfg.$do[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var i = _step2.value;

            var _nCfg5 = addProp ? Object.assign({}, addProp, i) : i;
            this.addChildren(acc, _nCfg5, data, item);
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
      }
    }
  }, {
    key: 'shouldSkip',
    value: function shouldSkip(condition, item) {
      if (isDefined(condition, 'ifDoes')) {
        if (condition.ifDoes === 'exist') {
          if (isDefined(condition, 'property')) {
            if (!isDefined(item, condition.property)) {
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
      var props = Unigrid.cleanProps(cfg);
      Object.assign(props, { children: children });
      return React.createElement(getComponent(section), props);
    }
  }, {
    key: 'getBox',
    value: function getBox() {
      return this.state || this.props.box || {};
    }
  }, {
    key: 'setBox',
    value: function setBox(box) {
      this.setState(box);
    }
  }, {
    key: 'render',
    value: function render() {
      var table = this.props.table;
      var children = table ? this.createChildren(table, this.props.data, undefined) : this.props.children;
      var props = table ? Unigrid.cleanProps(table) : {};
      return React.createElement('table', props, children);
    }
  }]);

  return Unigrid;
}(React.Component);

exports.Unigrid = Unigrid;
exports.UnigridRow = UnigridRow;
exports.isDefined = isDefined;
exports.cleanCellProps = cleanCellProps;
exports.makeIterator = makeIterator;
exports.applyFormatter = applyFormatter;
exports.tryAmend = tryAmend;
exports.getSorter = getSorter;
exports.sort = sort;
exports.UnigridEmptyCell = UnigridEmptyCell;
exports.UnigridTextCell = UnigridTextCell;
exports.UnigridNumberCell = UnigridNumberCell;
//# sourceMappingURL=unigrid.js.map