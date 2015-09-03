// window.onload = function(){
var testVar;
// var oD1 = new objDAO();

var nodeList = Array.prototype.slice.call( document.getElementById('myDashboard').children );
var nodeIndex = function(refDomEle){
	var cNodes = document.getElementById('myDashboard').children;
	var refX; var cCounter = 0; var nCounter = 0; var cX = 0;
	refX = refDomEle.closest('section');
	for (var i = 0; i < cNodes.length; i++) {
		if(cNodes[i].nodeName == 'SECTION'){
			nCounter++;
			// console.log('AAA:' + cNodes[i] + '==' + refX);
			if(cNodes[i] == refX)	cCounter = i;
//			cNodes.splice(i, 1);
		}
	};
	// console.log('cX: '+ cX);
	return cCounter;
}

function createCard(e, cardCaption){
	var domDashboard = document.getElementById('myDashboard');
	var domSection = document.createElement('section');
	var domH3 = document.createElement('h3');
	var domUl = document.createElement('ul');
	var domA1 = document.createElement('a');
	domH3.innerHTML = cardCaption;	//"List - ";
	domUl.classList.add('bucket');
	domA1.setAttribute('href', '#add');
	domA1.classList.add('a-btn');
	domA1.classList.add('add-card');
	domA1.innerHTML = "Add a card...";
	domA1.addEventListener('click', function(e){addSticker(e, this);}, false);
	
	domSection.appendChild(domH3);
	domSection.appendChild(domUl);
	domSection.appendChild(domA1);

	domDashboard.appendChild(domSection);
	objDAO.setCardItem(cardCaption);
	return domSection;
};

function createSticker(e, stickerCaption, domUl){
	var domLi = document.createElement('li');
	var domDiv = document.createElement('div');
	var domSpan = document.createElement('span');
	var domP = document.createElement('p');
	domLi.classList.add('sticker');
	
	// Add batch drag-drag events
	objDD1.addDragEventBatch(e, domLi);
	objDD1.addDropEventBatch(e, domLi);

	domDiv.setAttribute('selectable', 'false');
	domDiv.innerHTML = stickerCaption;
	domSpan.classList.add('ix-icon');
	domSpan.classList.add('ix-edit');
	domSpan.addEventListener('click', function(e){editSticker(e, this);}, false);
	domSpan.innerHTML = " &nbsp; ";
	domP.classList.add('drop-target');
	domP.innerHTML = "Drop target area";
	domLi.appendChild(domDiv);
	domLi.appendChild(domSpan);
	domLi.appendChild(domP);

	domUl.appendChild(domLi);	testVar = domUl;
//	index = nodeIndex(domUl);
//	objDAO.setStickerItem(stickerCaption, index);
	return domLi;
};

function editSticker(e, objSticker){
	// console.log('Edit Clicked...' + e + objSticker);
	// console.log(objSticker);

	var domSticker = objSticker.closest('li.sticker');
	var domStickerDiv = domSticker.querySelector('div');
	var domIcon = domSticker.querySelector('.ix-icon');
	var domTextarea = document.createElement('textarea');

	domTextarea.value = (domStickerDiv.innerHTML).trim();
	domStickerDiv.innerHTML = '';
	domStickerDiv.classList.add('txt-input-c');
	domStickerDiv.appendChild(domTextarea);

	btnSave = createActionButton(e, objSticker, 'save');
	btnCancel = createActionButton(e, objSticker, 'cancel');

	domSticker.appendChild(btnSave);
	domSticker.appendChild(btnCancel);

	hideIcon(domIcon);

};

function distroyStickerEdit(e, objHandler, callback){
	var domSticker = objHandler; // testVar = objHandler;
	var domStickerDiv = domSticker.querySelector('div');
	var domIcon = domSticker.querySelector('.ix-icon');
	var domTextarea = domSticker.querySelector('textarea');
	var tmpContents = (domStickerDiv.innerHTML).concat("").trim();

	domSticker.querySelector('.btn-save').remove();
	domSticker.querySelector('.btn-cancel').remove();
	domTextarea.remove();
	domStickerDiv.classList.remove('txt-input-c');
	tmpContents = domTextarea.value;

	if(callback == 'save'){	// console.log('Saved...');
		domStickerDiv.innerHTML = domTextarea.value;
	} else {	// console.log('Not Saved...');
		domStickerDiv.innerHTML = tmpContents;
	}

	index = nodeIndex(domSticker);
	objDAO.saveStickerDetails(index);

	showIcon(domIcon);
	return domStickerDiv;
};


function createActionButton(e, objSticker, btnName) {
	var domSave = document.createElement('input');
	var domCancel = document.createElement('input');

	if(btnName == 'save'){
		domSave.setAttribute('type', 'submit');
		domSave.setAttribute('name', 'btnAddList');
		domSave.classList.add('btn');
		domSave.classList.add('btn-save');
		domSave.value = 'Save';
		domSave.addEventListener('click', function(e){saveSticker(e, this);}, false);
		return domSave;
	} else {
		domCancel.setAttribute('type', 'button');
		domCancel.setAttribute('name', 'btnCancel');
		domCancel.classList.add('btn');
		domCancel.classList.add('btn-cancel');
		domCancel.value = 'X';
		domCancel.addEventListener('click', function(e){cancelSticker(e, this);}, false);
		return domCancel;
	}

}

function showIcon(objIcon){
//	objIcon.style = 'display: initial';
	objIcon.style = '';
}
function hideIcon(objIcon){
	objIcon.style = 'display: none';
}



//}



/*
Event listener methods - helpers
*/
function cancelSticker(e, btnCancel){
	// console.log('cancel pressed...' + btnCancel);
	var btnSave1 = btnSave.closest('li.sticker');
	var sticker;
	sticker = distroyStickerEdit(e, btnSave1, 'cancel');

	if(sticker.innerHTML.concat("").trim() == ''){
		removeSticker(sticker);
	}
}

function saveSticker(e, btnSave){
	// console.log(btnSave);
	var btnSave1 = btnSave.closest('li.sticker');
	distroyStickerEdit(e, btnSave1, 'save');
}

function addSticker(e, btnAdd){
	// console.log(btnAdd);
	var domUl = btnAdd.previousSibling;
	domLi = createSticker(e, " ", domUl);
	editSticker(e, domLi);
}

function removeSticker(domSticker){
	// console.log('Remove Sticker' + domSticker);
	domSticker.closest('li').remove();
}


// Initialize and track page ready statys
document.onreadystatechange = function(e){
	// console.log('Loaded successfully...' + e.type);
};

// Default actions on DomReady - Add first card + first sticker
document.addEventListener('DOMContentLoaded', function(e){
	// console.log('Document Content Loaded...' + e.type);

	var section = createCard(e, "My List 3");
	var domUl = section.querySelector('ul');
	createSticker(e, "Item 1 Test ", domUl);

});