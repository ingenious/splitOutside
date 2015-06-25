# splitOutside
<blockquote><strong>A swiss-army-knife attribute and text parser and evaluator</strong></blockquote>

## splitOutside method API

### Split a string while ignoring delimiting string in quotes

```
 SO.splitOutside("3,4,'test, part',unseen hole",',',{})
// returns [3,4,'test,part', 'unseen hole']

 ```
// using String object extension

 "3,4,'test, part',unseen hole".splitOutside(',', {})

 // returns [3,4,'test,part', 'unseen hole']
 ```              