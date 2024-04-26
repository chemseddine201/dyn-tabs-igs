import React, { useState } from "react";
import './react-dyn-tabs.css';
import './react-dyn-tabs-card.css';
import useDynamicTabs from '../index';

const Form = ({ api, ...props }) => {
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(undefined);

  return <form onSubmit={e => e.preventDefault()}>
  <label htmlFor="image">IMAGES</label>
  <input 
    type="file" 
    id="image" 
    name="image[]" 
    accept="image/*" 
    onChange={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setImage(e.target.files ? e.target.files[0] : undefined);
    }}
  />
  <div>
    <label htmlFor="anyfile">ANYFILE</label>
    <input 
      type="file" 
      id="anyfile[]" 
      name="anyfile" 
      onChange={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(e.target.files ? e.target.files[0] : undefined);
      }}
    />
  </div>
  <div>
    <button
      onClick={(e) => {
        e.preventDefault();
        api?.save({
          id: props.id,
          values: {
            "name": "chemseddine",
            "age": 32,
            "married": false,
            "salary": 10.22,
            "anyfile": {
              "user": {
                "profile": [{
                  type: "file",
                  path: file
                }]
              }
            },
            "image": [{
              type: "picture",
              path: image
            }],
          }
        });
      }}>Save in local</button>
  </div>
  <img src={"data:image/png;base64,"+api?.getData()?.draftTabs[props.id]?.image?.content} alt="image" width={100} height={100} style={{border: 1}} />
</form>
}

const TabsExample = () => {
  var apiInstance;
  
  const options = {
    name: "example",
    useStorage: true,
    storageKey: "example-draft",
    newTab: {
      closable: true,
      renamable: true,
      selected: true,
      panelComponent: (props) => <Form api={apiInstance} {...props} />,
    },
    tabs: [
      {
        id: "1",
        title: "Tab 1",
        closable: true,
        renamable: true,
        selected: true,
        panelComponent: (props) => <Form api={apiInstance} {...props} />,
      }
    ],
    selectedTabID: '1',
  };

  const [TabList, PanelList, ready] = useDynamicTabs(options);

  ready((instance) => {
    apiInstance = instance;
  });

  return (
    <>
      <TabList />
      <PanelList instance={apiInstance} />
    </>
  );
}

export default {
  title: 'TabsExample',
  component: TabsExample,
};

export const IgsTabs = () => <TabsExample></TabsExample>;