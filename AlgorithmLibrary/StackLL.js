// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

function StackLL(am, w, h)
{
	this.init(am, w, h);
	
}
StackLL.inheritFrom(Algorithm);


StackLL.LINKED_LIST_START_X = 100;
StackLL.LINKED_LIST_START_Y = 200;
StackLL.LINKED_LIST_ELEM_WIDTH = 70;
StackLL.LINKED_LIST_ELEM_HEIGHT = 30;


StackLL.LINKED_LIST_INSERT_X = 250;
StackLL.LINKED_LIST_INSERT_Y = 50;

StackLL.LINKED_LIST_ELEMS_PER_LINE = 8;
StackLL.LINKED_LIST_ELEM_SPACING = 100;
StackLL.LINKED_LIST_LINE_SPACING = 100;

StackLL.TOP_POS_X = 180;
StackLL.TOP_POS_Y = 100;
StackLL.TOP_LABEL_X = 130;
StackLL.TOP_LABEL_Y =  100;

StackLL.TOP_ELEM_WIDTH = 30;
StackLL.TOP_ELEM_HEIGHT = 30;

StackLL.PUSH_LABEL_X = 50;
StackLL.PUSH_LABEL_Y = 30;
StackLL.PUSH_ELEMENT_X = 120;
StackLL.PUSH_ELEMENT_Y = 30;

StackLL.SIZE = 32;


StackLL.prototype.init = function(am, w, h)
{
	StackLL.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


StackLL.prototype.addControls =  function()
{
	this.controls = [];
	this.pushField = this.addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.pushCallback.bind(this), 6);
	this.pushButton = this.addControlToAlgorithmBar("Button", "Push");
	this.pushButton.onclick = this.pushCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.pushButton);

	this.popButton = this.addControlToAlgorithmBar("Button", "Pop");
	this.popButton.onclick = this.popCallback.bind(this);
	this.controls.push(this.popButton);
	
	this.clearButton = this.addControlToAlgorithmBar("Button", "Clear Stack");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);
	
}

StackLL.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
	
	
}
StackLL.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


StackLL.prototype.setup = function()
{
	
	this.linkedListElemID = new Array(StackLL.SIZE);
	for (var i = 0; i < StackLL.SIZE; i++)
	{
		
		this.linkedListElemID[i]= this.nextIndex++;
	}
	this.topID = this.nextIndex++;
	this.topLabelID = this.nextIndex++;
	
	this.arrayData = new Array(StackLL.SIZE);
	this.top = 0;
	this.leftoverLabelID = this.nextIndex++;
		
	this.cmd("CreateLabel", this.topLabelID, "Top", StackLL.TOP_LABEL_X, StackLL.TOP_LABEL_Y);
	this.cmd("CreateRectangle", this.topID, "", StackLL.TOP_ELEM_WIDTH, StackLL.TOP_ELEM_HEIGHT, StackLL.TOP_POS_X, StackLL.TOP_POS_Y);
	this.cmd("SetNull", this.topID, 1);
	
	this.cmd("CreateLabel", this.leftoverLabelID, "", StackLL.PUSH_LABEL_X, StackLL.PUSH_LABEL_Y);
	
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();		
	
}

StackLL.prototype.resetLinkedListPositions = function()
{
	for (var i = this.top - 1; i >= 0; i--)
	{
		var nextX = (this.top - 1 - i) % StackLL.LINKED_LIST_ELEMS_PER_LINE * StackLL.LINKED_LIST_ELEM_SPACING + StackLL.LINKED_LIST_START_X;
		var nextY = Math.floor((this.top - 1 - i) / StackLL.LINKED_LIST_ELEMS_PER_LINE) * StackLL.LINKED_LIST_LINE_SPACING + StackLL.LINKED_LIST_START_Y;
		this.cmd("Move", this.linkedListElemID[i], nextX, nextY);				
	}
	
}


		
		
StackLL.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}
		
		
StackLL.prototype.pushCallback = function(event)
{
	if (this.top < StackLL.SIZE && this.pushField.value != "")
	{
		var pushVal = this.pushField.value;
		this.pushField.value = ""
		this.implementAction(this.push.bind(this), pushVal);
	}
}
		
		
StackLL.prototype.popCallback = function(event)
{
	if (this.top > 0)
	{
		this.implementAction(this.pop.bind(this), "");
	}
}
		

StackLL.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearAll.bind(this), "");
}

		

StackLL.prototype.push = function(elemToPush)
{
	this.commands = new Array();
	
	var labPushID = this.nextIndex++;
	var labPushValID = this.nextIndex++;
	this.arrayData[this.top] = elemToPush;
	
	this.cmd("SetText", this.leftoverLabelID, "");
	
	this.cmd("CreateLinkedList",this.linkedListElemID[this.top], "" ,StackLL.LINKED_LIST_ELEM_WIDTH, StackLL.LINKED_LIST_ELEM_HEIGHT, 
		StackLL.LINKED_LIST_INSERT_X, StackLL.LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	
	this.cmd("CreateLabel", labPushID, "Pushing Value: ", StackLL.PUSH_LABEL_X, StackLL.PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPushValID,elemToPush, StackLL.PUSH_ELEMENT_X, StackLL.PUSH_ELEMENT_Y);
	
	this.cmd("Step");
	
	
	
	this.cmd("Move", labPushValID, StackLL.LINKED_LIST_INSERT_X, StackLL.LINKED_LIST_INSERT_Y);
	
	this.cmd("Step");
	this.cmd("SetText", this.linkedListElemID[this.top], elemToPush);
	this.cmd("Delete", labPushValID);
	
	if (this.top == 0)
	{
		this.cmd("SetNull", this.topID, 0);
		this.cmd("SetNull", this.linkedListElemID[this.top], 1);
	}
	else
	{
		this.cmd("Connect",  this.linkedListElemID[this.top], this.linkedListElemID[this.top - 1]);
		this.cmd("Step");
		this.cmd("Disconnect", this.topID, this.linkedListElemID[this.top-1]);
	}
	this.cmd("Connect", this.topID, this.linkedListElemID[this.top]);
	
	this.cmd("Step");
	this.top = this.top + 1;
	this.resetLinkedListPositions();
	this.cmd("Delete", labPushID);
	this.cmd("Step");
	
	return this.commands;
}

StackLL.prototype.pop = function(ignored)
{
	this.commands = new Array();
	
	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;
	
	this.cmd("SetText", this.leftoverLabelID, "");
	
	
	this.cmd("CreateLabel", labPopID, "Popped Value: ", StackLL.PUSH_LABEL_X, StackLL.PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.top - 1], StackLL.LINKED_LIST_START_X, StackLL.LINKED_LIST_START_Y);
	
	this.cmd("Move", labPopValID,  StackLL.PUSH_ELEMENT_X, StackLL.PUSH_ELEMENT_Y);
	this.cmd("Step");
	this.cmd("Disconnect", this.topID, this.linkedListElemID[this.top - 1]);
	
	if (this.top == 1)
	{
		this.cmd("SetNull", this.topID, 1);
	}
	else
	{
		this.cmd("Connect", this.topID, this.linkedListElemID[this.top-2]);
		
	}
	this.cmd("Step");
	this.cmd("Delete", this.linkedListElemID[this.top - 1]);
	this.top = this.top - 1;
	this.resetLinkedListPositions();
	
	this.cmd("Delete", labPopValID)
	this.cmd("Delete", labPopID);
	this.cmd("SetText", this.leftoverLabelID, "Popped Value: " + this.arrayData[this.top]);
	
	
	
	return this.commands;
}



StackLL.prototype.clearAll = function()
{
	this.commands = new Array();
	for (var i = 0; i < this.top; i++)
	{
		this.cmd("Delete", this.linkedListElemID[i]);
	}
	this.top = 0;
	this.cmd("SetNull", this.topID, 1);
	return this.commands;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new StackLL(animManag, canvas.width, canvas.height);
}
