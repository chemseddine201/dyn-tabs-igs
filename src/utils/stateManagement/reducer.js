import actions from './actions';
import helper from '../helper';


function closeTab(state, tabId) {
  var { openTabIDs = [], draftTabs = {}, tabsOrders = '' } = state;

  var removedItemIndex = openTabIDs.indexOf(tabId);
  if (removedItemIndex === -1) {
    return state;
  }

  var newArr = openTabIDs.slice();
  newArr.splice(removedItemIndex, 1);

  if (draftTabs && typeof draftTabs === 'object' && draftTabs[tabId]) {
    delete draftTabs[tabId];
  }

  if (tabsOrders && typeof tabsOrders === 'string' && tabsOrders.length) {
    var arr = tabsOrders.split(',').filter((ele) => ele !== tabId);
    var newTabsOrders = arr.join(',');
    return { ...state, openTabIDs: newArr, draftTabs, tabsOrders: newTabsOrders };
  }

  return { ...state, openTabIDs: newArr, draftTabs };
}

function openTab(state, tabId) {
  var { openTabIDs = [] } = state;
  if (openTabIDs.indexOf(tabId) === -1) {
    var newArr = openTabIDs.slice();
    newArr.push(tabId);
    return { ...state, openTabIDs: newArr };
  }
  return state;
}

function refreshTab(state) {
  return helper.getCopyState(state);
}

function activateTab(state, tabId) {
  var { selectedTabID } = state;
  if (selectedTabID && selectedTabID !== tabId) {
    return { ...state, selectedTabID: tabId };
  }
  return state;
}

function sortTabs(state, { tabId: newArr = [] }) {
  var { openTabIDs = [] } = state;

  if (openTabIDs.length !== newArr.length) {
    return state;
  }

  for (let i = 0; i < newArr.length; i++) {
    if (openTabIDs.indexOf(newArr[i]) === -1) {
      return state;
    }
  }

  return { ...state, openTabIDs: newArr };
}

function saveTab(state, { id = undefined, values = null }) {

  if (!id || typeof values !== 'object') {
    return state;
  }
  var { draftTabs = {}, lsMaxLifeTime } = state;

  if (draftTabs && helper.isObj(draftTabs) && values && Object.keys(values).length > 0) {
    values.lsExpiry = new Date().getTime() + lsMaxLifeTime;
    draftTabs[id] = values;
  } else {
    values.lsExpiry = new Date().getTime() - 18000000;
    draftTabs[id] = {};
  }

  return { ...state, draftTabs };
}

function resetTab(state, tabId) {
  var { draftTabs = {} } = state;
  draftTabs[tabId] = {};
  return {...state, draftTabs: draftTabs};
}

function removeTab(state, tabId) {
  var { draftTabs = {}, tabsOrders = '' } = state;
  var { draftTabs: newDraftTabs, tabsOrders: newTabsOrders } = removeTabHelper(draftTabs, tabsOrders, tabId);
  return { ...state, draftTabs: newDraftTabs, tabsOrders: newTabsOrders };
}

function removeTabHelper(draftTabs, tabsOrders, tabId) {
  if (draftTabs && draftTabs[tabId]) {
    delete draftTabs[tabId];
  }

  if (tabsOrders && typeof tabsOrders === 'string' && tabsOrders.length) {
    var arr = tabsOrders.split(',');
    var newTabsOrders = arr.filter((ele) => ele !== tabId).join(',');
    return { draftTabs, tabsOrders: newTabsOrders };
  }

  return { draftTabs };
}

function renameTab(state, { id, title }) {
  if (!id || typeof title !== 'string' || title.length < 2) {
    return state;
  }

  var draftTabs = state.draftTabs || {};

  if (draftTabs && draftTabs[id]) {
    draftTabs[id].tabTitle = title;
  } else {
    draftTabs[id] = {
      tabTitle: title,
    };
  }

  return { ...state, draftTabs };
}

function reorderTabs(state, tabsOrders) {
  return { ...state, tabsOrders: tabsOrders };
}

export default function reducer(state, action) {
  switch (action.type) {
    case actions.close: {
      return closeTab(state, action.tabId);
    }
    case actions.open: {
      return openTab(state, action.tabId);
    }
    case actions.refresh: {
      return refreshTab(state);
    }
    case actions.active: {
      return activateTab(state, action.tabId);
    }
    case actions.sort: {
      return sortTabs(state, action.data);
    }
    case actions.rename: {
      return renameTab(state, action.data);
    }
    case actions.save: {
      return saveTab(state, action.data);
    }
    case actions.reset: {
      return resetTab(state, action.tabId);
    }
    case actions.remove: {
      return removeTab(state, action.tabId);
    }
    case actions.reorder: {
      return reorderTabs(state, action.tabsOrders);
    }
    default:
      throw new Error(`Undefined action type '${action.type}'`);
  }
}