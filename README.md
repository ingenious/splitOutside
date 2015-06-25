# splitOutside
<blockquote><strong>A swiss-army-knife attribute and text parser and evaluator</strong></blockquote>

## splitOutside method API

### Split a string with ignoring delimiting string in quotes

```
 	SO.splitOutside('3,4,"one, two","more text comma free"', ',', null)

	// using String object extension
 
	'3,4,"one, two","more text comma free"'.splitOutside(',', null)
 
 	// returns [3, 4, "test, part", "unseen hole"]
 
 ```              
 
### Split a string with ignoring delimiting string in (),{},[]

```

	SO.splitOutside('3,4,(one, two),more text bracket free', ',');
	
	// returns ["3", "4", "(one, two)", "more text bracket free"]
	
	SO.splitOutside('3,4,[one, two],more text bracket free', ',');
	
	// returns ["3", "4", "[one, two]", "more text bracket free"]
    
    SO.splitOutside('3,4,{one, two},more text bracket free', ',')
    
    // returns ["3", "4", "{one, two}", "more text bracket free"]
            
 ```

###Interpret an array between delimiters

```
	SO.splitOutside("3,4,[one, two, 4, 5],more text",',',null);
   
    // returns [3,4,["one","two",4,5],"more text"]
                     
	
	
```               
### Interpret attributes and methods from a passed context 

```

	SO.splitOutside("3, 4, [test, part], more text",',',{
		test:'world', 
		part:42
	});
	
	\\ returns [3,4,["world",42],"more text"]

```
## parseExpression

### Evaluate simple arithmetic expressions

```
	SO.parseExpression('4 * (5 - 6)');
	
	\\ returns -4
```

### Evaluate methods

```
	SO.parseExpression('Math.floor(3.9)', null);
	// returns 3

```
### Evaluate simple boolean expressions

```

	SO.parseExpression('2 < 5');
	// returns true

	SO.parseExpression('Math.floor(1.9)>2');
	// returns false

	SO.parseExpression('(true && false) && (true || false)');
	// false
	
```

### Evaluate simple objects

```
	SO.parseExpression('{a:Math.round(8.95),b:{c:hello}}', null);
	
	// returns {"a":9,"b":{"c":"hello"}}

```


### Evaluate attributes and methods of a passed context

```
	SO.parseExpression('a/b()', {
		a:14,
		b:function(){
			return 7;
		}
	 });
	
	// returns 2

```         
