# splitOutside
<blockquote><strong>A swiss-army-knife attribute and text parser and evaluator</strong></blockquote>

### splitOutside method API

#### Split a string with ignoring delimiting string in quotes

```
 	SO.splitOutside('3,4,"one, two","more text comma free"', ',', null)

	// using String object extension
 
	'3,4,"one, two","more text comma free"'.splitOutside(',', null)
 
 	// returns [3, 4, "test, part", "unseen hole"]
 
 ```              
 
#### Split a string with ignoring delimiting string in (),{},[]

```

	SO.splitOutside('3,4,(one, two),more text bracket free', ',');
	
	// returns ["3", "4", "(one, two)", "more text bracket free"]
	
	SO.splitOutside('3,4,[one, two],more text bracket free', ',');
	
	// returns ["3", "4", "[one, two]", "more text bracket free"]
    
    SO.splitOutside('3,4,{one, two},more text bracket free', ',')
    
    // returns ["3", "4", "{one, two}", "more text bracket free"]
            
 ```

#### Interpret an array between delimiters

```
	SO.splitOutside("3,4,[one, two, 4, 5],more text",',',null);
   
    // returns [3,4,["one","two",4,5],"more text"]
                     
	
	
```               
#### Interpret attributes and methods from a passed context 

```

	SO.splitOutside("3, 4, [test, part], more text",',',{
		test:'world', 
		part:42
	});
	
	\\ returns [3,4,["world",42],"more text"]

```
### parseExpression

#### Evaluate simple arithmetic expressions

```
	SO.parseExpression('4 * (5 - 6)');
	
	\\ returns -4
```

#### Evaluate methods

```
	SO.parseExpression('Math.floor(3.9)', null);
	// returns 3

```
#### Evaluate simple boolean expressions

```

	SO.parseExpression('2 < 5');
	// returns true

	SO.parseExpression('Math.floor(1.9)>2');
	// returns false

	SO.parseExpression('(true && false) && (true || false)');
	// false
	
```

#### Evaluate simple objects

```
	SO.parseExpression('{a:Math.round(8.95),b:{c:hello}}', null);
	
	// returns {"a":9,"b":{"c":"hello"}}

```


#### Evaluate attributes and methods of a passed context

```
	SO.parseExpression('a/b()', {
		a:14,
		b:function(){
			return 7;
		}
	 });
	
	// returns 2

```         

### Test Suite


```

Unit Tests
    ✓ should be an Object with two methods
    splitOutside method
      ✓ should throw error if not applied to string
      ✓ .splitOutside() should return array
      ✓ should return array with original string if `delimiting_string` is not a string
    parseExpression method
      ✓ should throw error if not applied to string
      ✓ .parseExpression() should return boolean if expression resolves to boolean
      ✓ .parseExpression() should return number if expression resolves to number
      ✓ .parseExpression() should return array if expression resolves to array
      ✓ .parseExpression() should return object if expression resolves to object
      ✓ .parseExpression() should return null if expression resolves to null
      ✓ .parseExpression() should return a function if expression resolves to a function
      ✓ .parseExpression() should return a string if expression resolves to a string

Functional tests
    splitOutside method
      ✓ should split a string with ignoring delimiting string in quotes
      ✓ should split a string with ignoring delimiting string in (),{},[]
      ✓ should interpret an array [test,part] between delimiters
      ✓ should interpret attributes and methods from a passed context between delimiters
    parseExpression method
      ✓ should evaluate simple arithmetic expressions
      ✓ should evaluate simple boolean expressions
      ✓ should evaluate methods
      ✓ should evaluate simple objects
      ✓ should evaluate attributes and methods of a passed context

  

```