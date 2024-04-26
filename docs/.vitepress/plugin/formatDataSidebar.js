import { set_sidebar } from "./auto-gen-sidebar.mjs";

export default function formatDataSidebar(arr) {
  let mySidebar;
  arr.forEach((item) => {
    let data = set_sidebar(item.link);
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
  });

  return mySidebar;
}
