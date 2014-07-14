## Motivation

Often when using promises, variable scoping becomes an issue, specifically when doing an operation that requires something along the lines of "load two things in the database, then do something based on that".

There are a few ways to solve this problem:

1. Stay in callback hell

    ```javascript
    LoadItemOne().then(function(item1) {
    	return LoadItemTwo().then(function(item2) {
    		return DoSomethingWithItems(item1, item2);
    	});
    });
    ```

2. Enter variable scoping hell

    ```javascript
    var item1;
    LoadItemOne().then(function(i) {
        item1 = i;
        return LoadItemTwo();
    }).then(function(item2) {
    	return DoSomethingWithItems(item1, item2);
    });
    ```

3. Return ugly objects

    ```javascript
    LoadItemOne().then(function(item2) {
        return LoadItemTwo().then(function(item2) {
            return { item1: item1, item2: item2 }
        });
    }).then(function(items) {
    	return DoSomethingWithItems(items.item1, items.item2);
    });
    ```

This library provides a solution. Context is stored in a variable called `$`. To add the result of a promise to the context, call `$('key')`. In this case:

```javascript
var $ = require('promise-accum');

LoadItemOne().then($('item1')).then(function($) {
    return LoadItemTwo().then($('item2'));
}).then(function($) {
	return DoSomethingWithItems($.item1, $.item2);
});
```

## Error handling

Using this solution, the context object must be passed through the entire chain: 

```javascript
LoadItemOne().then($('item1')).then(function($) {
    $.item1.foo = 'bar';
}).then(function($) {
    // $ is not the context, obviously.
});
```

In most cases, it's as simple as returning `$` in the promise. However, in some promise libraries (q and bluebird, among others), errors can be handled by calling `.catch(errorHandler)`. This is effectively an alias for `.then(null, errorHandler)` – of course, in this case, the context does not get passed through, so any functions after the error handler it.

To mitigate this, promise-accum provides `$.passthrough`:

```javascript
LoadItemOne().then($('item1')).then($.passthrough, errorHandler).then(function($) {
    // $ is maintained.
});
```

