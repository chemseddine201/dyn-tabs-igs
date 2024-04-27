import actions from './actions';
import helper from '../helper';

export default function reducer(state, action) {
  switch (action.type) {
    case actions.close: {
      const { tabId } = action;
      
      if (!Number.isInteger(tabId)) return state;

      var newTabsOrders = "";
      let newArr = [];
      const {openTabIDs: arr = [], draftTabs, tabsOrders} = state,
      removedItemIndex = arr.indexOf(tabId);
      if (removedItemIndex >= 0) {
        //remove id
        newArr = arr.slice();
        newArr.splice(removedItemIndex, 1);
        //remove tab if saved
        if (draftTabs && typeof draftTabs === 'object' && draftTabs[tabId]) {
          delete draftTabs[tabId];
        }
        if (tabsOrders && (typeof tabsOrders === 'string') && tabsOrders.length) {
          let arr = tabsOrders.split(',');
          arr = arr.filter(ele => ele !== tabId);
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
      const { id, values } = action;
      if (!Number.isInteger(+id) || typeof values !== 'object') {
        return state;
      }

      let oldData = state.draftTabs || {};
      if (oldData && helper.isObj(oldData) && values && Object.keys(values).length > 0) {
        values.lsExpiry = new Date().getTime() + state.lsMaxLifeTime;
        oldData[id] = values;//replace with data values this part could used to handle reset with save function
      } else {
        values.lsExpiry = new Date().getTime() - 18000000;
        oldData[id] = {};
      }
      //
      return {...state, draftTabs: oldData};
    }
    case actions.reset: {
      const { tabId } = action;
      let oldData = state.draftTabs || {};
      oldData[tabId] = {};
      return {...state, draftTabs: oldData};
    }
    case actions.remove: {
      const { tabId } = action;
      const { draftTabs, tabsOrders} = state;
      if (draftTabs && draftTabs[tabId]) {
        delete draftTabs[tabId];
      }
      if (tabsOrders && (typeof tabsOrders === 'string') && tabsOrders.length) {
        let arr = tabsOrders.split(',');
        arr = arr.filter(ele => ele !== tabId);
        newTabsOrders = arr.join(',');
      }
      return {...state, draftTabs, tabsOrders: newTabsOrders};
    }
    case actions.rename: {
      const { id, title } = action;
      if(!Number.isInteger(+id) || typeof title !== 'string' || (title.length < 2) ) {
        return state;
      }
      let oldData = state.draftTabs ? state.draftTabs : {};
      if(oldData && oldData[id]) {
        oldData[id].tabTitle = title;
      } else {
        oldData[id] = {
          tabTitle: title
        };
      }
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
