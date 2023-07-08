## Eslint plugin

This eslint plugin adds 2 additional rules:  
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


Your eslint config file should look something like this:
``` js
module.exports = {
   plugins: ['@guusje4525'],
   rules: {
      '@guusje4525/mui-import-checker': 'warn',
      '@guusje4525/no-inline-functions-in-jsx': 'warn',
   },
}
```
