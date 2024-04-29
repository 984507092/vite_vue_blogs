# keyof 及 in 的概念及用法

## keyof: 取interface的键后保存为联合类型

```ts
interface userInfo {
  name: string
  age: number
}
type keyofValue = keyof userInfo
// keyofValue = "name" | "age"
```

## in: 取联合类型的值，主要用于数组和对象的构建

切记不要用于interface, 否则会报错

```ts
type name = 'firstname' | 'lastname'
type TName = {
  [key in name]: string
}
// TName = { firstname: string, lastname: string }
```

用于实际开发，举个例子：

```ts
function getValue(o:object, key: string){
  return o[key]
}
const obj1 = { name: '张三', age: 18 }
const values = getValue(obj1, 'name')
```

这样写丧失了ts的优势：

- 无法确定返回值类型

- 无法对key进行约束

```ts
function getValue<T extends Object,K extends keyof T>(o: T,key: K): T[K] {
  return o[key]
}
const obj1 = { name: '张三', age: 18}
const values = getValue(obj1, 'name')
// 如果第二个参数不是obj1中的参数就会报错
```