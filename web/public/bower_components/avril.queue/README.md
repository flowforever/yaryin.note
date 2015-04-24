#avril.queue
avril.queue is an async flow control tool, it tries to ease the pain of callback. 

It's pretty simple to use. Let's rock.

##install avril.queue

```
npm install avril.queue
```

for now avril.queue only support node env, I would try to make it support the browsers later.

```
/*
assume that we have a file "the/path/of/file.txt"
the file content is :
1
2
3
*/
```

###  func, $await , $each
    
```js
var avQ = require('avril.queue');
var q = avQ();
     
/* return $AwaitData object */
var $fileContent = q.$await(fs.readFile, 'the/path/of/file.txt'
, function(err, fileContent){
  this.error(err);
  return fileContent;
});

/* conver the $awaitData' result , return a new $AwaitData object */
var $ids = $fileContent.conver(function($org){
  return $org.result().split('\n');
}); 

/*  return $AwaitData object which result is list of */
var $users = q.$each(db.User.findById, $ids, function(err, user){
  this.error(err);
  return user;
}); 

q.func(function(){
  console.log( $fileContent.result() )
  console.log( $users.realResult() );
});
```
	
###$$await &  $$each

```js
var avQ = require('avril.queue');
var q = avQ();

/* return $AwaitData object */
var $fileContent = q.$$await(fs.readFile, 'the/path/of/file.txt'); 

/* conver the $awaitData' result , return a new $AwaitData object */
var $ids = $fileContent.conver(function($org){
  return $org.result().split('\n');
}); 

/*  return $AwaitData object which result is list of */
var $users = q.$$each(db.User.findById, $ids); 

q.func(function(){
   console.log( $fileContent.result() )
   console.log( $users.realResult() );
});
```

###use $await, $each, with context

```js
var avQ = require('avril.queue');
var q = avQ();
   
/* return $AwaitData object */
var $fileContent = q.$await(fs, fs.readFile, 'the/path/of/file.txt'
, function(err, fileContent){
  this.error(err);
  return fileContent;
});

/* conver the $awaitData' result , return a new $AwaitData object */
var $ids = $fileContent.conver(function($org){
  return $org.result().split('\n');
}); 

/*  return $AwaitData object which result is list of */
var $users = q.$each(db.User, db.User.findById, $ids, function(err, user){
	this.error(err);
	
	/* use this.$$await instead of q.$$await
	* use this.$$wait, the queue will wait the asynCall ready then go to next step
	* use q.$$wait only append current asynCall to the end of the queue, it's not what we want
	*/
	user.blogs = this.$$await(db.Blogs, db.Blogs.findByUserId, user.id);
    
    return user;
}); 

q.func(function(){
   console.log( $fileContent.result() )
   console.log( $users.realResult() );
});
```

###use q.$if($awaitData, trueFunc).$else(falseFunc) 

```js
var avQ = require('avril.queue');
var q = avQ();
var filePath = 'the/path/of/file.txt';
var $fileExisted = q.$await(fs.exists, filePath);
var $fileContent;
q.$if($fileExited, function(){
	/* use this.$$await instead of q.$$await
	* use this.$$wait, the queue will wait the asynCall ready then go to next step
	* use q.$$wait only append current asynCall to the end of the queue, it's not what we want
	*/
	$fileContent = this.$$await(fs.readFile, filePath); 
})
q.func(function(){
	if($fileContent){
		console.log($fileContent.result());
	}
});

var otherPath = 'the/path/of/otherFile.txt';

q.$if($fileContent, function(){
	$fileContent = this.$$await(fs.readFile, filePath);
}).$elseIf(q.$await(fs.exits, otherPath), function() {
	$fileContent = this.$$await(fs.readFile, otherPath);
});

q.func(function(){
	if($fileContent){
		console.log($fileContent.result());
	}
})

```
