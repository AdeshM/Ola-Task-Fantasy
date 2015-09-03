// Initialize elements on page
window.onload = function(){

	// Track element being dragged
	var elemDragged = null;

	var oDD = new objDragDrop || {};

	// Set elements draggable
	var drgParentId = 'myDashboard';
	var drgParent = document.getElementById(drgParentId);
	var drgElements = drgParent.children;

	// Addition to fix class level issue
	var drgElements = document.querySelectorAll('.dashboard section ul li.sticker');
	for (var i = 0; i < drgElements.length; i++) {
		
		drgElements[i].setAttribute('draggable', true);

		// Attach event listener 'start' for each element
		drgElements[i].addEventListener('dragstart', function(e){oDD.eDrgStart(e, this);});

		// Attach event listener 'end' for each element
		drgElements[i].addEventListener('dragend', function(e){oDD.eDrgEnd(e, this);});

	};
	//drgElement.setAttribute('draggable', true);


	// Set drop target area
	var drpTarget = document.getElementById('drop-bucket');

	// Addition to fix class level issue - Drop Target
	var drpTarget = document.querySelectorAll('.dashboard section ul.bucket li');

	for (var i = 0; i < drpTarget.length; i++) {
		// Attach event 'dragover' when dragged element is over target area
		drpTarget[i].addEventListener('dragover', function(e){return oDD.eDragOver(e);});

		// Attaching event 'dragenter' while drag element enters drop target
		drpTarget[i].addEventListener('dragenter', function(e){oDD.eDragEnter(e, this);});

		// Attaching event 'dragleave' while drag element leaves drop target
		drpTarget[i].addEventListener('dragleave', function(e){oDD.eDragLeave(e, this)});

		// Attaching event for 'drop' action
		drpTarget[i].addEventListener('drop', function(e){return oDD.eDrop(e, this);});
	};

};



// Collection - Event drag action methods

function objDragDrop(){
	this.eDrgStart = function(e, that) {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', that);
		elemDragged = that;
		elemDragged.classList.add('over');
	};

	this.eDrgEnd = function(e, that){
		elemDragged = that;
		elemDragged.classList.remove('over');
		elemDragged = null;
	};


	// Collection - Event drop action methods
	this.eDragOver = function(e){
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';	// console.log(this)
		return false;
	};

	this.eDragEnter = function(e, that){
		that.classList.add('over');
	};

	this.eDragLeave = function(e, that){
		that.classList.remove('over');
	};

	this.eDrop = function(e, that){
		e.preventDefault();
		e.stopPropagation();
		that.classList.remove('over');
		
		//if(this.children.length > 0){
			itemCount = that.children.length; // console.log(that.children.length);
			// that.appendChild(elemDragged);	// working

			parentS = elemDragged.parentElement;
			parentN = e.currentTarget.parentElement;
			parentN.insertBefore(elemDragged, e.currentTarget);


			index = nodeIndex(parentN);
			objDAO.saveStickerDetails(index);

			index = nodeIndex(parentS);
			objDAO.saveStickerDetails(index);

//			e.currentTarget.appendItem(elemDragged);
// testVar = parentS;
// console.log(testVar);

		//}
		// this.innerHTML = "Dropped" + e.dataTransfer.getData('html');

		// Remove element from stack
		// console.log(itemCount);
	//	if (itemCount <= this.children.length) {
	//		drgParent.removeChild(elemDragged);
	//	}

		return false;
	};
};

objDragDrop.prototype.addDragEventBatch = function(e, objLi){
	var oThat = this
	
	objLi.setAttribute('draggable', true);

	// Attach event listener 'start' for each element
	objLi.addEventListener('dragstart', function(e){oThat.eDrgStart(e, this);});

	// Attach event listener 'end' for each element
	objLi.addEventListener('dragend', function(e){oThat.eDrgEnd(e, this);});
};

objDragDrop.prototype.addDropEventBatch = function(e, objUl){
	var oThat = this

	objUl.addEventListener('dragover', function(e){return oThat.eDragOver(e);});

	// Attaching event 'dragenter' while drag element enters drop target
	objUl.addEventListener('dragenter', function(e){oThat.eDragEnter(e, this);});

	// Attaching event 'dragleave' while drag element leaves drop target
	objUl.addEventListener('dragleave', function(e){oThat.eDragLeave(e, this)});

	// Attaching event for 'drop' action
	objUl.addEventListener('drop', function(e){return oThat.eDrop(e, this);});
}

var objDD1 = new objDragDrop || {};

var objData = new Array() || [];
/*
	[["List Title 1", ["List Item 1", "List Item 2", "List Item 3"], "Order 1"],
	["List Title 2", ["List Item 1", "List Item 2", "List Item 3"], "Order 3"],
	["List Title 3", ["List Item 1", "List Item 2", "List Item 3"], "Order 4"]]
 */

var objDAO = new function(){
 	
 	this.column = new Array();

 	this.setCardItem = function(cardCaption, ix){
 		// console.log(ix + cardCaption);
 		objData.push(Array(cardCaption));
 	};

 	this.saveStickerDetails = function(ix){
 		// console.log('Saved Details...');
 		s = this.readAllStickers(ix);
 		if(objData[ix-1].length > 1){
 			objData[ix-1][(objData[ix-1].length-1)] = s;
 		} else {
 			objData[ix-1].push(s);
 			// console.log('length < 1 pushed...');
 		}
 		// console.log(s);
 	};

 	this.setStickerItem = function(stickerCaption, ix){
 		var list = this.readAllStickers(ix);
 		cur = objData[ix-1].length-1;
 		// console.log('ix: '+ix + stickerCaption + cur);
 		
 		// objData[ix-1].splice(0, cur);
 		// objData[ix-1].push(Array(stickerCaption));	
 	};

 	this.removeCardItem = function(cardCaption, ix){
 		// console.log(ix + cardCaption);
 		ix = objData.indexOf(cardCaption);
 		if(ix >= 0)	objData.splice(ix, 1);
 	};

 	this.removeStickerItem = function(stickerCaption, ix){
 		// console.log(ix + stickerCaption);
 		ix = objData.indexOf(stickerCaption);
 		if(ix >= 0)	objData.splice(ix, 1);
 	}; 	

 	this.setItemOrder = function(ix){
 		// console.log(ix);
 	};

 	this.readAllStickers = function(ix){
 		// console.log(ix);
 		var arrStickers = new Array();
 		var domX = document.querySelectorAll('ul.bucket')[ix-1];
 		var domY = domX.querySelectorAll('li.sticker div');
 		for (var i = 0; i < domY.length; i++) {
 			arrStickers.push(domY[i].innerHTML);
 		};
 		this.column = arrStickers;
 		//console.log(arrStickers);
 		return arrStickers;
 	};

};



/* Card Creation */




// window.onload = function(){

/* Move to app.js */
var objAddList = document.querySelector('.add-list-block');
objAddList.onclick = function(){
	// console.log('Element clicked...');
	objAddList.classList.remove('inactive');
//	objAddList.style = 'transition: max-height 0.1s';
};

var btnAddList = document.querySelector('#btnAddList');
btnAddList.onclick = function(e){
	// console.log('Save button clicked...');
//	objAddList.classList.add('inactive');
	var myListCaption = document.getElementById('listName');
	var section = createCard(e, myListCaption.value);
	var domUl = section.querySelector('ul');
	myListCaption.value = "";
	createSticker(e, "Item 1 Test ", domUl);
};

var btnCancel = document.querySelector('#btnCancel');
btnCancel.onclick = function(){
	// console.log('Cancel button clicked...' + objAddList);
	objAddList.classList.add('inactive');
};


var editIcon = document.querySelectorAll('.ix-edit');
for (var i = 0; i < editIcon.length; i++) {
	editIcon[i].addEventListener('click', function(e){editSticker(e, this);}, false);
};

// editSticker

// }