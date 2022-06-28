import React, {memo, useEffect } from 'react';
import Sortable from 'sortablejs';
//import { ReactSortable } from "react-sortablejs";
import {ApiContext, StateContext} from '../utils/context.js';
import helper from '../utils/helper.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';

const TabList = memo(
  function TabList(props) {
    const state = React.useContext(StateContext),
    {openTabIDs, selectedTabID} = state,
      api = React.useContext(ApiContext),
      tablistProps = tablistPropsManager({api}),
      hasNewTab = (((typeof (api.getOption('newTab').panelComponent)) !== 'undefined') && ((typeof api.getOption('newTab')) !== 'undefined'));
      useEffect(() => {
        if (api && api.getOption('sortable')) {
          var el = document.getElementById('dyn-tabs-sortable');
          const sk = api.getOption('storageKey');
          const name = api.getOption('name');
          //
          var sortable = Sortable.create(el, {
            draggable: ".rc-dyn-tabs-tab[role='tab']",
            filter: ".igored-tab",
            //group: `${sk}-orders`,
            store: {
              get: function (sortable) {
                var tabsOrders = [];
                var ls = localStorage.getItem(sk);
                if (ls) {
                  var savedData = JSON.parse(ls);
                  if (savedData[name]) {
                    tabsOrders = savedData[name].tabsOrders;
                    return tabsOrders ? tabsOrders.split(',') : [];
                  }
                }
                return tabsOrders;
              },
              set: function (sortable) {
                var tabsOrders = sortable.toArray();
                var ls = localStorage.getItem(sk);
                if (ls) {
                  var savedData = JSON.parse(ls);
                  savedData[name].tabsOrders = tabsOrders.join(',');
                  localStorage.setItem(sk, JSON.stringify(savedData));
                  //save tabs orders on state
                  api.reorder(tabsOrders.join(','));
                }
              }
            },
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
          (<>
          <li 
            className="rc-dyn-tabs-tab cursor-pointer igored-tab"
            onClick={() => {
              let newId = helper.generateId(openTabIDs, api.getOption('maxTabsLength'));
              let newTab = api.getOption('newTab');
              let defaultName = api.getOption('defaultName');
              //
              api.open({
                ...newTab,
                id: `${newId}`,
                title: defaultName ? `${defaultName}` : `New Tab`,
              })
              .then(() => {
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
          </>) : null
        }
      </ul>
    );
  },
  () => true,
);
export default TabList;
