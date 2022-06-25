function Tabs({initialTabs=[], draftTabs={}, ...props}) {
  this._data = [];
  console.log(draftTabs)
  if (initialTabs && initialTabs.constructor === Array && initialTabs.length) {
    initialTabs.forEach((tab) => {
      console.log(tab)
      console.log(draftTabs[tab['id']])
      tab['title'] = draftTabs[tab['id']] || tab['title'];
      this._addTab(tab);
    });
  }
}

Object.assign(Tabs.prototype, {
  _addTab: function (tabObj) {
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
