---
date: 2024-04-23
---

## Vitepress部署

```javascript
import mediumZoom from "medium-zoom";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // ...
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
};

export default theme;
```