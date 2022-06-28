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
      sortableOptions = api.getOption('sortableOptions'),
      hasNewTab = (((typeof (api.getOption('newTab').panelComponent)) !== 'undefined') && ((typeof api.getOption('newTab')) !== 'undefined'));
      useEffect(() => {
        if (api && api.getOption('sortable')) {
          var el = document.getElementById('dyn-tabs-sortable');
          const sk = api.getOption('storageKey');
          const name = api.getOption('name');
          //
          var sortable = Sortable.create(el, {
            draggable: ".rc-dyn-tabs-tab",
            dataIdAttr: 'tab-id',
            group: `${sk}`,
            filter: ".exclude",
            onMove: function(evt) {
              if (sortableOptions && ((typeof sortableOptions.onMove) == 'function')) {
                sortableOptions.onMove(evt);
              }
              return evt.related.className.indexOf('exclude') === -1; //and this
            },
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
                //change add button to last tab
                if(tabsOrders.indexOf("99999") != -1) {
                  tabsOrders.push(tabsOrders.splice(tabsOrders.indexOf("99999"), 1)[0]);
                } else {
                  tabsOrders.push("99999");
                }
                //get local storage
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
            ...sortableOptions,
          });
        }
      }, []);

    return (
      <ul id="dyn-tabs-sortable" {...tablistProps}>
        {
        openTabIDs.map((id) => (<Tab key={id} id={id} selectedTabID={selectedTabID} />))
        }
        {
          ((openTabIDs.length < api.getOption('maxTabsLength')) && hasNewTab) ? 
          (
          <li 
            tab-id="99999"
            className="rc-dyn-tabs-tab cursor-pointer exclude"
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
        ) : null
        }
      </ul>
    );
  },
  () => true,
);
export default TabList;
