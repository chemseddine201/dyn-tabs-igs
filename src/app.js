import 'dyn-tabs-igs/style/react-dyn-tabs.css';
import 'dyn-tabs-igs/themes/react-dyn-tabs-card.css';
import useDynamicTabs from './index';

export default () => {
  const options = {
    tabs: [
      {
        id: '1',
        title: 'tab 1',
        panelComponent: (porps) => <p> panel 1 </p>,
      },
      {
        id: '2',
        title: 'tab 2',
        panelComponent: (porps) => <p> panel 2 </p>,
      },
    ],
    selectedTabID: '1',
  };
  const [TabList, PanelList] = useDynamicTabs(options);
  return (
    <>
      <TabList></TabList>
      <PanelList></PanelList>
    </>
  );
};
