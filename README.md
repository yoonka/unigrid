# Unigrid

Easily create HTML tables of arbitrary complexity. Define tables using a simple configuration-based domain-specific language. Implement more complex table components by creating table definitions dynamically and rendering them with Unigrid.

Functionally Unigrid is a renderer which renders a grid of cells grouped into sections and rows. Being a React component it will re-render only what's necessary when the table changes.

## API

The Unigrid component consumes the following properties:

* **data** -- Either an array or an object. Contains the element(s) to show in the table.

* **table** -- An object. The actual definition of the table. Contains instructions how to generate the table and how to present the element(s) contained in the data property.

* **cellTypes** - An array. Contains a mapping of cell types to React components implementing those types.

Example:

    <Unigrid data={this.myJson}
             table={this.myTable}
             cellTypes={myCellTypes} />

## Expressions

The table definition is essentially a tree of objects, where each object may contain an array of other objects. Each object is an expression which defines:

*  how to interpret object expressions in the contained array
*  how to present items from the data property
*  both of the above

The table definition tree represents nested lists of the input data. Unigrid traverses the table definition to read and interpret the expressions. Then based on those interpretations it reads the input data and maps it to the output flat structure of the resulting HTML table.

When interpreting an object expression results in creating a new part of the resulting HTML table, that part is created using a dedicated React component and properties of the object expression are passed to that component as its _props_.

Therefore, each object contained in the table definition tree can have properties of the following types:
*  **retained** - read by Unigrid and passed to the resulting React component
*  **consumed** - read by Unigrid but not passed to the resulting React component
*  **read** - contained only in object expressions that don't create any React components. They would be only read and interpreted by Unigrid.
*  **native** - neither read nor understood by Unigrid. All properties not recognized by Unigrid are automatically passed to the resulting React component. If an object expression doesn't create any React component, properties not recognized by Unigrid are ignored.

## Context

Before Unigrid starts traversing the definition tree it creates an object with two properties:

* **list** (array) - contains the current list.
* **item** (object) - contains the current item.

The context is initialized with the _data_ property passed to Unigrid: if that data is an array then it's stored as _list_ in the context, if it's an object then it's stored as _item_ in the context. In either case the other context property is initialized to _null_.

Unigrid traverses the definition tree recursively updating the context object according to the interpretations of visited object expressions (instructions).

## Interpretations

The **root object** of the table definition tree - creates the _table_ html element. Properties:
  * **show** (consumed) - array of object expressions.
  * **Section** - creates a table header _thead_, body _tbody_, or footer _tfoot_. A table can contain zero or one header, followed by zero or many body sections (also called segments), followed by zero or one footer. Properties:
  * **section** (consumed) - string, one of "header", "body" or "footer". Uses React components UnigridHeader, UnigridSegment, or UnigridFooter to create _thead_, _tbody_, or _tfoot_ HTML elements respectively.
  * **show** (consumed) - array of object expressions.

* **Select** - uses the provided select pattern to select items from _list_ in the context object. For each such item it stores it in the context and then interprets each object expression contained in the _show_ array using the new context. Properties:
  * **select** (consumed) - a pattern of any type, depending on implementation. Currently supported patterns are:
    * "any" (string) - iterates through all items contained in _list_ in the context.
    * a number - interpreted as index of an item to select from _list_ in the context.
  * **show** (consumed) - array of object expressions.

* **Select-from** - Similar to **Select** but  stores the _list_ with the name provided by the _from_ property in the context before executing the select on that list. Properties:
   * **fromProperty** (consumed) - name of the property that contains an array. That array is stored as _list_ in the context before executing the _select_ expression.
   * **select** (consumed) - see **Select** above.
   * **show** (consumed) - see **Select** above.
   * **Cells** - creates a table row according to cell definition in the expression object and using data from the _item_ property of the context. Properties:
   * **cells** (consumed) - array of cell definitions - see **Cells** section below.
   * **rowAs** (retained) - type of the row. Can be any string, which is then passed as _rowAs_ to the cell. A special type _header_ is recognized by Unigrid cells - when specified it causes the cell the render as _th_ instead of _td_.
   * **mixIn** (consumed) - an object that will be mixed-in to each cell when constructing cells of the given row.

## Cells

Each single cell in a row is defined using either a string or an object:

  * **string** - name of the property in the current _item_ in the context. Unigrid reads the value of that property and depending on its type renders one of the default cell types (see section **Types** below).

  * **object** - the cell definition. Properties defined in that object and not consumed by Unigrid are passed as props to the React component that implements a particular cell type. Properties:
    * **show** - similar to defining the cell with a string only - name of the property in the current _item_ in the context. Unigrid reads the value of that property and depending on its type renders one of the default cell types (see section **Types** below).
    * **as** - explicitly state the type of the cell. The type is mapped to the React component rendering that particular type in the _cellTypes_ property passed to Unigrid.
    * **using** - explicitly state the React component that should be used to render the cell.
    * **bindToCell** - a string or an array of strings that represent names of functions (props of the given cell) that should be bound to the React component cell when called (e.g. 'onClick').

There are three types automatically supported by Unigrid:

  * **string** - values of type _string_ will be implemented using **UnigridTextCell** unless overridden in the _cellTypes_ map.
  * **number** - values of type _number_ will be implemented using **UnigridNumberCell** unless overridden in the _cellTypes_ map.
  * **empty** - a special type that renders empty tag, either _td_ or _th_ (_th_ if the row is of type _header_).

There are two special properties which may be available in the React component implementing the cell:

* **item** - The _item_ property of the context object, contains the item from the input data that is to be shown in the current row.
* **cell** - The value of the property of the _item_ object in the context specified in the cell definition as a _string_ or _show_ property of the object that defines the cell.

## Usage
```sh
git clone https://github.com/yoonka/unigrid.git
cd unigrid
sudo npm install -g jspm
npm install
jspm install
```

on Windows the last line would probably be (if `node_modules\.bin` isn't in `PATH`):

    node_modules\.bin\jspm install

Then to view the examples:
```sh
npm start
```
And navigate to [http://localhost:9000/examples/unigrid.html](http://localhost:9000/examples/unigrid.html)

For npm there is a pre-compiled _cjs_ version created with command:

    jspm build src/Unigrid.js unigrid.js --externals react --format cjs

or

    npm run jspm_build

Then simply include Unigrid in your _package.json_ and import:

    import {Unigrid, UnigridEmptyCell, UnigridTextCell} from 'unigrid';
