import React, {useState, useReducer, useLayoutEffect, useRef} from 'react';
import helper from '../utils/helper';
function useDynamicTabs(getDeps, options = {}) {
  const {reducer, getApiInstance, PanelList, TabList, ApiContext, StateContext, ForceUpdateContext} = getDeps();
  const ref = useRef(null);
  if (ref.current === null)
    ref.current = {api: getApiInstance(options), TabListComponent: null, PanelListComponent: null};
  const {
      current: {api},
    } = ref,
    _ref = ref.current,
    [state, dispatch] = useReducer(reducer, api.optionsManager.initialState),
    [flushState, setFlushState] = useState({});
  api.updateStateRef(state, dispatch).updateFlushState(setFlushState);
  useLayoutEffect(() => {
    const key = (api.optionsManager.options.storageKey?.length ? api.optionsManager.options.storageKey : 'igs-dynamic-tabs');	
    if (api.optionsManager.options.useStorage && true) {
      const name = api.optionsManager.options.name;
      let ls = localStorage.getItem(key);
      let upState = {
        [name]: state
      };
      if (ls) {
        let storageState = JSON.parse(ls);
        if (storageState && (helper.isObj(storageState) || helper.isArray(storageState))) {
          upState = {...storageState, ...upState};
        }
      }
      localStorage.setItem(`${key}`, JSON.stringify(upState));
    } else {
      localStorage.removeItem(`${key}`);
    }
    api.updateState(state);
  }, [state]);
  useLayoutEffect(() => {
    api.trigger('onLoad', api.userProxy);
    return () => {
      api.trigger('onDestroy', api.userProxy);
    };
  }, []);
  useLayoutEffect(() => {
    api.trigger('onInit', api.userProxy);
  });
  useLayoutEffect(() => {
    api.trigger('_onReady', api.userProxy);
  }, []);
  useLayoutEffect(() => {
    const oldState = api.previousState,
      [openedTabIDs, closedTabIDs] = api.helper.getArraysDiff(state.openTabIDs, oldState.openTabIDs),
      isSwitched = oldState.selectedTabID !== state.selectedTabID;
    api.onChange({newState: state, oldState, closedTabIDs, openedTabIDs, isSwitched});
  }, [state]);
  useLayoutEffect(() => {
    api.trigger('_onFlushEffects', api.userProxy, () => {
      return [{currentData: api.getData(), instance: api.userProxy}];
    });
  }, [flushState]);
  if (!_ref.TabListComponent)
    _ref.TabListComponent = function TabListComponent(props = {}) {
      return (
        <ApiContext.Provider value={api}>
          <StateContext.Provider value={api.stateRef}>
            <ForceUpdateContext.Provider value={api.forceUpdateState}>
              <TabList {...props}>props.children</TabList>
            </ForceUpdateContext.Provider>
          </StateContext.Provider>
        </ApiContext.Provider>
      );
    };
  if (!_ref.PanelListCompoent)
    _ref.PanelListCompoent = function PanelListCompoent(props) {
      return (
        <ApiContext.Provider value={api}>
          <StateContext.Provider value={api.stateRef}>
            <ForceUpdateContext.Provider value={api.forceUpdateState}>
              <PanelList {...props}>props.children</PanelList>
            </ForceUpdateContext.Provider>
          </StateContext.Provider>
        </ApiContext.Provider>
      );
    };
  return [_ref.TabListComponent, _ref.PanelListCompoent, api.ready];
}
export default useDynamicTabs;
