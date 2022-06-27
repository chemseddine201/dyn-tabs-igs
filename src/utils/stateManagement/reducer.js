import actions from './actions.js';
import helper from '../helper';
export default function reducer(state, action) {
  switch (action.type) {
    case actions.close: {
      const {openTabIDs: arr, draftTabs} = state,
      removedItemIndex = arr.indexOf(action.tabId);
      if (removedItemIndex >= 0) {
        //remove id
        const newArr = arr.slice();
        newArr.splice(removedItemIndex, 1);
        //remove tab if saved
        if (draftTabs[state.name] && draftTabs[state.name][action.tabId]){
          delete draftTabs[state.name][action.tabId];
        }
        //return updated state state
        return {...state, openTabIDs: newArr, draftTabs};
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
      let oldData = state.draftTabs;
      if(oldData[state.name] && oldData[state.name]){
        oldData[state.name][id] = data.values;
      } else {
        oldData[state.name] = {};
        oldData[state.name][id] = data.values;
      }
      //
      return {...state, draftTabs: oldData};
    }
    case actions.rename: {
      const { data } = action;
      const id = parseInt(data.id, 10);
      let oldData = state.draftTabs;
      if (oldData[state.name] && oldData[state.name][id]) {
        oldData[state.name][id].title = data.title;
      }
      return {...state, draftTabs: oldData};
    }
    default:
      throw new Error(`Undefined action type '${action.type}'`);
  }
}
