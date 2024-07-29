---
name: 鹤鸣
title: emoji
date: 2024-07-29
---

# emoji 插件 V-Emoji-Picker

npm 链接地址 <https://www.npmjs.com/package/v-emoji-picker>

vue3版本 <https://www.npmjs.com/package/vue3-emoji-picker?activeTab=explore>

```bash
yarn add v-emoji-picker

or

npm install v-emoji-picker
```

### 使用

```js
<VEmojiPicker v-show="showDialog"   :style="{ width: '100%', height: '200' }" labelSearch="Search"   lang="pt-BR"  @select="selectEmoji"><VEmojiPicker>


// 引入组件
import { VEmojiPicker } from 'v-emoji-picker'
 
components: {
    VEmojiPicker
  },



// 方法
 // 将v-emoji-picker中选择的表情添加到评论内容中
    selectEmoji(emoji) {
      this.newComment.content += emoji.data;
      console.log(emoji)
    },
```

### Props

```js
{
  @Prop({ default: () => [] }) customEmojis!: IEmoji[];
  @Prop({ default: () => [] }) customCategories!: ICategory[];
  @Prop({ default: 15 }) limitFrequently!: number;
  @Prop({ default: 5 }) emojisByRow!: number;
  @Prop({ default: false }) continuousList!: boolean;
  @Prop({ default: 32 }) emojiSize!: number;
  @Prop({ default: true }) emojiWithBorder!: boolean;
  @Prop({ default: true }) showSearch!: boolean;
  @Prop({ default: true }) showCategories!: boolean;
  @Prop({ default: false }) dark!: boolean;
  @Prop({ default: "Peoples" }) initialCategory!: string;
  @Prop({ default: () => [] as ICategory[] }) exceptCategories!: ICategory[];
  @Prop({ default: () => [] as Emoji[] }) exceptEmojis!: IEmoji[];
  @Prop({}) i18n!: Object;
}
```

### Events

```js
{
  select: 'Emit event on Selected Emoji',
  changeCategory: 'Emit event on Change Category'
}
```

### Using custom Emojis

Array of items with Interface IEmoji

```js
interface IEmoji {
  data: string;
  category: string;
  aliases: string[];
}
```

### Using custom Categories

Array of items with Interface ICategory

```js
interface ICategory {
  name: string;
  icon: string;
}
```
