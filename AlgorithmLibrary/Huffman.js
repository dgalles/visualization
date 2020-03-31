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
// THIS SOFTWARE IS PROVIDED BY David Galles ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUHuffmanITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco


// Constants.

Huffman.LINK_COLOR = "#007700";
Huffman.HIGHLIGHT_CIRCLE_COLOR = "#007700";
Huffman.FOREGROUND_COLOR = "#007700";
Huffman.BACKGROUND_COLOR = "#EEFFEE";
Huffman.PRINT_COLOR = Huffman.FOREGROUND_COLOR;
Huffman.NODE_START = 100;
Huffman.WIDTH_DELTA  = 50;
Huffman.HEIGHT_DELTA = 50;
Huffman.STARTING_Y = 50;
Huffman.LEAF_DEPTH = 300;
Huffman.WIDTH=40;

Huffman.FIRST_PRINT_POS_X  = 50;
Huffman.PRINT_VERTICAL_GAP  = 20;
Huffman.PRINT_HORIZONTAL_GAP = 50;



function Huffman(am, w, h)
{
	this.init(am, w, h);
}
Huffman.inheritFrom(Algorithm);

Huffman.prototype.init = function(am, w, h)
{
	var sc = Huffman.superclass;
	this.startingX =  w / 2;
	this.first_print_pos_y  = h - 2 * Huffman.PRINT_VERTICAL_GAP;
	this.print_max  = w - 10;

	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.cmd("CreateLabel", 0, "", 20, 10, 0);
	this.cmd("SetHeight", 0,20);
	this.nextIndex = 1;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();	
}

Huffman.prototype.addControls =  function()
{
	this.encodeField = this.addControlToAlgorithmBar("Text", "");
	this.encodeField.onkeydown = this.returnSubmit(this.encodeField,  this.encodeCallback.bind(this), 50);
	this.encodeButton = this.addControlToAlgorithmBar("Button", "Encode");
	this.encodeButton.onclick = this.encodeCallback.bind(this);
}

Huffman.prototype.reset = function()
{
	this.nextIndex = 1;
	this.treeRoot = null;
}

Huffman.prototype.encodeCallback = function(event)
{
	var encodingValue = this.encodeField.value;
	// Get text value

	if (encodingValue != "")
	{
		// set text value
		this.encodeField.value = "";
		this.implementAction(this.encode.bind(this),encodingValue);
	}
}



Huffman.prototype.encode = function(encodeValue)
{
    this.commands = new Array();	
    this.cmd("SetText", 0, "Encoding: ");
    this.encodedString = this.nextIndex++;
    this.highlightID = this.nextIndex++;
    this.cmd("CreateLabel", this.encodedString, encodeValue, 0, 0, 0);
    this.cmd("SetHeight", this.encodedString, 20);
    this.cmd("AlignRight", this.encodedString, 0); 
    this.cmd("step");  
    var freq = new Array(256);
    for (var i = 0; i < 256; i++)
	freq[i] = 0;
    for (var i = 0; i < encodeValue.length; i++) {
	 var index = encodeValue.charCodeAt(i);
         freq[index]++;
    }
    var nodes = new Array(0);
    var pos = Huffman.NODE_START;
    for (var i = 0; i < 256; i++) {
	if (freq[i] != 0)   {
	    var nextNode = {freq : freq[i], ch : String.fromCharCode(i), id : this.nextIndex++, x : pos, y:Huffman.LEAF_DEPTH, depth : 0}
	    nodes.push(nextNode);
            this.cmd("CreateCircle", nextNode.id, nextNode.freq.toString() + "\n" + nextNode.ch,  nextNode.x, nextNode.y);
            this.cmd("SetWidth", nextNode.id, Huffman.WIDTH);
	    this.cmd("SetForegroundColor", nextNode.id, Huffman.FOREGROUND_COLOR)
	    this.cmd("SetBackgroundColor", nextNode.id, Huffman.BACKGROUND_COLOR)
	    pos = pos + Huffman.WIDTH;
	}
    }
   this.cmd("step");

     for (var i = 1; i < nodes.length; i++) {
	    tmp = nodes[i];
	    var j = i-1;
	    while (j >= 0 && nodes[j].freq > tmp.freq) {
		nodes[j+1] = nodes[j];
		j = j - 1;
	    }
	    nodes[j+1] = tmp;
	}
	for (var i = 0; i < nodes.length; i++) {
	    nodes[i].x = i*Huffman.WIDTH + Huffman.NODE_START;
	    this.cmd("Move", nodes[i].id, nodes[i].x, nodes[i].y);
	}
	this.cmd("step");

	    
    

    this.cmd("delete", this.encodedString);
    return this.commands;
}



Huffman.prototype.disableUI = function(event)
{
	this.encodeField.disabled = true;
	this.encodeButton.disabled = true;
}

Huffman.prototype.enableUI = function(event)
{
	this.encodeField.disabled = false;
	this.encodeButton.disabled = false;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new Huffman(animManag, canvas.width, canvas.height);
	
}
