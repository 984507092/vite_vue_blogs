import { set_sidebar } from "./auto-gen-sidebar.mjs";

/**
 * 格式化侧边栏数据
 * @param {Array} arr 侧边栏数据
 * @param {Boolean} style 是否需要样式二
 * @returns {Object} 格式化后的侧边栏数据
 */
export default function formatDataSidebar(arr, style = false) {
  let mySidebar;
  arr.forEach((item) => {
    let data = set_sidebar(item.link);
    if (Array.isArray(data.items) && data.items.length > 0) {
      data.items.forEach((key) => {
        if (key.items && typeof key.items === 'object') {
          // 格式一
          let s1 = {
            base: key.items.base,
            items: [
              {
                text: key.text,
                collapsible: key.collapsible,
                items: key.items.items
              }
            ]
          }
          // 格式二
          let s2 = [{
            base: key.items.base,
            items: [
              {
                text: key.text,
                collapsible: key.collapsible,
                items: key.items.items
              }
            ]
          }]
          mySidebar = {
            ...mySidebar,
            [key.items.base]: !style ? s1 : s2
          }
        } else {
          mySidebar = {
            ...mySidebar,
            [data.base]: {
              base: data.base,
              items: [
                {
                  text: item.text,
                  items: data.items,
                },
              ],
            },
          };
        }
      })
    } else {
      mySidebar = {
        ...mySidebar,
        ...data
      };
    }

  });

  return mySidebar;
}
