import React, {memo, useEffect } from 'react';
import Sortable from 'sortablejs';
//import { ReactSortable } from "react-sortablejs";
import {ApiContext, StateContext} from '../utils/context.js';
import helper from '../utils/helper.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
//TODO: generate new id on add and on delete
// save sortable state
// make globale state for tabs and saved tabs

const TabList = memo(
  function TabList(props) {
    const state = React.useContext(StateContext),
    {openTabIDs, selectedTabID, draftTabs} = state,
      api = React.useContext(ApiContext),
      tablistProps = tablistPropsManager({api}),
      hasNewTab = (((typeof (api.getOption('newTab').panelComponent)) !== 'undefined') && ((typeof api.getOption('newTab')) !== 'undefined'));
      //console.log({openTabIDs, selectedTabID, trashedTabs})
      //const st = useSelector(state => state.tablist);
      //
      useEffect(() => {
        if (api && api.getOption('sortable')) {
          var el = document.getElementById('dyn-tabs-sortable');
          var sortable = Sortable.create(el, {
            handle: ".rc-dyn-tabs-tab[role='tab']",
            ...api.getOption('sortable'),
          });
        }
      }, []);

    return (
      <ul id="dyn-tabs-sortable" {...tablistProps}>
        {
        openTabIDs.map((id) => (
            <Tab key={id} id={id} selectedTabID={selectedTabID} />
        ))
        }
        {
          (
          (openTabIDs.length < api.getOption('maxTabsLength')) && hasNewTab
          ) ? 
          (<><li 
            className="rc-dyn-tabs-tab cursor-pointer"
            onClick={() => {
              let newId = helper.generateId(openTabIDs, api.getOption('maxTabsLength'));
              let newTab = api.getOption('newTab');
              //let PanelItem = newTab.panelComponent;
              let defaultName = api.getOption('defaultName');
              //
              api.open({
                id: `${newId}`,
                title: defaultName ? `${defaultName}` : `New Tab`,
                //panelComponent: (props) => <Fragment key={newId}>{cloneElement(<PanelItem />, { ...props, tabId: `${newId}` })}</Fragment>,
                ...newTab,
              })
              .then(() => {
                //select the new added tab
                api.select(`${newId}`);
                api.refresh();
              })
              .catch(e => alert(e))
            }}
          >
            <div className="rc-dyn-tabs-title add-btn">
              <div className="plus"></div>
              </div>
          </li>
          <li style={{padding:"10px", cursor:"pointer"}} onClick={() => {
              api.save({
                name: selectedTabID
              });
              api.refresh();
            }}>
              SAVE
          </li></>) : null
        }
      </ul>
    );
  },
  () => true,
);
export default TabList;
