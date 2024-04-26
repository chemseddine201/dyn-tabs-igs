const helper = {
  checkArrIndex: (index, arrLength) => index >= 0 && index < arrLength,
  getInstance: function (Fn) {
    new (Function.prototype.bind.apply(Fn, arguments))();
  },
  resolve: (result) => Promise.resolve(result),
  getCopyState: function (state) {
    return {
      selectedTabID: state.selectedTabID,
      openTabIDs: (state.openTabIDs || []).slice(),
      draftTabs: (state.draftTabs || {}),
      name: `${state.name}`,
      tabsOrders: (state.tabsOrders || []).slice(),
      lsMaxLifeTime: state.lsMaxLifeTime,
    };
  },
  assingAll: function (targetObj, ...sourcObjs) {
    // copy all enumerable and not enumerable properties into the target
    sourcObjs.forEach((sourcObj) => {
      const enum_only = Object.keys(sourcObj);
      Object.getOwnPropertyNames(sourcObj).forEach((prop) => {
        if (enum_only.indexOf(prop) >= 0) targetObj[prop] = sourcObj[prop];
        else
          Object.defineProperty(targetObj, prop, {
            value: sourcObj[prop],
            writable: true,
          });
      });
    });
    return targetObj;
  },
  setNoneEnumProps: function (obj, props) {
    const noneEnum = {};
    Object.keys(props).forEach((prop) => {
      noneEnum[prop] = {
        writable: true,
        value: props[prop],
      };
    });
    return Object.defineProperties(obj, noneEnum);
  },
  getArraysDiff: function (arr1, arr2) {
    const arr1Copy = [...arr1],
      arr2Copy = [...arr2];
    arr1.forEach((item) => {
      if (arr2.indexOf(item) >= 0) {
        arr1Copy.splice(arr1Copy.indexOf(item), 1);
        arr2Copy.splice(arr2Copy.indexOf(item), 1);
      }
    });
    return [arr1Copy, arr2Copy];
  },
  filterArrayUntilFirstValue: (arr, callback, isRightToLeft) => {
    isRightToLeft && arr.reverse();
    for (let i = 0, l = arr.length; i < l; i++) {
      if (callback(arr[i], i, arr)) return arr[i];
    }
    return null;
  },
  throwMissingParam: (FnName) => {
    throw new Error(`Missing parameter in "${FnName}" function`);
  },
  thorwInvalidParam: (FnName) => {
    throw new Error(`Invalid parameter values passed to ${FnName} function`);
  },
  isObj: (obj) => Object.prototype.toString.call(obj) === '[object Object]',
  isArray: (arr) => typeof arr === 'object' && arr.constructor === Array,
  unsetExpiryElements: (obj = {}, time = Date.now().getTime()) => { 
    Object.keys(obj).forEach((key) => {
      if (obj[key] && obj[key].lsExpiry && obj[key].lsExpiry < time) {
        delete obj[key];
      }
    });
    return obj;
    //return Object.values(obj).filter(e => e.lsExpiry > time);
  },
  generateId : (tablist, maxNum) => {
    /*if (tablist && tablist.length < maxNum-1)  {
      return parseInt(tablist.at(-1))+1+'';
    }*/
    let missing = [];
    for (var i = 1; i <= maxNum; i++) {
      if (tablist.indexOf(i+'') == -1) {
        missing.push(i);
      }
    }
    return missing[0];
   },
   getSavedTabs: (storageKey, name) => {
    const nowTime = new Date().getTime();
    const ls = helper.getObjectFromLocal(storageKey);
    if (ls) {
      const savedTabs = ls[name];
      if (helper.isObj(savedTabs)) {
        let draftTabs = savedTabs.draftTabs;
        if (draftTabs && helper.isObj(draftTabs)) {
          draftTabs = helper.unsetExpiryElements(draftTabs, nowTime);
        }
        return draftTabs
      }
    }
    return {};
  },
  getSelectedTab: (storageKey, name) => {
    const ls = helper.getObjectFromLocal(storageKey);
    if (ls) {
      const savedTabs = ls[name];
      if (helper.isObj(savedTabs)) return savedTabs.selectedTabID;
    }
    return '';
  },
  getSavedTabsOrders: (storageKey, name) => {
    const ls = helper.getObjectFromLocal(storageKey);
    if (ls) {
      const savedTabs = ls[name];
      if (helper.isObj(savedTabs)) {
        return ((typeof savedTabs.tabsOrders) == 'string') ? savedTabs.tabsOrders : '';
      } 
    }
    return '';
  },
  //new functions
  saveObjectToLocal: (storageKey, object) => {
    try {
      const serializedObject = JSON.stringify(object, helper.replacer);
      localStorage.setItem(storageKey, serializedObject);
    } catch (error) {
      console.error(`Error saving object:`, error);
    }
  },
  
   getObjectFromLocal: (storageKey) => {
    try {
      const serializedObject = localStorage.getItem(storageKey);
      if (serializedObject === null) {
        return null;
      }
      return JSON.parse(serializedObject, helper.reviver);
    } catch (error) {
      console.error(`Error retrieving object:`, error);
      return null;
    }
  },
  
  replacer: (key, value) => {
    if (value instanceof File) {
      // Handle File objects
      return {
        __type: 'file',
        name: value.name,
        type: value.type,
        lastModified: value.lastModified
      };
    } else if (value instanceof Image) {
      // Handle Image objects
      return {
        __type: 'image',
        src: value.src
      };
    }
    // Return other values as is
    return value;
  },
  reviver:(key, value) => {
    if (value && typeof value === 'object' && '__type' in value) {
      if (value.__type === 'file') {
        // Restore File object
        return new File([], value.name, { type: value.type, lastModified: value.lastModified });
      } else if (value.__type === 'image') {
        // Restore Image object
        const img = new Image();
        img.src = value.src;
        return img;
      }
    }
    // Return other values as is
    return value;
  }
};
export default helper;
