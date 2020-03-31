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



function OpenHash(am, w, h)
{
	// call superclass' constructor, which calls init
	OpenHash.superclass.constructor.call(this, am, w, h);
}
OpenHash.inheritFrom(Hash);


OpenHash.POINTER_ARRAY_ELEM_WIDTH = 70;
OpenHash.POINTER_ARRAY_ELEM_HEIGHT = 30;
OpenHash.POINTER_ARRAY_ELEM_START_X = 50;

OpenHash.LINKED_ITEM_HEIGHT = 30;
OpenHash.LINKED_ITEM_WIDTH = 65;

OpenHash.LINKED_ITEM_Y_DELTA = 50;
OpenHash.LINKED_ITEM_POINTER_PERCENT = 0.25;

OpenHash.MAX_DATA_VALUE = 999;

OpenHash.HASH_TABLE_SIZE  = 13;

OpenHash.ARRAY_Y_POS = 350;


OpenHash.INDEX_COLOR = "#0000FF";





OpenHash.prototype.init = function(am, w, h)
{
	var sc = OpenHash.superclass;
	var fn = sc.init;
	fn.call(this,am, w, h);
	this.nextIndex = 0;
	this.POINTER_ARRAY_ELEM_Y = h - OpenHash.POINTER_ARRAY_ELEM_WIDTH;
	this.setup();
}

OpenHash.prototype.addControls = function()
{
	OpenHash.superclass.addControls.call(this);

	// Add new controls

}

OpenHash.prototype.insertElement = function(elem)
{
	this.commands = new Array();
	this.cmd("SetText", this.ExplainLabel, "Inserting element: " + String(elem));
	var index = this.doHash(elem);
	var node  = new LinkedListNode(elem,this.nextIndex++, 100, 75);
	this.cmd("CreateLinkedList", node.graphicID, elem, OpenHash.LINKED_ITEM_WIDTH, OpenHash.LINKED_ITEM_HEIGHT, 100, 75);
	if (this.hashTableValues[index] != null && this.hashTableValues[index] != undefined)
	{
		this.cmd("connect", node.graphicID, this.hashTableValues[index].graphicID);
		this.cmd("disconnect", this.hashTableVisual[index], this.hashTableValues[index].graphicID);				
	}
	else
	{
		this.cmd("SetNull", node.graphicID, 1);
		this.cmd("SetNull", this.hashTableVisual[index], 0);
	}
	this.cmd("connect", this.hashTableVisual[index], node.graphicID);
	node.next = this.hashTableValues[index];
	this.hashTableValues[index] = node;
	
	this.repositionList(index);
	
	this.cmd("SetText", this.ExplainLabel, "");
	
	return this.commands;
	
}


OpenHash.prototype.repositionList = function(index)
{
	var startX = OpenHash.POINTER_ARRAY_ELEM_START_X + index *OpenHash.POINTER_ARRAY_ELEM_WIDTH;
	var startY =  this.POINTER_ARRAY_ELEM_Y - OpenHash.LINKED_ITEM_Y_DELTA;
	var tmp = this.hashTableValues[index];
	while (tmp != null)
	{
		tmp.x = startX;
		tmp.y = startY;
		this.cmd("Move", tmp.graphicID, tmp.x, tmp.y);
		startY = startY - OpenHash.LINKED_ITEM_Y_DELTA;
		tmp = tmp.next;
	}
}


OpenHash.prototype.deleteElement = function(elem)
{
	this.commands = new Array();
	this.cmd("SetText", this.ExplainLabel, "Deleting element: " + elem);
	var index = this.doHash(elem);
	if (this.hashTableValues[index] == null)
	{
		this.cmd("SetText", this.ExplainLabel, "Deleting element: " + elem + "  Element not in table");
		return this.commands;
	}
	this.cmd("SetHighlight", this.hashTableValues[index].graphicID, 1);
	this.cmd("Step");
	this.cmd("SetHighlight", this.hashTableValues[index].graphicID, 0);
	if (this.hashTableValues[index].data == elem)
	{
		if (this.hashTableValues[index].next != null)
		{
			this.cmd("Connect", this.hashTableVisual[index], this.hashTableValues[index].next.graphicID);
		}
		else
		{
			this.cmd("SetNull", this.hashTableVisual[index], 1);
		}
		this.cmd("Delete", this.hashTableValues[index].graphicID);
		this.hashTableValues[index] = this.hashTableValues[index].next;
		this.repositionList(index);
		return this.commands;
	}
	var tmpPrev = this.hashTableValues[index];
	var tmp = this.hashTableValues[index].next;
	var found = false;
	while (tmp != null && !found)
	{
		this.cmd("SetHighlight", tmp.graphicID, 1);
		this.cmd("Step");
		this.cmd("SetHighlight", tmp.graphicID, 0);
		if (tmp.data == elem)
		{
			found = true;
			this.cmd("SetText", this.ExplainLabel, "Deleting element: " + elem + "  Element deleted");
			if (tmp.next != null)
			{
				this.cmd("Connect", tmpPrev.graphicID, tmp.next.graphicID);
			}
			else
			{
				this.cmd("SetNull", tmpPrev.graphicID, 1);
			}
			tmpPrev.next = tmpPrev.next.next;
			this.cmd("Delete", tmp.graphicID);
			this.repositionList(index);
		}
		else
		{
			tmpPrev = tmp;
			tmp = tmp.next;
		}		
	}
	if (!found)
	{
		this.cmd("SetText", this.ExplainLabel, "Deleting element: " + elem + "  Element not in table");
	}
	return this.commands;
	
}
OpenHash.prototype.findElement = function(elem)
{
	this.commands = new Array();
	this.cmd("SetText", this.ExplainLabel, "Finding Element: " + elem);

	var index = this.doHash(elem);
	var compareIndex = this.nextIndex++;
	var found = false;
	var tmp = this.hashTableValues[index];
	this.cmd("CreateLabel", compareIndex, "", 10, 40, 0);
	while (tmp != null && !found)
	{
		this.cmd("SetHighlight", tmp.graphicID, 1);
		if (tmp.data == elem)
		{
			this.cmd("SetText", compareIndex,  tmp.data  + "==" + elem)
			found = true;
		}
		else
		{
			this.cmd("SetText", compareIndex,  tmp.data  + "!=" + elem)
		}
		this.cmd("Step");
		this.cmd("SetHighlight", tmp.graphicID, 0);
		tmp = tmp.next;
	}
	if (found)
	{
		this.cmd("SetText", this.ExplainLabel, "Finding Element: " + elem+ "  Found!")				
	}
	else
	{
		this.cmd("SetText", this.ExplainLabel, "Finding Element: " + elem+ "  Not Found!")
		
	}
	this.cmd("Delete", compareIndex);
	this.nextIndex--;
	return this.commands;
}




OpenHash.prototype.setup = function()
{
	this.hashTableVisual = new Array(OpenHash.HASH_TABLE_SIZE);
	this.hashTableIndices = new Array(OpenHash.HASH_TABLE_SIZE);
	this.hashTableValues = new Array(OpenHash.HASH_TABLE_SIZE);
	
	this.indexXPos = new Array(OpenHash.HASH_TABLE_SIZE);
	this.indexYPos = new Array(OpenHash.HASH_TABLE_SIZE);
	
	this.ExplainLabel = this.nextIndex++;
	
	this.table_size = OpenHash.HASH_TABLE_SIZE;

	this.commands = [];
	for (var i = 0; i < OpenHash.HASH_TABLE_SIZE; i++)
	{
		var nextID  = this.nextIndex++;
		
		this.cmd("CreateRectangle", nextID, "", OpenHash.POINTER_ARRAY_ELEM_WIDTH, OpenHash.POINTER_ARRAY_ELEM_HEIGHT, OpenHash.POINTER_ARRAY_ELEM_START_X + i *OpenHash.POINTER_ARRAY_ELEM_WIDTH, this.POINTER_ARRAY_ELEM_Y)
		this.hashTableVisual[i] = nextID;
		this.cmd("SetNull", this.hashTableVisual[i], 1);
		
		nextID = this.nextIndex++;
		this.hashTableIndices[i] = nextID;
		this.indexXPos[i] =  OpenHash.POINTER_ARRAY_ELEM_START_X + i *OpenHash.POINTER_ARRAY_ELEM_WIDTH;
		this.indexYPos[i] = this.POINTER_ARRAY_ELEM_Y + OpenHash.POINTER_ARRAY_ELEM_HEIGHT
		this.hashTableValues[i] = null;
		
		this.cmd("CreateLabel", nextID, i,this.indexXPos[i],this.indexYPos[i] );
		this.cmd("SetForegroundColor", nextID, OpenHash.INDEX_COLOR);
	}
	this.cmd("CreateLabel", this.ExplainLabel, "", 10, 25, 0);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.resetIndex  = this.nextIndex;
}



OpenHash.prototype.resetAll = function()
{
	var tmp;
	this.commands = OpenHash.superclass.resetAll.call(this);
	for (var i = 0; i < this.hashTableValues.length; i++)
	{
		tmp = this.hashTableValues[i];
		if (tmp != null)
		{
			while (tmp != null)
			{
				this.cmd("Delete", tmp.graphicID);
				tmp = tmp.next; 
			}
			this.hashTableValues[i] = null;
			this.cmd("SetNull",  this.hashTableVisual[i], 1);
		}
	}
	return this.commands;
}



// NEED TO OVERRIDE IN PARENT
OpenHash.prototype.reset = function()
{
	for (var i = 0; i < this.table_size; i++)
	{
		this.hashTableValues[i] = null;
	}
	this.nextIndex = this.resetIndex;
	OpenHash.superclass.reset.call(this);
}


OpenHash.prototype.resetCallback = function(event)
{
	
}



/*this.nextIndex = 0;
 this.commands = [];
 this.cmd("CreateLabel", 0, "", 20, 50, 0);
 this.animationManager.StartNewAnimation(this.commands);
 this.animationManager.skipForward();
 this.animationManager.clearHistory(); */
	




OpenHash.prototype.disableUI = function(event)
{
	var sc = OpenHash.superclass;
	var fn = sc.disableUI;
	fn.call(this);
}

OpenHash.prototype.enableUI = function(event)
{
	OpenHash.superclass.enableUI.call(this);
}




function LinkedListNode(val, id, initialX, initialY)
{
	this.data = val;
	this.graphicID = id;
	this.x = initialX;
	this.y = initialY;
	this.next = null;
	
}




var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new OpenHash(animManag, canvas.width, canvas.height);
}
