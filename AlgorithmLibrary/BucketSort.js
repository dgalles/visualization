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



function BucketSort(am, w, h)
{
	this.init(am,w,h);

}


BucketSort.ARRAY_ELEM_WIDTH_SMALL = 30;
BucketSort.ARRAY_ELEM_HEIGHT_SMALL = 30;
BucketSort.ARRAY_ELEM_START_X_SMALL = 20;

BucketSort.ARRAY_ELEMENT_Y_SMALL = 150;

BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL = 30;
BucketSort.POINTER_ARRAY_ELEM_HEIGHT_SMALL = 30;
BucketSort.POINTER_ARRAY_ELEM_START_X_SMALL = 20;

BucketSort.LINKED_ITEM_HEIGHT_SMALL = 30;
BucketSort.LINKED_ITEM_WIDTH_SMALL = 24;

BucketSort.LINKED_ITEM_Y_DELTA_SMALL = 50;
BucketSort.LINKED_ITEM_POINTER_PERCENT_SMALL = 0.25;

BucketSort.MAX_DATA_VALUE = 999;

BucketSort.ARRAY_SIZE_SMALL  = 30;

BucketSort.ARRAY_Y_POS = 350;


BucketSort.inheritFrom(Algorithm);

BucketSort.prototype.init = function(am, w, h)
{
	var sc = BucketSort.superclass;
	var fn = sc.init;
	fn.call(this,am, w, h);
	this.addControls();
	this.pointer_array_elem_y_small = h -	50;

	this.nextIndex = 0;
	this.setup();	
}



BucketSort.prototype.addControls =  function()
{
	this.resetButton = this.addControlToAlgorithmBar("Button", "Randomize List");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.bucketSortButton = this.addControlToAlgorithmBar("Button", "Bucket Sort");
	this.bucketSortButton.onclick = this.bucketSortCallback.bind(this);

}


BucketSort.prototype.setup = function()
{
	this.arrayData = new Array(BucketSort.ARRAY_SIZE_SMALL);
	this.arrayRects= new Array(BucketSort.ARRAY_SIZE_SMALL);
	this.linkedListRects = new Array(BucketSort.ARRAY_SIZE_SMALL);
	this.linkedListData = new Array(BucketSort.ARRAY_SIZE_SMALL);
	this.upperIndices = new Array(BucketSort.ARRAY_SIZE_SMALL);
	this.lowerIndices = new Array(BucketSort.ARRAY_SIZE_SMALL);
	this.commands = new Array();
	this.oldData = new Array(BucketSort.ARRAY_SIZE_SMALL);
	
	for (var i = 0; i < BucketSort.ARRAY_SIZE_SMALL; i++)
	{
		var nextID = this.nextIndex++;
		this.arrayData[i] = Math.floor(Math.random()*BucketSort.MAX_DATA_VALUE);
		this.oldData[i] = this.arrayData[i];
		this.cmd("CreateRectangle", nextID, this.arrayData[i], BucketSort.ARRAY_ELEM_WIDTH_SMALL, BucketSort.ARRAY_ELEM_HEIGHT_SMALL, BucketSort.ARRAY_ELEM_START_X_SMALL + i *BucketSort.ARRAY_ELEM_WIDTH_SMALL, BucketSort.ARRAY_ELEMENT_Y_SMALL)
		this.arrayRects[i] = nextID;
		nextID = this.nextIndex++;
		this.cmd("CreateRectangle", nextID, "", BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL, BucketSort.POINTER_ARRAY_ELEM_HEIGHT_SMALL, BucketSort.POINTER_ARRAY_ELEM_START_X_SMALL + i *BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL, this.pointer_array_elem_y_small)
		this.linkedListRects[i] = nextID;
		this.cmd("SetNull", this.linkedListRects[i], 1);
		nextID = this.nextIndex++;
		this.upperIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  BucketSort.ARRAY_ELEM_START_X_SMALL + i *BucketSort.ARRAY_ELEM_WIDTH_SMALL, BucketSort.ARRAY_ELEMENT_Y_SMALL + BucketSort.ARRAY_ELEM_HEIGHT_SMALL);
		this.cmd("SetForegroundColor", nextID, "#0000FF");
		
		nextID = this.nextIndex++;
		this.lowerIndices[i] = nextID;
		this.cmd("CreateLabel", nextID, i, BucketSort.POINTER_ARRAY_ELEM_START_X_SMALL + i *BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL, this.pointer_array_elem_y_small + BucketSort.POINTER_ARRAY_ELEM_HEIGHT_SMALL);
		this.cmd("SetForegroundColor", nextID, "#0000FF");
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}

BucketSort.prototype.bucketSortCallback = function(event)
{
	var savedIndex = this.nextIndex;
	this.commands = new Array();
	linkedListData = new Array(BucketSort.ARRAY_SIZE_SMALL);
	var i;
	for (i= 0; i < BucketSort.ARRAY_SIZE_SMALL; i++)
	{
		var labelID = this.nextIndex++;
		var label2ID = this.nextIndex++;
		var label3ID = this.nextIndex++;
		var label4ID = this.nextIndex++;
		var node  = new LinkedListNode(this.arrayData[i],this.nextIndex++, 100, 75);
		this.cmd("CreateLinkedList", node.graphicID, "", BucketSort.LINKED_ITEM_WIDTH_SMALL, BucketSort.LINKED_ITEM_HEIGHT_SMALL, 100, 75);
		this.cmd("SetNull", node.graphicID, 1);
		
		this.cmd("CreateLabel", labelID, this.arrayData[i], BucketSort.ARRAY_ELEM_START_X_SMALL + i *BucketSort.ARRAY_ELEM_WIDTH_SMALL, BucketSort.ARRAY_ELEMENT_Y_SMALL);
		this.cmd("SetText", node.graphicID, "")
		this.cmd("SetText", this.arrayRects[i], "")
		this.cmd("Move", labelID, 100,75);
		this.cmd("Step");
		this.cmd("SetText", node.graphicID, this.arrayData[i]);
		this.cmd("Delete", labelID);
		var index  = Math.floor((this.arrayData[i]  * BucketSort.ARRAY_SIZE_SMALL) / (BucketSort.MAX_DATA_VALUE + 1));
		
		this.cmd("CreateLabel", labelID, "Linked List Array index = " ,  300, 20, 0);
		this.cmd("CreateLabel", label2ID, "Value * BucketSort.NUMBER_OF_ELEMENTS / (BucketSort.MAXIMUM_ARRAY_VALUE + 1)) = ",  300, 40, 0);
		this.cmd("CreateLabel", label3ID, "("+ String(this.arrayData[i]) + " * " + String(BucketSort.ARRAY_SIZE_SMALL) + ") / " + String(BucketSort.MAX_DATA_VALUE+1) + " = " , 300, 60, 0);
		this.cmd("CreateLabel", label4ID, index, 305, 85);
		this.cmd("SetForegroundColor", labelID, "#000000");
		this.cmd("SetForegroundColor", label2ID, "#000000");
		this.cmd("SetForegroundColor", label3ID, "#000000");
		this.cmd("SetForegroundColor", label4ID, "#0000FF");
		
		
		var highlightCircle = this.nextIndex++;
		this.cmd("CreateHighlightCircle", highlightCircle, "#0000FF",  305, 100);
		this.cmd("Move", highlightCircle, BucketSort.POINTER_ARRAY_ELEM_START_X_SMALL + index *BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL, this.pointer_array_elem_y_small + BucketSort.POINTER_ARRAY_ELEM_HEIGHT_SMALL);
		this.cmd("Step");
		this.cmd("Delete", labelID);
		this.cmd("Delete", label2ID);
		this.cmd("Delete", label3ID);
		this.cmd("Delete", label4ID);
		this.cmd("Delete", highlightCircle);
		
		
		
		if (linkedListData[index] == null)
		{
			linkedListData[index] = node;
			this.cmd("Connect", this.linkedListRects[index], node.graphicID);
			this.cmd("SetNull",this.linkedListRects[index], 0);
			
			node.x = BucketSort.POINTER_ARRAY_ELEM_START_X_SMALL + index *BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL;
			node.y = this.pointer_array_elem_y_small - BucketSort.LINKED_ITEM_Y_DELTA_SMALL;
			this.cmd("Move", node.graphicID, node.x, node.y);
		}
		else
		{
			var tmp = linkedListData[index];
			this.cmd("SetHighlight", tmp.graphicID, 1);
			this.cmd("SetHighlight", node.graphicID, 1);
			this.cmd("Step");
			this.cmd("SetHighlight", tmp.graphicID, 0);
			this.cmd("SetHighlight", node.graphicID, 0);
			
			if (Number(tmp.data) >= Number(node.data))
			{
				this.cmd("Disconnect", this.linkedListRects[index], linkedListData[index].graphicID);
				node.next = tmp;
				this.cmd("Connect", this.linkedListRects[index], node.graphicID);
				this.cmd("Connect", node.graphicID, tmp.graphicID);
				this.cmd("SetNull",node.graphicID, 0);
				linkedListData[index] = node;
				this.cmd("Connect", this.linkedListRects[index], node.graphicID);
				
			}					
			else
			{
				if (tmp.next != null)
				{
					this.cmd("SetHighlight", tmp.next.graphicID, 1);
					this.cmd("SetHighlight", node.graphicID, 1);
					this.cmd("Step");
					this.cmd("SetHighlight", tmp.next.graphicID, 0);
					this.cmd("SetHighlight", node.graphicID, 0);
				}
				
				while (tmp.next != null && tmp.next.data < node.data)
				{
					tmp = tmp.next;
					if (tmp.next != null)
					{
						this.cmd("SetHighlight", tmp.next.graphicID, 1);
						this.cmd("SetHighlight", node.graphicID, 1);
						this.cmd("Step");
						this.cmd("SetHighlight", tmp.next.graphicID, 0);
						this.cmd("SetHighlight", node.graphicID, 0);
					}
				}
				if (tmp.next != null)
				{
					this.cmd("Disconnect", tmp.graphicID, tmp.next.graphicID);
					this.cmd("Connect", node.graphicID, tmp.next.graphicID);
					this.cmd("SetNull",node.graphicID, 0);
				}
				else
				{
					this.cmd("SetNull",tmp.graphicID, 0);
				}
				node.next = tmp.next;
				tmp.next = node;
				this.cmd("Connect", tmp.graphicID, node.graphicID);						
			}
			tmp = linkedListData[index];
			var startX = BucketSort.POINTER_ARRAY_ELEM_START_X_SMALL + index *BucketSort.POINTER_ARRAY_ELEM_WIDTH_SMALL;
			var startY =  this.pointer_array_elem_y_small - BucketSort.LINKED_ITEM_Y_DELTA_SMALL;
			while (tmp != null)
			{
				tmp.x = startX;
				tmp.y = startY;
				this.cmd("Move", tmp.graphicID, tmp.x, tmp.y);
				startY = startY - BucketSort.LINKED_ITEM_Y_DELTA_SMALL;
				tmp = tmp.next;
			}
		}
		this.cmd("Step");
	}
	var insertIndex = 0;
	for (i = 0; i < BucketSort.ARRAY_SIZE_SMALL; i++)
	{
		for (tmp = linkedListData[i]; tmp != null; tmp = tmp.next)
		{
			var moveLabelID = this.nextIndex++;
			this.cmd("SetText", tmp.graphicID, "");
			this.cmd("SetText", this.arrayRects[insertIndex], "");
			this.cmd("CreateLabel", moveLabelID, tmp.data, tmp.x, tmp.y);
			this.cmd("Move", moveLabelID,  BucketSort.ARRAY_ELEM_START_X_SMALL + insertIndex *BucketSort.ARRAY_ELEM_WIDTH_SMALL, BucketSort.ARRAY_ELEMENT_Y_SMALL);
			this.cmd("Step");
			this.cmd("Delete", moveLabelID);
			this.cmd("SetText", this.arrayRects[insertIndex], tmp.data);
			this.cmd("Delete", tmp.graphicID);
			if (tmp.next != null)
			{
				this.cmd("Connect", this.linkedListRects[i], tmp.next.graphicID);
			}
			else
			{
				this.cmd("SetNull", this.linkedListRects[i], 1);
			}
			this.arrayData[insertIndex] = tmp.data;
			insertIndex++;
		}
		
		
	}
	this.animationManager.StartNewAnimation(this.commands);
	insertIndex = savedIndex;
}

BucketSort.prototype.randomizeArray = function()
{
	this.commands = new Array();
	for (var i = 0; i < BucketSort.ARRAY_SIZE_SMALL; i++)
	{
		this.arrayData[i] =  Math.floor(1 + Math.random()*BucketSort.MAX_DATA_VALUE);
		this.oldData[i] = this.arrayData[i];
		this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
	}
	
	
	
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}



// We want to (mostly) ignore resets, since we are disallowing undoing 
BucketSort.prototype.reset = function()
{
	this.commands = new Array();
	for (var i = 0; i < BucketSort.ARRAY_SIZE_SMALL; i++)
	{
		this.arrayData[i] = this.oldData[i];
	}
}


BucketSort.prototype.resetCallback = function(event)
{
	this.randomizeArray();
}



BucketSort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.bucketSortButton.disabled = true;
}
BucketSort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.bucketSortButton.disabled = false;
}

function LinkedListNode(label, id, x, y)
{
	this.data = label;
	this.graphicID = id;
	this.x = x;
	this.y = y;
}

var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new BucketSort(animManag, canvas.width, canvas.height);
}