import React from "react";
import './react-dyn-tabs.css';
import './react-dyn-tabs-card.css';
import useDynamicTabs from '../index';

const TabsExample = () => {
    const options = {
        name: "example",
        useStorage: true,
        //storageKey: "example",
        defaultPanelComponent: {
          closable: true,
          renamable: true,
          panelComponent: (porps) => <p> panel 1 </p>,
        },
        tabs: [
          {
            id: '1',
            title: 'tab 1',
            closable: true,
            renamable: true,
            panelComponent: (porps) => <p> panel 1 </p>,
          },
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