window.addEventListener('load', function(event) {

	var fails = 0;
	var failMeddelande;
	var btnKey = document.getElementById('btnKey');
	var pFails = document.getElementById('pFails');
	var pKey = document.getElementById('pKey');
	var hKey = document.getElementById('hKey');
	var key; //key for using API


	let promiseKey = new Promise(function(succeed,fail){

		btnKey.addEventListener('click', function(event){
			
			var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey';
			var ajax = new XMLHttpRequest();
			ajax.open('get', url);
			ajax.onreadystatechange = function() {
				console.log('onreadystatechange',ajax.status, ajax.readyState);
				//output.innerHTML += `readystatechange har inträffat! readyState=${ajax.readyState}, status=${ajax.status} <br />`;
				if( ajax.readyState === 4 && ajax.status === 200 ) {
					succeed(ajax.responseText);
				}
				else if(ajax.status != 200){
					console.log('status: ' + ajax.status + 'readyState: ' + ajax.readyState);
					fail('Attempt to retrieve a key was unsuccessful');
				}
			}
			ajax.send();
		}); //end of btnKey.eventListener
	});//end of promise

		promiseKey.then((responseText)=>{
			var jsonObject = JSON.parse(responseText);
			console.log(jsonObject);
			pKey.innerText += jsonObject.key;
			key = jsonObject.key;
			pKey.style.display = 'block';
			hKey.style.display = 'none';
			btnKey.style.marginTop = '20px';
		}, (failed)=>{
			console.log('failed');
			fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			pKey.innerText = 'Please try again.'
		});

	

	//View books functionality
	var btnView = document.getElementById('btnView');
	var booksResult = document.getElementById('booksResult');
	var errorMessage;
	var errorM = document.getElementById('errorM');
	var errorM2 = document.getElementById('errorM2');
	var nrOfAttemptsVb = 0;
	var erMsgVb = "";

	btnView.addEventListener('click', function(event){
		

		var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=' + key;
		viewBook(url);

	});//end of btnView

	const viewBook = function (urlVb){
		fetch(urlVb)
  			.then((resp) => resp.json())
  			.then(function(data) {
    			console.log(data);
    			console.log(data.status);
    			if (data.status === 'success'){
    				if (data.data.length === 0) {
    					fails = fails + 1;
						pFails.innerText = 'Number of requests that failed: ' + fails;
						errorM.style.display = 'block';
						errorM.innerText = 'Currently, there are no book in the database. Please add a book';

    				} 
    				else {
    					//Here comes books
    					var booksArray = data.data;
    					for (var i = 0; i < booksArray.length; i++) {
    						console.log(booksArray[i]);
    						//var books = document.createElement('p');
    						var bookString = 'Id: ' + booksArray[i].id + ', ' + booksArray[i].title + ', ' + booksArray[i].author;
    						console.log(bookString);
    						//var textNode = document.createTextNode(bookString);
    						//books.appendChild(textNode);
    						//booksResult.appendChild(books);
    						//div element that represents book
    						var divBook = document.createElement('div'); 
    						divBook.className = 'book';
    						booksResult.appendChild(divBook);
    						//P for book ID
    						var paragId = document.createElement('p');
    						paragId.innerText = 'Book Id:  ' + booksArray[i].id;
    						divBook.appendChild(paragId);
    						//P for Title
    						var paragTitle = document.createElement('p');
    						paragTitle.innerText = 'Title:  ' + booksArray[i].title;
    						divBook.appendChild(paragTitle);
    						//P for Author
    						var paragAuthor = document.createElement('p');
    						paragAuthor.innerText = 'Author:  ' + booksArray[i].author;
    						divBook.appendChild(paragAuthor);

    						var paragEnd = document.getElementById('pEndv');
    						paragEnd.style.display = 'block';

    					}
    				}

    			} else if (data.status === 'error'){
    				console.log(data.message);
    				errorMessage = data.message;
    				fails = fails + 1;
					pFails.innerText = 'Number of requests that failed: ' + fails;
					errorM.style.display = 'block';
					errorM.innerText = 'Your request failed. The reason: ' + errorMessage;
					nrOfAttemptsVb = nrOfAttemptsVb + 1;

					errorM.style.display = 'block';
					errorM.innerText = 'The last failure reason: ' + errorMessage;
					errorM2.style.display = 'block';
					errorM2.innerHTML = 'Number of attempts: ' + nrOfAttemptsVb;

					if(nrOfAttemptsVb < 10){
						viewBook(urlVb);
					}

    			}
  		})
  		.catch(function(error) {
    		console.log(error);
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorM.style.display = 'block';
			errorM.innerText = error;

  		});  //end of catch 

	}//end viewBook



	//Add book functionality
	var btnAdd = document.getElementById('btnAdd');
	var errorAddBook = document.getElementById('errorAddBook');
	var errorAddbook2 = document.getElementById('errorAddbook2');
	var addedBooks = document.getElementById('addedBooks');
	var titleAddedBooks = document.getElementById('titleAddedBooks');
	var nrOfAttemptsAb = 0;
	var erMsg = "";
	var ids = [];


	btnAdd.addEventListener('click', function(event){
		var bookTitle = document.getElementById('inputBookTitle').value;
		document.getElementById('inputBookTitle').value = "";
		var bookAuthor = document.getElementById('inputBookAuthor').value;
		document.getElementById('inputBookAuthor').value = "";
		if (bookTitle.length === 0||bookAuthor.length===0) {
			errorMessage = 'Please enter name of a book and an author';
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorAddBook.style.display = 'block';
			errorAddBook.innerText = errorMessage;
		} else {
		var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=' + key + '&title=' + bookTitle + '&author=' + bookAuthor;
		console.log(url);
		//https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=gxUei&title=iii&author=ooo;

		addBook(url, bookTitle, bookAuthor);
		//console.log('after fetch: ' + erMsg + nrOfAttemptsAb);
		

  		} //end of else
	}); //end of btnAdd.eventListener

	const addBook = function (urlAb, title, author) {
		fetch(urlAb)
  			.then((resp) => resp.json())
  			.then(function(data) {
    			console.log(data);
    			console.log(data.status);
    			if (data.status === 'success'){
    				console.log(data.id);
    				//var addedBook = document.createElement('p');
    				var bookString = 'Id: ' + data.id + ', ' + title + ', ' + author;
    				console.log(bookString);
    				titleAddedBooks.style.display = 'block';  //Title
    				//div element that represents book
    				var divBook = document.createElement('div'); 
    				divBook.className = 'book';
    				addedBooks.appendChild(divBook);

    				//P for book ID
    				var paragId = document.createElement('p');
    				paragId.innerText = 'Book Id:  ' + data.id;
    				divBook.appendChild(paragId);
    				//P for Title
    				var paragTitle = document.createElement('p');
    				paragTitle.innerText = 'Title:  ' + title;
    				divBook.appendChild(paragTitle);
    				//P for Author
    				var paragAuthor = document.createElement('p');
    				paragAuthor.innerText = 'Author:  ' + author;
    				divBook.appendChild(paragAuthor);

    				var paragEnd = document.getElementById('pEnd');
    				paragEnd.style.display = 'block';

    				ids.push(data.id);

    				//addedBooks.style.marginBottom = '25';				



    				//var textNode = document.createTextNode(bookString);
    				//addedBook.appendChild(textNode);
    				//addedBooks.appendChild(addedBook);

    			} else if (data.status === 'error'){
    				console.log(data.message);
    				erMsg = data.message;
    				fails = fails + 1;
    				nrOfAttemptsAb = nrOfAttemptsAb + 1;
    				console.log('After fetch' + erMsg + nrOfAttemptsAb);
					pFails.innerText = 'Number of requests that failed: ' + fails;
					errorAddBook.style.display = 'block';
					errorAddBook.innerText = 'The last failure reason: ' + erMsg;
					errorAddbook2.style.display = 'block';
					errorAddbook2.innerHTML = 'Number of attempts: ' + nrOfAttemptsAb;
					
					if(nrOfAttemptsAb < 10){
						addBook(urlAb, title, author);
					}

    			}
  		})
  		.catch(function(error) {
    		console.log(error);
    		fails = fails + 1;
    		nrOfAttemptsAb = nrOfAttemptsAb + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorAddBook.style.display = 'block';
			errorAddBook.innerText = 'The last failure reason: ' + error;
  		});  //end of fetch
	} //addBook

	//Change book functionality
	var btnChange = document.getElementById('btnChange');
	var errorChangeBook = document.getElementById('errorChangeBook');
	var errorChangeBook2 = document.getElementById('errorChangeBook2');
	var replacedBook = document.getElementById('replacedBook');
	var titleChangeBook = document.getElementById('titleChangeBook');
	var nrOfAttemptsCb = 0;
	var erMsgC = "";

	btnChange.addEventListener('click', function(event){
		var bookId = document.getElementById('inputChangeBookId').value;
		document.getElementById('inputChangeBookId').value = "";
		var bookTitle = document.getElementById('inputChangeBookTitle').value;
		document.getElementById('inputChangeBookTitle').value = "";
		var bookAuthor = document.getElementById('inputChangeBookAuthor').value;
		document.getElementById('inputChangeBookAuthor').value = "";
		console.log('Id: ' + bookId + ' Title: ' + bookTitle + ' Aythor: ' + bookAuthor);
		console.log(typeof ids[0]);
		console.log(typeof bookId);
		var numberId = parseInt(bookId);

		if (bookTitle.length === 0||bookAuthor.length===0) {
			errorMessage = 'Please enter name of a book and an author';
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorChangeBook.style.display = 'block';
			errorChangeBook.style.marginBottom = '30px';
			errorChangeBook.innerText = errorMessage;
		} else if (ids.includes(numberId)){
			var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=' + key + '&id=' + bookId + '&title=' + bookTitle + '&author=' + bookAuthor;
			//https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=4w5Ba&id=27070&title=dddd&author=dddd
			console.log(url);
			changeBook(url, bookId, bookTitle, bookAuthor);

		} else  {
			errorMessage = 'Please enter the right book id';
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorChangeBook.style.display = 'block';
			errorChangeBook.style.marginBottom = '30px';
			errorChangeBook.innerText = errorMessage;

		} //end of else

	}); //End of change eventlistener

	const changeBook = function(urlCb, idc, titlec, authorc){

		fetch(urlCb)
  			.then((resp) => resp.json())
  			.then(function(data) {
    			console.log(data);
    			console.log(data.status);
    			if (data.status === 'success'){
    				
    				var bookString = 'Id: ' + idc + ', ' + titlec + ', ' + authorc;
    				console.log(bookString);

    				titleChangedBook.style.display = 'block';  //Title
    				//div element that represents book
    				var divBook = document.createElement('div'); 
    				divBook.className = 'book';
    				replacedBook.appendChild(divBook);

    				//P for book ID
    				var paragId = document.createElement('p');
    				paragId.innerText = 'Book Id:  ' + idc;
    				divBook.appendChild(paragId);
    				//P for Title
    				var paragTitle = document.createElement('p');
    				paragTitle.innerText = 'Title:  ' + titlec;
    				divBook.appendChild(paragTitle);
    				//P for Author
    				var paragAuthor = document.createElement('p');
    				paragAuthor.innerText = 'Author:  ' + authorc;
    				divBook.appendChild(paragAuthor);

    				var paragEnd = document.getElementById('pEndC');
    				paragEnd.style.display = 'block';

    				

    			} else if (data.status === 'error'){
    				console.log(data.message);
    				erMsgC = data.message;
    				fails = fails + 1;
    				nrOfAttemptsCb = nrOfAttemptsCb + 1;
    				console.log('After fetch' + erMsgC + nrOfAttemptsCb);
					pFails.innerText = 'Number of requests that failed: ' + fails;
					errorChangeBook.style.display = 'block';
					errorChangeBook.innerText = 'The last failure reason: ' + erMsgC;
					errorChangeBook2.style.display = 'block';
					errorChangeBook2.innerHTML = 'Number of attempts: ' + nrOfAttemptsCb;
					
					if(nrOfAttemptsCb < 10){
						changeBook(urlCb, idc, titlec, authorc);
					}

    			}
  		})
  		.catch(function(error) {
    		console.log(error);
    		fails = fails + 1;
    		nrOfAttemptsCb = nrOfAttemptsCb + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorChangeBook.style.display = 'block';
			errorChangeBook.innerText = 'The last failure reason: ' + error;
  		});  //end of fetch

	} //end of changeBook


	//Delete book functionality
	var btnDelete = document.getElementById('btnDelete');
	var errorDeleteBook = document.getElementById('errorDeleteBook');
	var errorDeleteBook2 = document.getElementById('errorDeleteBook2');
	var deletedBook = document.getElementById('deletedBook');
	var titleDeletedBook = document.getElementById('titleDeletedBook');
	var nrOfAttemptsDb = 0;
	var erMsgD = "";

	btnDelete.addEventListener('click',function(event){

		var bookId = document.getElementById('inputDeleteBookId').value;
		document.getElementById('inputDeleteBookId').value = "";
		
		console.log('Id: ' + bookId);
		console.log(typeof ids[0]);
		console.log(typeof bookId);
		var numberId = parseInt(bookId);

		if (bookId.length === 0) {
			errorMessage = 'Please enter id of a book';
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorDeleteBook.style.display = 'block';
			errorDeleteBook.style.marginBottom = '30px';
			errorDeleteBook.innerText = errorMessage;
		} else if (ids.includes(numberId)){
			var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=' + key + '&id=' + bookId;
			console.log(url);
			deleteBook(url, bookId);
		} else  {
			errorMessage = 'Please enter the right book id';
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorDeleteBook.style.display = 'block';
			errorDeleteBook.style.marginBottom = '30px';
			errorDeleteBook.innerText = errorMessage;
		} //end of else

	}); //End of delete eventlistener

	const deleteBook = function(urlDb, idd){

		fetch(urlDb)
  			.then((resp) => resp.json())
  			.then(function(data) {
    			console.log(data);
    			console.log(data.status);
    			if (data.status === 'success'){
    				
    				var bookString = 'Id: ' + idd;
    				console.log(bookString);

    				titleDeletedBook.style.display = 'block';  //Title
    				//div element that represents book
    				var divBook = document.createElement('div'); 
    				divBook.className = 'book';
    				deletedBook.appendChild(divBook);

    				//P for book ID
    				var paragId = document.createElement('p');
    				paragId.innerText = 'The book with id:  ' + idd + ' is deleted';
    				divBook.appendChild(paragId);
    				
    				var paragEnd = document.getElementById('pEndD');
    				paragEnd.style.display = 'block';

    				

    			} else if (data.status === 'error'){
    				console.log(data.message);
    				erMsgD = data.message;
    				fails = fails + 1;
    				nrOfAttemptsDb = nrOfAttemptsDb + 1;
    				console.log('After fetch' + erMsgD + nrOfAttemptsDb);
					pFails.innerText = 'Number of requests that failed: ' + fails;
					errorDeleteBook.style.display = 'block';
					errorDeleteBook.innerText = 'The last failure reason: ' + erMsgD;
					errorDeleteBook2.style.display = 'block';
					errorDeleteBook2.innerHTML = 'Number of attempts: ' + nrOfAttemptsDb;
					
					if(nrOfAttemptsDb < 10){
						deleteBook(urlDb, idd);
					}

    			}
  		})
  		.catch(function(error) {
    		console.log(error);
    		fails = fails + 1;
    		nrOfAttemptsDb = nrOfAttemptsDb + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorDeleteBook.style.display = 'block';
			errorDeleteBook.innerText = 'The last failure reason: ' + error;
  		});  //end of fetch

	} //End of deleteBook

	/*
	//XMLHTTPRequest
	btnView.addEventListener('click', function(event){
		var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=' + key;
		fetch(url).then(function(response) {
		
	  		if(response.status === 'success') {
	  			console.log(response.status);
	    		return response.data.json();
		  	}
	  		throw new Error(response.message);
		}).then(function(json) { 
			console.log(json); 
		}).catch(function(error) {
	  		console.log(error);
		}); //end of fetch
	});//end of btnView eventListener*/
	


}); //windows.load


	

