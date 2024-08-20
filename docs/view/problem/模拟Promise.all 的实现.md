---
date: 2024-05-06
---

# 模拟Promise.all 的实现

```javascript
function isPromise(x) {
    if ((typeof x == 'object' && x !== null) || typeof x == 'function') {
        if (typeof x.then == 'function') {
            return true;
        }
    }
    return false;
}

let obj = {
    axios: function (params) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(params);
            }, 300);
        });
    },

    all: function (newArr) {
        return new Promise((resolve, reject) => {
            let results = [];
            let completed = 0;

            newArr.forEach((item, index) => {
                if (isPromise(item)) {
                    item.then(res => {
                        results[index] = res;
                        completed++;

                        if (completed === newArr.length) {
                            resolve(results);
                        }
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    results[index] = item;
                    completed++;

                    if (completed === newArr.length) {
                        resolve(results);
                    }
                }
            });
        });
    },
};

let b = [1, obj.axios(2), 3]; // 数组中包含了一个普通值和两个 Promise
obj.all(b).then(res => {
    console.log(res); // 输出所有请求的结果数组
}).catch(err => {
    console.error(err); // 处理错误
});

```
