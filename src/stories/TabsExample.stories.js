import React from "react";
import './react-dyn-tabs.css';
import './react-dyn-tabs-card.css';
import useDynamicTabs from '../index';

const TabsExample = () => {
    const options = {
        name: "example",
        useStorage: true,
        storageKey: "example",
        newTab: {
          closable: true,
          renamable: true,
          selected: true,
          panelComponent: (props) => <p> my custome panel {props.id} </p>,
        },
        tabs: [
          {
            id: "1",
            title: "Tab 1",
            closable: true,
            renamable: true,
            selected: true,
            panelComponent: (props) => <p> my custome panel {props.id} </p>,
          }
        ],
        selectedTabID: '1',
      };
      const [TabList, PanelList] = useDynamicTabs(options);
      return (
        <>
          <TabList />
          <PanelList />
        </>
      );
}

export default {
  title: 'TabsExample',
  component: TabsExample,
};

export const IgsTabs = () => <TabsExample></TabsExample>;