let data;
let input,slider;
let canvasW, canvasH;
let margin, textColor;
let easing = 0.05;
let previousIndex, currentIndex;

function preload(){
  //
  canvasW = 600;
  canvasH = 400;
  margin = 20;
  // load table from the csv file
  data = loadTable('data/individual_points_bar.csv', 'csv');
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
  slider.position(margin*3, canvasH-margin*6);
  let sliderW = canvasW-margin*14+'px';
  slider.style('width', sliderW);
  currentIndex = previousIndex = slider.value();
  //
  input = createInput('').attribute('placeholder','X');
  input.position(canvasW-margin*9.5, canvasH-margin*7.5);
  input.attribute('placeholder',currentIndex+'%');
}

function draw() {
  // draw the background and text
  background(255);
  noStroke();

  // draw the label
  var leftX = margin*3;
  var centerX = (canvasW)/2;
  var rightX = canvasW-margin*3;
  var topY = margin*7;
  var centerY = canvasH/2;
  var bottomY = canvasH - margin*7;

  var width = canvasW-margin*6;
  //
  fill(0,0,0,20);
  // A rectangle
  rect(leftX,centerY-100,width, 80);
  rect(leftX,centerY+20,width, 80);


  //
  drawHorizontalText(18,'Correctly predicted good-faith edits',leftX,centerY-115);
  drawHorizontalText(18,'Good-faith edits predicted as bad-faith',canvasW - 375,centerY-115);

  //
  drawHorizontalText(18,'Bad-faith edits predicted as good-faith',leftX,centerY+125);
  drawHorizontalText(18,'Correctly predicted bad-faith edits',canvasW - 350,centerY+125);

  //
  var pW1 = map(data.get(previousIndex,1), 0, 1, 0, width);
  var pW2 = map(data.get(previousIndex,3), 0, 1, 0, width);
  var pW3 = map(data.get(previousIndex,5), 0, 1, 0, width);
  var pW4 = map(data.get(previousIndex,7), 0, 1, 0, width);

  // need to modify here
  var w1 = map(data.get(currentIndex,1), 0, 1, 0, width);
  var w2 = map(data.get(currentIndex,3), 0, 1, 0, width);
  var w3 = map(data.get(currentIndex,5), 0, 1, 0, width);
  var w4 = map(data.get(currentIndex,7), 0, 1, 0, width);

  //
  var w1g0 = data.get(currentIndex,2);
  var w2g0 = data.get(currentIndex,4);
  var w3g0 = data.get(currentIndex,6);
  var w4g0 = data.get(currentIndex,8);

  // need to modify here
  fill(66,179,213,255);
  // A rectangle
  rect(leftX,centerY-100,w4, 80);
  rect(rightX-w1,centerY+20,w1, 80);

  // draw different groups
  fill(26, 35, 126,255);
  rect(leftX,centerY-100,w4*w4g0, 80);
  rect(leftX+w3,centerY+20,w1*w1g0, 80);
  //
  fill(0,0,0,50);
  rect(leftX+w4,centerY-100,w2*w2g0, 80);
  rect(leftX,centerY+20,w3*w3g0, 80);

  // draw labels for numbers
  var data1 = Number.parseFloat(data.get(currentIndex,1)).toFixed(3);
  var pData1 = Number.parseFloat(data.get(previousIndex,1)).toFixed(3)
  var data2 = Number.parseFloat(data.get(currentIndex,3)).toFixed(3);
  var pData2 = Number.parseFloat(data.get(previousIndex,3)).toFixed(3);
  var data3 = Number.parseFloat(data.get(currentIndex,5)).toFixed(3);
  var pData3 = Number.parseFloat(data.get(previousIndex,5)).toFixed(3);
  var data4 = Number.parseFloat(data.get(currentIndex,7)).toFixed(3);
  var pData4 = Number.parseFloat(data.get(previousIndex,7)).toFixed(3);
  //
  drawLabel(leftX,centerY-145,data4,pData4);
  drawLabel(canvasW - 200,centerY-145,data2,pData2);
  //
  drawLabel(leftX,centerY+155,data3,pData3);
  drawLabel(canvasW - 200,centerY+155,data1,pData1);

  // update slider values
  if (slider.value()!== currentIndex){
    previousIndex = currentIndex;
    currentIndex = slider.value();
    input.value('');
  }

  input.attribute('placeholder',currentIndex+'%');

  drawLegend();

  // draw slider labels
  drawHorizontalText(15,"I don't let any bad edits get by",margin*3, canvasH-margin*7);
  drawHorizontalText(15,"I won't falsely accuse any innocent edits",canvasW-margin*24.4, canvasH-margin*7);
  drawHorizontalText(16,"0%",margin*3, canvasH-margin*4);
  drawHorizontalText(16,"100%",canvasW-margin*13, canvasH-margin*4);

  // hover

}

function keyPressed(){
  if (keyCode === ENTER) {
    currentIndex = input.value();
    slider.value(currentIndex);
  }
}

function drawLegend(){
  fill(26, 35, 126,255);
  rect(margin*3.2,margin*6.5,10,10);
  fill(0,0,0,70);
  rect(margin*3.2+10,margin*6.5,10,10);
  drawHorizontalText(13,"Registered editors group",margin*4+10,margin*6.9)

  fill(66,179,213,255);
  rect(margin*3.2+250,margin*6.5,10,10);
  fill(0,0,0,20);
  rect(margin*3.2+260,margin*6.5,10,10);
  drawHorizontalText(13,"Unregistered editors group",margin*4+260,margin*6.9)
}

function drawLabel(x,y,data1,data2){
  var value = Number.parseFloat(data1-data2).toFixed(3);
  push();
  translate(x,y);
  fill(0,0,0,200);
  var text1 = data1*100 + '%';
  var text2 = '('+ value +')';
  textSize(24);
  text(text1,0,0);
  textSize(18);
  text(text2,textWidth(text1)+25,0);
  pop();
}

function drawHorizontalText(fontsize,string,x,y){
  fill(0,0,0,175);
  push();
  translate(x,y);
  textSize(fontsize);
  text(string,0,0);
  pop();
}
