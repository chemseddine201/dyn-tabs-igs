import actions from './actions';
import helper from '../helper';

export default function reducer(state, action) {
  switch (action.type) {
    case actions.close: {
      const {tabId} = action;
      const {openTabIDs: tabsIds, draftTabs, tabsOrders} = state;
      if (tabsIds?.length === 1) {//reset only if length is 1
        let oldData = draftTabs || {};
        oldData[tabId] = {};
        return {...state, draftTabs: oldData};
      }
      //remove tab
      const newTabsIdsArr = tabsIds;
      if (draftTabs && draftTabs[tabId]) {
        delete draftTabs[tabId];
        newTabsIdsArr = newTabsIdsArr.filter(id => id != tabId);
      }
      //
      let newTabsOrders = tabsOrders;
      if (tabsOrders && tabsOrders.length) {
        let arrTabsOrders = tabsOrders?.split(',')?.filter(ele => ele != tabId);
        newTabsOrders = arrTabsOrders?.join(',');
      }
      //return updated state
      return {
        ...state, 
        openTabIDs: newTabsIdsArr, 
        draftTabs, 
        tabsOrders: newTabsOrders 
      };
    }
    case actions.open: {
      const arr = state.openTabIDs,
        tabId = action.tabId;
      if (arr.indexOf(tabId) === -1) {
        let newArr = arr.slice();
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
      let oldData = state.draftTabs || {};
      if (oldData && helper.isObj(oldData) && values && Object.keys(values).length > 0) {
        values.lsExpiry = new Date().getTime() + state.lsMaxLifeTime;
        oldData[id] = {
          ...oldData[id],
          ...values
        };
      } else {
        values = {};
        values.lsExpiry = new Date().getTime() - 18000000;
        oldData[id] = values;
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
      const { draftTabs, tabsOrders, openTabIDs} = state;
      let newArr = openTabIDs;
      if (draftTabs && draftTabs[tabId]) {
        delete draftTabs[tabId];
        newArr = openTabIDs.filter(id => tabId !== id);
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
      if(oldData && oldData[id]) {
        oldData[id].tabTitle = data.title;
      } else {
        oldData[id] = {
          tabTitle: data.title
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
