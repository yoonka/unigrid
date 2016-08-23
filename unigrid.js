'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

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
    key: "render",
    value: function render() {
      var span = this.props.colspan || 1;
      return this.props.as === "header" ? span === 1 ? React.createElement("th", null) : React.createElement("th", { colSpan: span }) : span === 1 ? React.createElement("td", null) : React.createElement("td", { colSpan: span });
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
      return this.props.as === "header" ? React.createElement(
        "th",
        null,
        this.props.value
      ) : React.createElement(
        "td",
        null,
        this.props.value
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
      return this.props.as === "header" ? React.createElement(
        "th",
        null,
        this.props.value.toString()
      ) : React.createElement(
        "td",
        null,
        this.props.value.toString()
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
    key: 'createCellForType',
    value: function createCellForType(value, as) {
      switch (typeof value) {
        case "string":
          return React.createElement(UnigridTextCell, { value: value, as: as });
        case "number":
          return React.createElement(UnigridNumberCell, { value: value, as: as });
      }
      var err = "Error: " + JSON.stringify(value);
      return React.createElement(UnigridTextCell, { value: err, as: as });
    }
  }, {
    key: 'createCell',
    value: function createCell(cell, item, as) {
      if (typeof cell === "string") {
        if (item.hasOwnProperty(cell)) {
          return this.createCellForType(item[cell], as);
        }
        return React.createElement(UnigridTextCell, { value: "Error: " + cell, as: as });
      }
      if (cell === null) {
        return React.createElement(UnigridEmptyCell, { as: as });
      }
      if (typeof cell !== "object") {
        return React.createElement(UnigridTextCell, { value: "Error: " + cell.toString(), as: as });
      }
      if (cell.hasOwnProperty("colspan")) {
        return React.createElement(UnigridEmptyCell, { colspan: cell.colspan, as: as });
      }
      if (!cell.hasOwnProperty("property")) {
        var _err = "Error: " + JSON.stringify(cell);
        return React.createElement(UnigridTextCell, { value: _err, as: as });
      }
      if (cell.hasOwnProperty("using")) {
        var props = { value: item[cell.property], as: as };
        return React.createElement(cell.using, props);
      }
      if (cell.hasOwnProperty("as")) {
        var elem = this.props.cellTypes[cell.as];
        var _props = { value: item[cell.property], as: as };
        return React.createElement(elem, _props);
      }
      var err = "Error: " + JSON.stringify(cell);
      return React.createElement(UnigridTextCell, { value: err, as: as });
    }
  }, {
    key: 'render',
    value: function render() {
      var cfg = this.props.definition;
      var cells = cfg.cells || [];
      var arr = [];
      for (var i = 0; i < cells.length; i++) {
        arr.push(this.createCell(cells[i], this.props.item, cfg.as));
      }
      return React.createElement(
        'tr',
        null,
        arr
      );
    }
  }]);

  return UnigridRow;
}(React.Component);

var UnigridHeader = function (_React$Component) {
  _inherits(UnigridHeader, _React$Component);

  function UnigridHeader() {
    _classCallCheck(this, UnigridHeader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridHeader).apply(this, arguments));
  }

  _createClass(UnigridHeader, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'thead',
        null,
        this.props.children
      );
    }
  }]);

  return UnigridHeader;
}(React.Component);

var UnigridSegment = function (_React$Component2) {
  _inherits(UnigridSegment, _React$Component2);

  function UnigridSegment() {
    _classCallCheck(this, UnigridSegment);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridSegment).apply(this, arguments));
  }

  _createClass(UnigridSegment, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'tbody',
        null,
        this.props.children
      );
    }
  }]);

  return UnigridSegment;
}(React.Component);

var UnigridFooter = function (_React$Component3) {
  _inherits(UnigridFooter, _React$Component3);

  function UnigridFooter() {
    _classCallCheck(this, UnigridFooter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridFooter).apply(this, arguments));
  }

  _createClass(UnigridFooter, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'tfoot',
        null,
        this.props.children
      );
    }
  }]);

  return UnigridFooter;
}(React.Component);

var Unigrid = function (_React$Component4) {
  _inherits(Unigrid, _React$Component4);

  function Unigrid() {
    _classCallCheck(this, Unigrid);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Unigrid).apply(this, arguments));
  }

  _createClass(Unigrid, [{
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
    key: 'makeStringIterator',
    value: function makeStringIterator(data, select) {
      if (select === "all") {
        return this.makeAllIterator(data);
      }
    }
  }, {
    key: 'makeIterator',
    value: function makeIterator(data, select) {
      switch (typeof select) {
        case "number":
          return this.makeNumberIterator(data, select);
        case "string":
          return this.makeStringIterator(data, select);
      }
    }
  }, {
    key: 'executeSelect',
    value: function executeSelect(select, cfg, ctx, acc) {
      var _this5 = this;

      var it = _defineProperty({}, Symbol.iterator, function () {
        return _this5.makeIterator(ctx.list, select);
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = it[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          var newCtx = { list: ctx.list, item: i };
          this.addRows(acc, cfg, newCtx);
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
    key: 'shouldSkip',
    value: function shouldSkip(condition, item) {
      if (condition.hasOwnProperty("ifDoes")) {
        if (condition.ifDoes === "exist") {
          if (condition.hasOwnProperty("property")) {
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
    value: function createSection(section, children) {
      switch (section) {
        case "header":
          return React.createElement(UnigridHeader, { children: children });
        case "body":
          return React.createElement(UnigridSegment, { children: children });
        case "footer":
          return React.createElement(UnigridFooter, { children: children });
      }
    }
  }, {
    key: 'addRows',
    value: function addRows(acc, cfg, ctx) {
      for (var i = 0; i < cfg.length; i++) {
        var c = cfg[i];

        if (c.hasOwnProperty("condition")) {
          if (this.shouldSkip(c.condition, ctx.item)) continue;
        }

        if (c.hasOwnProperty("section")) {
          var children = this.createTable(c.show, ctx);
          acc.push(this.createSection(c.section, children));
        } else if (c.hasOwnProperty("select")) {
          var newCtx = c.hasOwnProperty("from") ? { list: ctx.item[c.from], item: ctx.item } : ctx;
          this.executeSelect(c.select, c.show, newCtx, acc);
        } else if (c.hasOwnProperty("cells")) {
          acc.push(React.createElement(UnigridRow, { definition: c, item: ctx.item,
            cellTypes: this.props.cellTypes }));
        }
      }
    }
  }, {
    key: 'createTable',
    value: function createTable(cfg, ctx) {
      var acc = [];
      this.addRows(acc, cfg, ctx);
      return acc;
    }
  }, {
    key: 'render',
    value: function render() {
      console.log(this.props);

      var ctx = { list: this.props.data, item: null };
      return React.createElement(
        'table',
        null,
        this.createTable(this.props.table, ctx)
      );
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