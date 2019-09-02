/*  COMP1720 Assignment 2
*   2019 Sem 2
*   Tim James - u6947396
*/

// variable setup
var backgroundImage;
var taskbar;
var viewer;
var viewerImage;
var viewerSize;
var time;
var date;

function preload() { // preload images
  backgroundImage = loadImage('assets/windows7-wallpaper-def.png');
  taskbar = loadImage('assets/taskbar.png');
  viewerImage = loadImage('assets/window.png');
}

function setup() { 
  // setup canvas dimensions
  wWidth = (16*windowHeight)/9;
  wHeight = windowHeight;
  viewerSize = windowHeight/2,
  createCanvas(wWidth, wHeight);
  document.body.style.overflow = 'hidden';

  // viewer object stores information about the viewer window
  viewer = {
    // position
    x : wHeight/6,
    y : wHeight/6,
    xOffset : 0,
    yOffset : 0,
    // dimensions
    viewerW : viewerSize,
    viewerH : viewerSize,
    // interactive element dimensions
    dragW : viewerSize,
    dragH : viewerSize/12,
    disabledW : viewerSize/5,
    disabledH : viewerSize/12,
    isDragging : false,
    isHovering : false,
    isDisabled : false,
    // checks what the mouse is hovering over
    checkHovering : function() {
      this.isHovering = (mouseX > this.x && mouseX < this.x + this.dragW - this.viewerW*0.25 
        && mouseY > this.y && mouseY < this.y + this.dragH);
      this.isDisabled = (mouseX > this.x + this.viewerW*0.75 && mouseX < this.x + this.dragW 
        && mouseY > this.y && mouseY < this.y + this.dragH);
      return this.isHovering;
    },
    // updates the position of the window
    updatePos : function() {
      var nextPosX = mouseX + this.xOffset;
      var nextPosY = mouseY + this.yOffset;

      if (this.isDragging) {
        if (nextPosX < 0)
          this.x = 0;
        else if (nextPosX > wWidth - this.viewerW)
          this.x = wWidth - this.viewerW;
        else
          this.x = nextPosX;
        
        if (nextPosY < 0)
          this.y = 0;
        else if (nextPosY > wHeight - this.viewerH - (wHeight/14))
          this.y = wHeight - this.viewerH - (wHeight/14);
        else
          this.y = nextPosY;
      }
    }
  };

  // image dimensions
  backgroundImage.resize(wWidth, wHeight);
  taskbar.resize(wWidth, wHeight/14);
  viewerImage.resize(viewer.viewerW,viewer.viewerH);

  // setup
  background(255);
  textSize(wHeight/38);
  textFont('Helvetica');
  noStroke();
  fill(255);
}

function draw() {
  // draw background
  image(backgroundImage, 0, 0);
  image(taskbar, 0, wHeight - (wHeight/14));
  
  // draw time-date text
  var today = new Date();
  time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  text(time, wWidth - (wWidth/13), wHeight - (wHeight/25));
  date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
  text(date, wWidth - (wWidth/13), wHeight - (wHeight/100));

  // check if what the mouse is hovering over
  viewer.checkHovering();
  // if being dragged, update position
  viewer.updatePos();
  
  // changed cursor based on current operation
  if (viewer.isDragging) {
    cursor('grab');
  } else if (viewer.isDisabled) {
    cursor('not-allowed');
  } else if (viewer.isHovering) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
  // draw viewer
  image(viewerImage, viewer.x, viewer.y);
}

function mousePressed() {
  // update viewer offset on valid drag
  if(viewer.checkHovering()) {
    viewer.isDragging = true;
    viewer.xOffset = viewer.x-mouseX;
    viewer.yOffset = viewer.y-mouseY;
  }
}

function mouseReleased() {
  // stop dragging when mouse is released
  viewer.isDragging = false;
}