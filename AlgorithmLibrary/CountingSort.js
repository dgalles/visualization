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


function CountingSort(am, w, h)
{
	this.init(am, w, h);

}


CountingSort.ARRAY_ELEM_WIDTH = 30;
CountingSort.ARRAY_ELEM_HEIGHT = 30;
CountingSort.ARRAY_ELEM_START_X = 20;



CountingSort.COUNTER_ARRAY_ELEM_WIDTH = 30;
CountingSort.COUNTER_ARRAY_ELEM_HEIGHT = 30;
CountingSort.COUNTER_ARRAY_ELEM_START_X = 20;



CountingSort.MAX_DATA_VALUE = 30;
CountingSort.COUNTER_ARRAY_SIZE = CountingSort.MAX_DATA_VALUE + 1;

CountingSort.ARRAY_SIZE  = 30;


CountingSort.inheritFrom(Algorithm);

CountingSort.prototype.init = function(am, w, h)
{
	this.ARRAY_ELEM_Y =  3 * CountingSort.COUNTER_ARRAY_ELEM_HEIGHT;
	this.COUNTER_ARRAY_ELEM_Y = Math.floor(h / 2);
	this.SWAP_ARRAY_ELEM_Y =  h - 3 * CountingSort.COUNTER_ARRAY_ELEM_HEIGHT

	var sc = CountingSort.superclass;
	var fn = sc.init;
	fn.call(this,am,w,h);
	this.addControls();
	this.nextIndex = 0;
	this.setup();



}



CountingSort.prototype.sizeChanged = function(newWidth, newHeight)
{
	this.ARRAY_ELEM_Y =  3 * CountingSort.COUNTER_ARRAY_ELEM_HEIGHT;
	this.COUNTER_ARRAY_ELEM_Y = Math.floor(newHeight / 2);
	this.SWAP_ARRAY_ELEM_Y =  newHeight - 3 * CountingSort.COUNTER_ARRAY_ELEM_HEIGHT
	this.setup();
}


CountingSort.prototype.addControls =  function()
{
	this.resetButton = this.addControlToAlgorithmBar("Button", "Randomize List");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.countingsSortButton = this.addControlToAlgorithmBar("Button", "Counting Sort");
	this.countingsSortButton.onclick = this.countingSortCallback.bind(this);

}



CountingSort.prototype.setup = function()
{
	this.arrayData = new Array(CountingSort.ARRAY_SIZE);
	this. arrayRects= new Array(CountingSort.ARRAY_SIZE);
	this. arrayIndices = new Array(CountingSort.ARRAY_SIZE);
	
	
	this. counterData = new Array(CountingSort.COUNTER_ARRAY_SIZE);
	this. counterRects= new Array(CountingSort.COUNTER_ARRAY_SIZE);
	this. counterIndices = new Array(CountingSort.COUNTER_ARRAY_SIZE);
	
	this. swapData = new Array(CountingSort.ARRAY_SIZE);
	this. swapRects= new Array(CountingSort.ARRAY_SIZE);
	this. swapIndices = new Array(CountingSort.ARRAY_SIZE);					
	
	this. commands = new Array();
	
	this.animationManager.resetAll();
	for (var i = 0; i < CountingSort.ARRAY_SIZE; i++)
	{
		var nextID = this.nextIndex++;
		this.arrayData[i] = Math.floor(Math.random()*CountingSort.MAX_DATA_VALUE);
		this.cmd("CreateRectangle", nextID, this.arrayData[i], CountingSort.ARRAY_ELEM_WIDTH, CountingSort.ARRAY_ELEM_HEIGHT, CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y)
		this. arrayRects[i] = nextID;
		nextID = this.nextIndex++;
		this. arrayIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y + CountingSort.ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", nextID, "#0000FF");
		
		nextID = this.nextIndex++;
		this.cmd("CreateRectangle", nextID, "", CountingSort.ARRAY_ELEM_WIDTH, CountingSort.ARRAY_ELEM_HEIGHT, CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y)
		this. swapRects[i] = nextID;
		nextID = this.nextIndex++;
		this. swapIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y + CountingSort.ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", nextID, "#0000FF");
		
	}
	for (i = CountingSort.COUNTER_ARRAY_SIZE - 1; i >= 0; i--)
	{
		nextID = this.nextIndex++;
		this.cmd("CreateRectangle", nextID,"", CountingSort.COUNTER_ARRAY_ELEM_WIDTH, CountingSort.COUNTER_ARRAY_ELEM_HEIGHT, CountingSort.COUNTER_ARRAY_ELEM_START_X + i *CountingSort.COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y)
		this. counterRects[i] = nextID;
		nextID = this.nextIndex++;
		this. counterIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  CountingSort.COUNTER_ARRAY_ELEM_START_X + i *CountingSort.COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y + CountingSort.COUNTER_ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", nextID, "#0000FF");
	}
	this.animationManager.StartNewAnimation(this. commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}



CountingSort.prototype.resetAll = function(small)
{
	this.animationManager.resetAll();
	this.nextIndex = 0;
}

CountingSort.prototype.countingSortCallback = function(event)
{
	this. commands = new Array();
	var animatedCircleID = this.nextIndex++;
	var animatedCircleID2 = this.nextIndex++;
	var animatedCircleID3 = this.nextIndex++;
	var animatedCircleID4 = this.nextIndex++;
	for (var i = 0; i < CountingSort.COUNTER_ARRAY_SIZE; i++)
	{
		this. counterData[i] = 0;
		this.cmd("SetText", this. counterRects[i], 0);
	}
	for (i = 0; i < CountingSort.ARRAY_SIZE; i++)
	{
		this.cmd("CreateHighlightCircle", animatedCircleID, "#0000FF",  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
		this.cmd("CreateHighlightCircle", animatedCircleID2, "#0000FF",  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
		var index = this.arrayData[i];
		this.cmd("Move", animatedCircleID,  CountingSort.COUNTER_ARRAY_ELEM_START_X + index *CountingSort.COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y + CountingSort.COUNTER_ARRAY_ELEM_HEIGHT)
		this.cmd("Step");
		this. counterData[index]++;
		this.cmd("SetText", this. counterRects[this.arrayData[i]], this. counterData[this.arrayData[i]]);
		this.cmd("Step");
		this.cmd("SetAlpha", this. arrayRects[i], 0.2);
		this.cmd("Delete", animatedCircleID);
		this.cmd("Delete", animatedCircleID2);
	}
	for (i=1; i < CountingSort.COUNTER_ARRAY_SIZE; i++)
	{
		this.cmd("SetHighlight", this. counterRects[i-1], 1);
		this.cmd("SetHighlight", this. counterRects[i], 1);
		this.cmd("Step")
		this. counterData[i] = this. counterData[i] + this. counterData[i-1];
		this.cmd("SetText", this. counterRects[i], this. counterData[i]);
		this.cmd("Step")
		this.cmd("SetHighlight", this. counterRects[i-1], 0);
		this.cmd("SetHighlight", this. counterRects[i], 0);
	}
	for (i=CountingSort.ARRAY_SIZE - 1; i >= 0; i--)
	{
		this.cmd("SetAlpha", this. arrayRects[i], 1.0);
	}
	for (i=CountingSort.ARRAY_SIZE - 1; i >= 0; i--)
	{
		this.cmd("CreateHighlightCircle", animatedCircleID, "#0000FF",  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
		this.cmd("CreateHighlightCircle", animatedCircleID2, "#0000FF",  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
		
		index = this.arrayData[i];
		this.cmd("Move", animatedCircleID2,  CountingSort.COUNTER_ARRAY_ELEM_START_X + index *CountingSort.COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y + CountingSort.COUNTER_ARRAY_ELEM_HEIGHT)
		this.cmd("Step");
		
		var insertIndex = --this. counterData[this.arrayData[i]];
		this.cmd("SetText", this. counterRects[this.arrayData[i]], this. counterData[this.arrayData[i]]);
		this.cmd("Step");
		
		this.cmd("CreateHighlightCircle", animatedCircleID3, "#AAAAFF",  CountingSort.COUNTER_ARRAY_ELEM_START_X + index *CountingSort.COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y);
		this.cmd("CreateHighlightCircle", animatedCircleID4, "#AAAAFF",  CountingSort.COUNTER_ARRAY_ELEM_START_X + index *CountingSort.COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y);
		
		this.cmd("Move", animatedCircleID4,  CountingSort.ARRAY_ELEM_START_X + insertIndex * CountingSort.ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y + CountingSort.COUNTER_ARRAY_ELEM_HEIGHT)
		this.cmd("Step");
		
		var moveLabel = this.nextIndex++;
		this.cmd("SetText", this. arrayRects[i], "");
		this.cmd("CreateLabel", moveLabel, this.arrayData[i], CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
		this.cmd("Move", moveLabel, CountingSort.ARRAY_ELEM_START_X + insertIndex *CountingSort.ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y);
		this. swapData[insertIndex] = this.arrayData[i];
		this.cmd("Step");
		this.cmd("Delete", moveLabel);
		this.nextIndex--;  // Reuse index from moveLabel, now that it has been removed.
		this.cmd("SetText", this. swapRects[insertIndex], this. swapData[insertIndex]);
		this.cmd("Delete", animatedCircleID);
		this.cmd("Delete", animatedCircleID2);
		this.cmd("Delete", animatedCircleID3);
		this.cmd("Delete", animatedCircleID4);
		
	}
	for (i= 0; i < CountingSort.ARRAY_SIZE; i++)
	{
		this.cmd("SetText", this. arrayRects[i], "");
	}
	
	for (i= 0; i < CountingSort.COUNTER_ARRAY_SIZE; i++)
	{
		this.cmd("SetAlpha", this. counterRects[i], 0.05);
		this.cmd("SetAlpha", this. counterIndices[i], 0.05);
	}
	
	this.cmd("Step");
	var startLab = this.nextIndex;
	for (i = 0; i < CountingSort.ARRAY_SIZE; i++)
	{
		this.cmd("CreateLabel", startLab+i, this. swapData[i], CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y);
		this.cmd("Move", startLab+i,  CountingSort.ARRAY_ELEM_START_X + i *CountingSort.ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
		this.cmd("SetText", this. swapRects[i], "");
		
	}
	this.cmd("Step");
	for (i = 0; i < CountingSort.ARRAY_SIZE; i++)
	{				
		this.arrayData[i] = this. swapData[i];
		this.cmd("SetText", this. arrayRects[i], this.arrayData[i]);
		this.cmd("Delete", startLab + i);
	}
	for (i= 0; i < CountingSort.COUNTER_ARRAY_SIZE; i++)
	{
		this.cmd("SetAlpha", this. counterRects[i], 1);
		this.cmd("SetAlpha", this. counterIndices[i], 1);
	}
	this.animationManager.StartNewAnimation(this. commands);
	
}

CountingSort.prototype.randomizeArray = function()
{
	this. commands = new Array();
	for (var i = 0; i < CountingSort.ARRAY_SIZE; i++)
	{
		this.arrayData[i] = Math.floor(1 + Math.random()*CountingSort.MAX_DATA_VALUE);
		this.cmd("SetText", this. arrayRects[i], this.arrayData[i]);
	}
	
	for (i = 0; i < CountingSort.COUNTER_ARRAY_SIZE; i++)
	{
		this.cmd("SetText", this. counterRects[i], "");
	}
	
	
	this.animationManager.StartNewAnimation(this. commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}



// We want to (mostly) ignore resets, since we are disallowing undoing 
CountingSort.prototype.reset = function()
{
	this.commands = new Array();
}


CountingSort.prototype.resetCallback = function(event)
{
	this.randomizeArray();
}



CountingSort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.countingsSortButton.disabled = true;
}
CountingSort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.countingsSortButton.disabled = false;
}

var currentAlg;

function init()
{
	var animManag = initCanvas();
	
	currentAlg = new CountingSort(animManag, canvas.width, canvas.height);
}