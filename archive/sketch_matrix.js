let data;
let input,slider;
let canvasW, canvasH;
let margin, textColor;
let easing = 0.2;
let previousIndex, currentIndex;
let leftX, centerX, rightX, topY, centerY, bottomY;
let points = [];
let radius = 3;
let numPoints = 20;
let index1, index2, index3, index4;
let preIndex1, preIndex2, preIndex3, preIndex4;
let currentV;
let Npoints = 2999;

function preload(){
  //
  canvasW = 600;
  canvasH = 400;
  margin = 20;
  // load table from the csv file
  data = loadTable('data/data.csv', 'csv');
  // get max and min range from the table
}

function setup() {
  // get window height and width, min are 600 x 400
  if(window.innerWidth > 600){
    canvasW = window.innerWidth;}
  if(window.innerHeight > 400){
    canvasH = window.innerHeight;}
  // set canvas
  createCanvas(canvasW, canvasH);
  // set up slider
  slider = createSlider(0, 100, 50);
  slider.position(margin*3, canvasH-margin*4.5);
  let sliderW = canvasW-margin*14+'px';
  slider.style('width', sliderW);
  currentIndex = previousIndex = slider.value();
  //
  currentV = slider.value();
  input = createInput('').attribute('placeholder','X');
  input.position(canvasW-margin*9.5, canvasH-margin*6);
  input.attribute('placeholder',currentV+'%');
  //
  leftX = margin*3;
  centerX = (canvasW)/2;
  rightX = canvasW-margin*3;
  topY = margin*7.5;
  centerY = canvasH/2;
  bottomY = canvasH - margin*7.5;
  numPoints = (centerX - leftX - 40)/radius/2;
  index1=0;index2=0;index3=0;index4=0;
  preIndex1 = preIndex2 = preIndex3 = preIndex4 = 0;
  // initialize all points
  for (var i = 0;i < Npoints; i++){
    var label = data.get(1+i+currentIndex*3000,2);
    var p = new Point(label);
    points.push(p);
  }

}

function draw() {
  // draw the background and text
  background(255);
  fill(240);
  noStroke();
  rect(leftX,topY,centerX-leftX-3,centerY-topY-3);
  rect(leftX,centerY,centerX-leftX-3,centerY-topY-3);
  rect(centerX,topY,centerX-leftX-3,centerY-topY-3);
  rect(centerX,centerY,centerX-leftX-3,centerY-topY-3);

  for (var i = 0;i < Npoints; i++){
    var group = data.get(1+i+currentIndex*3000,3);
    points[i].updatePos();
    points[i].display(group);
  }



  // update slider values
  if (slider.value()!== currentIndex){
    previousIndex = currentIndex;
    currentIndex = slider.value();
    preIndex1 = index1;
    preIndex2 = index2;
    preIndex3 = index3;
    preIndex4 = index4;
    index1 = index2 = index3 = index4 = 0;
    for (var i = 0;i < Npoints; i++){
      var label = data.get(1+i+currentIndex*3000,2);
      points[i].setTarget(label);
    }
    input.value('');
  }
  currentV = slider.value();
  input.attribute('placeholder',currentV+'%');

  var y1 = -15+centerY-radius-radius*2*Math.floor(index1/numPoints);
  var y2 = -15+centerY-radius-radius*2*Math.floor(index3/numPoints);
  var y3 = -15+bottomY-radius-radius*2*Math.floor(index4/numPoints)
  var y4 = -15+bottomY-radius-radius*2*Math.floor(index4/numPoints);
  // 3 true negative | 1 false positive
  drawHorizontalText(16,'Correctly predicted good-faith edits',leftX+20,y1);
  drawHorizontalText(16,'Good-faith edits predicted as bad-faith', centerX+20,y2);
  // 2 false negative | 0 true positive
  drawHorizontalText(16,'Bad-faith edits predicted as good-faith',leftX+20,y3);
  drawHorizontalText(16,'Correctly predicted bad-faith edits',centerX+20,y4);

  if (preIndex1!==0 && preIndex2!==0 && preIndex3!==0&&preIndex4!==0){
      drawChangesLabel();
  }

  drawLegend();
  // draw slider labels
  drawHorizontalText(15,"I don't let any bad edits get by",margin*3, canvasH-margin*5.5);
  drawHorizontalText(15,"I won't falsely accuse any innocent edits",canvasW-margin*24.5, canvasH-margin*5.5);
  drawHorizontalText(16,"0%",margin*3, canvasH-margin*2.5);
  drawHorizontalText(16,"100%",canvasW-margin*13, canvasH-margin*2.5);
}


class Point {
  constructor(label) {
    if (label == 3){
      this.targetX = this.x = leftX+20+(index1%numPoints)*radius*2;
      this.targetY = this.y = -5+centerY-radius-radius*2*Math.floor(index1/numPoints);
      index1++;
    } else if (label == 2) {
      this.targetX = this.x = leftX+20+(index2%numPoints)*radius*2;
      this.targetY = this.y = -5+bottomY-radius-radius*2*Math.floor(index2/numPoints);
      index2++;
    } else if (label == 1){
      this.targetX = this.x = centerX+20+(index3%numPoints)*radius*2;
      this.targetY = this.y = -5+centerY-radius-radius*2*Math.floor(index3/numPoints);
      index3++;
    }else {
      this.targetX = this.x = centerX+20+(index4%numPoints)*radius*2;
      this.targetY = this.y = -5+bottomY-radius-radius*2*Math.floor(index4/numPoints);
      index4++;
    }
  }
  //
  setTarget(label) {
    if (label == 3){
      this.targetX = leftX+20+(index1%numPoints)*radius*2;
      this.targetY = -5+centerY-radius-radius*2*Math.floor(index1/numPoints);
      index1++;
    } else if (label == 2) {
      this.targetX = leftX+20+(index2%numPoints)*radius*2;
      this.targetY = -5+bottomY-radius-radius*2*Math.floor(index2/numPoints);
      index2++;
    } else if (label == 1){
      this.targetX = centerX+20+(index3%numPoints)*radius*2;
      this.targetY = -5+centerY-radius-radius*2*Math.floor(index3/numPoints);
      index3++;
    }else {
      this.targetX = centerX+20+(index4%numPoints)*radius*2;
      this.targetY = -5+bottomY-radius-radius*2*Math.floor(index4/numPoints);
      index4++;
    }
  }
  updatePos(){
    if(this.targetX !== this.x){
      this.dx = this.targetX - this.x;
      this.x += this.dx * easing;
      //this.x = this.targetX;
    }
    if(this.targetY !== this.y){
      this.dy = this.targetY - this.y;
      this.y += this.dy * easing;
      //this.y = this.targetY;
    }
  }
  //
  display(group){
    if(group == 0){
      fill(26, 35, 126,255);
    } else {
      fill(66, 179, 213, 255);
    }
    if (mouseX<=this.x+radius-.5 && mouseX >= this.x-radius-.5 && mouseY <= this.y+radius-.5 && mouseY >= this.y-radius-.5){
      circle(this.x,this.y, 3+radius-.5);
      // draw hover label
      fill(255,255,255,185);
      rect(this.x+radius,this.y,180,30);
      fill(0,0,0,255);
      noStroke();
      textSize(14);
      if (group == 0){
        text('Registered editors group',this.x+radius+5,this.y+20);
      } else {
        text('Unregistered editors group',this.x+radius+5,this.y+20);
      }
    } else {
      circle(this.x,this.y, radius-.5);
    }
  }
}

function keyPressed(){
  if (keyCode === ENTER) {
    currentIndex = input.value();
    console.log(currentIndex);
    slider.value(currentIndex);
  }
}

function drawLegend(){
  fill(26, 35, 126,255);
  circle(margin*4,margin*6.5, radius+.75);
  drawHorizontalText(13,"Registered editors group",margin*4+10,margin*6.7)

  fill(66, 179, 213, 255);
  circle(200+margin*4,margin*6.5, radius+.75);
  drawHorizontalText(13,"Unregistered editors group",200+margin*4+10,margin*6.7)

}

function drawChangesLabel(){
  // draw top left
    var x1 = leftX+275;
    var y1 = -17+centerY-radius-radius*2*Math.floor(index1/numPoints);
    var string1 = preIndex1 - index1;
    drawHorizontalText(14,"("+string1+' edits changed)',x1,y1);
  // draw bottom left
    var x2 = leftX+295;
    var y2 = -17+bottomY-radius-radius*2*Math.floor(index2/numPoints);
    var string2 = preIndex2 - index2;
    drawHorizontalText(14,"("+string2+' edits changed)',x2,y2);
  // draw top right
    var x3 = centerX+295;
    var y3 = -17+centerY-radius-radius*2*Math.floor(index3/numPoints);
    var string3 = preIndex3 - index3;
    drawHorizontalText(14,"("+string3+' edits changed)',x3,y3);
// draw bottom right
    var x4 = centerX+265;
    var y4 = -17+bottomY-radius-radius*2*Math.floor(index4/numPoints);
    var string4 = preIndex4 - index4;
    drawHorizontalText(14,"("+string4+' edits changed)',x4,y4);
}

function drawVerticalText(fontsize,string,x,y){
  push();
  translate(x,y);
  rotate(HALF_PI*3);
  fill(0,0,0,175);
  noStroke();
  textSize(fontsize);
  text(string,0,0);
  pop();
}

function drawHorizontalText(fontsize,string,x,y){
  push();
  translate(x,y);
  fill(0,0,0,200);
  noStroke();
  textSize(fontsize);
  text(string,0,0);
  pop();
}
