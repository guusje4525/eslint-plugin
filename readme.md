## Eslint plugin

This eslint plugin adds 4 additional rules:  
### Check for wrong mui imports. In @mui/material or @mui/icons-material you should not use named imports. More info [here](https://mui.com/material-ui/guides/minimizing-bundle-size/)  

Wrong:
``` ts
import { Box } from "@mui/material"
```
Correct:
``` ts
import Box from "@mui/material/Box"
```

### No inline functions in JSX are allowed. All logic should exists elsewhere, like a store.

Wrong:
``` ts
const myComponent = <div>
    <button onClick={() => console.log('button was clicked')}>my button</button>
</div>
```
Correct:
``` ts
const store = ....
const myComponent = <div>
    <button onClick={store.buttonClickHandler}>my button</button>
</div>
```

### A map in JSX should contain a key
Wrong:
``` ts
const myComponent = <div>
    {
        myArray.map(item => <h1>Hello, I am item</h1>)
    }
</div>
```
Correct:
``` ts
const myComponent = <div>
    {
        myArray.map(item => <h1 key={item.id}>Hello, I am item</h1>)
    }
</div>
```

### Every .go() query in electrodb should contain the parameter 'pages'

Wrong:
``` ts
await MyEntity.query.client({} as any).go()
```
Correct:
``` ts
await MyEntity.query.client({} as any).go({ pages: 'all' })
```

### Use correct store name (mobx)

Wrong:
``` ts
const store = useAuthStore()
const store = useStore(sp => new AuthStore(sp))
```
Correct:
``` ts
const authStore = useAuthStore()
const authStore = useStore(sp => new AuthStore(sp))
```

Your eslint config file should look something like this:
``` js
module.exports = {
   plugins: ['@guusje4525'],
   rules: {
      '@guusje4525/mui-import-checker': 'warn',
      '@guusje4525/no-inline-functions-in-jsx': 'warn',
      '@guusje4525/jsx-key': 'warn',
      '@guusje4525/go-method-should-have-pages': 'warn'
   },
}
```
