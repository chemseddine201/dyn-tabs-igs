import TabList from '../tabList/tabList.js';
import PanelList from '../panelList/panelList.js';

import reducer from '../utils/stateManagement/reducer.js';
import Api from '../utils/api/api.js';
import useDynTabs from './useDynamicTabs.js';
//
import {ApiContext, StateContext, ForceUpdateContext} from '../utils/context.js';
import Modal from '../modal/modal.js';

const getDeps = function () {
  const getApiInstance = (options) => {
    return new Api({options});
  };
  return {reducer, getApiInstance, PanelList, TabList, Modal, ApiContext, StateContext, ForceUpdateContext};
};
export default useDynTabs.bind(null, getDeps);
