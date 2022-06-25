import React from 'react';
const DefaultOptions = function (DefaulTabInnerComponent = null) {
  this.defaultDirection = 'ltr';
  this._DefaulTabInnerComponent = DefaulTabInnerComponent;
  this.directionsRange = ['ltr', 'rtl'];
};
Object.assign(DefaultOptions.prototype, {
  getOptions: function () {
    return this._getOptions();
  },
  _getOptions: function () {
    const _options = {
      name: undefined,
      useStorage: true,
      storageKey: undefined,
      tabs: [],
      selectedTabID: '',
      beforeSelect: function () {
        return true;
      },
      beforeClose: function () {
        return true;
      },
      onOpen: function () {},
      onClose: function () {},
      onFirstSelect: function () {},
      onSelect: function () {},
      onChange: function () {},
      onLoad: function () {},
      onDestroy: function () {},
      onInit: function () {},
      onSave: function () {},
      onTabRename: function () {},
      accessibility: true,
      isVertical: false,
      defaultPanelComponent: function defaultPanelComponent() {
        return <div></div>;
      },
      sortable: true,
      sortableOptions: {},
      defaultTabsName:"New Tab",
      maxTabsLength: 10,
      newTab: {
        closable: true,
        renamable: true,
        selected: true,
        panelComponent: (props) => <p> my custome panel {props.id} </p>,
      },
      initialValues: {},
    };
    let _direction = this.defaultDirection,
      _tabComponent = this._DefaulTabInnerComponent;
    const that = this;
    Object.defineProperties(_options, {
      direction: {
        get() {
          return _direction;
        },
        set(value) {
          if (that.directionsRange.indexOf(value) === -1)
            throw 'Invalid direction value! it can be eather of "ltr" or "rtl" ';
          _direction = value;
        },
        enumerable: true,
      },
      tabComponent: {
        get() {
          return _tabComponent;
        },
        set(fn) {
          if (fn && typeof fn !== 'function') throw 'tabComponent property must be type of a function.';
          _tabComponent = fn ? fn : that._DefaulTabInnerComponent;
        },
        enumerable: true,
      },
    });
    return _options;
  },
});
export default DefaultOptions;
