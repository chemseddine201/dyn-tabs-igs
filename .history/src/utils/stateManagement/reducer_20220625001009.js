import actions from './actions.js';
import helper from '../helper';
export default function reducer(state, action) {
  switch (action.type) {
    case actions.close: {
      const status = confirm('Are you sure to close this tab?');
      if (status) {
        const {openTabIDs: arr} = state,
        removedItemIndex = arr.indexOf(action.tabId);
        if (removedItemIndex >= 0) {
          const newArr = arr.slice();
          newArr.splice(removedItemIndex, 1);
          return {selectedTabID: state.selectedTabID, openTabIDs: newArr};
        }
      }
      return state;
    }
    case actions.open: {
      console.log(action);
      const arr = state.openTabIDs,
        tabId = action.tabId;
      if (arr.indexOf(tabId) === -1) {
        const newArr = arr.slice();
        newArr.push(tabId);
        return {selectedTabID: state.selectedTabID, openTabIDs: newArr};
      }
      return state;
    }
    case actions.refresh:
      return helper.getCopyState(state);
    case actions.active: {
      const tabId = action.tabId;
      if (state.selectedTabID !== tabId) return {selectedTabID: tabId, openTabIDs: state.openTabIDs};
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
      return {selectedTabID: state.selectedTabID, openTabIDs: newArr};
    }
    case actions.save: {
      const {data} = action;
      const {draftTabs} = state;
      const newDraftTabs = {...draftTabs, data};
      console.log('save', draftTabs, newDraftTabs);
      return {draftTabs: newDraftTabs, openTabIDs: state.openTabIDs, selectedTabID: state.selectedTabID};
    }
    case actions.rename: {
      console.log(state)
      const {data} = action;
      const {draftTabs} = state;
      const newDraftTabs = {...draftTabs, data};
      console.log('new names', newDraftTabs);

      return {draftTabs: newDraftTabs, openTabIDs: state.openTabIDs, selectedTabID: state.selectedTabID};
    }
    default:
      throw new Error(`Undefined action type '${action.type}'`);
  }
}
