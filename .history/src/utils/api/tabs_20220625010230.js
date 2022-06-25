function Tabs({initialTabs=[], draftTabs={}, ...props}) {
  this._data = [];
  this._draftTabs = {...draftTabs};
  if (initialTabs && initialTabs.constructor === Array && initialTabs.length) {
    initialTabs.forEach((tab) => {
      this._addTab(tab);
    });
  }
}

Object.assign(Tabs.prototype, {
  _addTab: function (tabObj) {
    let state = this._helper.getCopyState(this.state);
    tabObj['title'] = state.draftTabs[tabObj['id']] || `${tabObj.title}`;
    console.log(tabObj['title']);
    this._data.push(tabObj);
    return this;
  },
  _removeTab: function (id) {
    const delIndex = this._data.findIndex((tab) => tab.id === id);
    delIndex >= 0 && this._data.splice(delIndex, 1);
    return this;
  },
  getTab: function (id) {
    return this._data.find((tab) => tab.id === id);
  },
  _setTab: function (id, newData) {
    const _index = this._data.findIndex((tab) => tab.id == id);
    if (_index >= 0) {
      const oldData = this._data[_index];
      newData.id = oldData.id; // id can not be changed.
      Object.assign(this._data[_index], newData);
    }
    return this;
  },
});
export default Tabs;
