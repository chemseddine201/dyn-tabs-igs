import React, {memo} from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
import TabPropsManager from './tabPropsManager.js';
import PropTypes from 'prop-types';
const TabComponent = function TabComponent(props) {
  React.useContext(ForceUpdateContext);
  const {id, selectedTabID} = props,
    api = React.useContext(ApiContext),
    TabInnerComponent = api.getOption('tabComponent'),
    tabObj = api.getTab(id),
    propsManager = new TabPropsManager({api, id, isSelected: selectedTabID === id}),
    clkHandler = function (e) {
      api.eventHandlerFactory({e, id});
    };

  const TabTitle = ({tabObj, ...props}) => {
    return <div style={{
      width:"100%",
      minHeight:"100%",
      display: "flex",
      justifyContent: "center"
    }}
    onDoubleClick={(e)=> {
      if (tabObj.renamable) {
        e.target.setAttribute("contenteditable", true)
      }
    }} 
    onBlur={(e)=>{
      if (tabObj.renamable) {
        e.target.setAttribute("contenteditable", false);
        let tabName = (e.target.innerText.length < 3 ? api.getOption('defaultTabsName') : e.target.innerText);
        if (e.target.innerText.length < 3) {
          e.target.innerText = tabName;
        }
        //trigger tab rename event
        api.rename({
          tabId: tabObj.id, 
          name: tabName
        });
      }
    }}
    onKeyDown={(e)=> {
      var key = e.which || e.keyCode || e.charCode;
      if(key == 13 || key == 46 || e.target.innerText.length > 20) {
        e.preventDefault();
        return;
      }
    }}
  >
    {tabObj.title}
  </div>
  }

  return (
    <li      
      {...propsManager.getTabProps()}
      onClick={(e) => {
        clkHandler(e);
      }}>
          <TabInnerComponent {...propsManager.getTabInnerProps()}>
            <TabTitle tabObj={tabObj} />
          </TabInnerComponent>
          {tabObj.closable ? <span {...propsManager.getCloseIconProps()}>&times;</span> : null}
    </li>
  );
};
TabComponent.propTypes /* remove-proptypes */ = {
  id: PropTypes.string,
  selectedTabID: PropTypes.string
};
const Tab = memo(TabComponent, (oldProps, newProps) => {
  const {id, selectedTabID: oldActiveId} = oldProps,
    {selectedTabID: newActiveId} = newProps;
  return oldActiveId === newActiveId || (id !== oldActiveId && id !== newActiveId);
});
export default Tab;
