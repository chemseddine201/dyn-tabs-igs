import actions from './actions.js';
import helper from '../helper';
export default function reducer(state, action) {
  switch (action.type) {
    case actions.close: {
      var newTabsOrders = "";
      const {openTabIDs: arr, draftTabs, tabsOrders} = state,
      removedItemIndex = arr.indexOf(action.tabId);
      if (removedItemIndex >= 0) {
        //remove id
        const newArr = arr.slice();
        newArr.splice(removedItemIndex, 1);
        //remove tab if saved
        if (draftTabs && draftTabs[action.tabId]) {
          delete draftTabs[action.tabId];
        }
        if (tabsOrders && tabsOrders.length) {
          let arr = tabsOrders.split(',');
          arr = arr.filter(ele => ele !== action.tabId);
          newTabsOrders = arr.join(',');
        }
        //return updated state state
        return {...state, openTabIDs: newArr, draftTabs, tabsOrders: newTabsOrders};
      }
      return state;
    }
    case actions.open: {
      const arr = state.openTabIDs,
        tabId = action.tabId;
      if (arr.indexOf(tabId) === -1) {
        const newArr = arr.slice();
        newArr.push(tabId);
        return {...state, openTabIDs: newArr};
      }
      return state;
    }
    case actions.refresh:
      return helper.getCopyState(state);
    case actions.active: {
      const tabId = action.tabId;
      if (state.selectedTabID !== tabId) {
        return {...state, selectedTabID: tabId};
      }
      return state;
    }
    case actions.sort: {
      const arr = state.openTabIDs,
        newArr = action.tabId,
        newArrCount = newArr.length;
      if (arr.length !== newArrCount) return state;
      for (let i = 0; i < newArrCount; i++) {
        if (arr.indexOf(newArr[i]) === -1) return state;
      }
      return {...state, openTabIDs: newArr};
    }
    case actions.save: {
      const { data } = action;
      if(!data || !data.id) return state;
      const id = parseInt(data.id, 10);
      let { values } = data;
      let oldData = state.draftTabs;
      if (oldData) {
        oldData[id] = {
          ...oldData[id],
          ...values
        };
      } else {
        oldData = {};
        oldData[id] = values;
      }
      //
      return {...state, draftTabs: oldData};
    }
    case actions.remove: {
      const { tabId } = action;
      if (draftTabs && draftTabs[tabId]) {
        delete draftTabs[tabId];
      }
      if (tabsOrders && tabsOrders.length) {
        let arr = tabsOrders.split(',');
        arr = arr.filter(ele => ele !== tabId);
        newTabsOrders = arr.join(',');
      }
      return {...state, openTabIDs: newArr, draftTabs, tabsOrders: newTabsOrders};
    }
    case actions.rename: {
      const { data } = action;
      const id = parseInt(data.id, 10);
      let oldData = state.draftTabs ? state.draftTabs : {};
      oldData[id] = {
        tabTitle: data.title
      };
      return {...state, draftTabs: oldData};
    }
    case actions.reorder: {
      const { tabsOrders } = action;
      return {...state, tabsOrders: tabsOrders};
    }

    default:
      throw new Error(`Undefined action type '${action.type}'`);
  }
}
