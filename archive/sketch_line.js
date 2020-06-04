let data;
let input,slider;
let xMax,xMin,yMax,yMin,sMin,sMax;
let canvasW, canvasH;
let margin, textColor;
let easing = 0.05;
let r = 5;
let previousIndex, currentIndex;

function preload(){
  //
  canvasW = 600;
  canvasH = 400;
  margin = 20;
  // load table from the csv file
  data = loadTable('data/line_plot.csv', 'csv');
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
  slider.position(margin*3, canvasH-margin*3.5);
  let sliderW = canvasW-margin*14+'px';
  slider.style('width', sliderW);
  currentIndex = previousIndex = slider.value();
  //
  input = createInput('').attribute('placeholder','X');
  input.position(canvasW-margin*9.5, canvasH-margin*5);
  input.attribute('placeholder',currentIndex+'%');
  //
  sMin = 0; sMax = 1;
  xMin = 0; xMax = 1;
  yMin = 0; yMax = 1;
}

function draw() {
  // draw the background and text
  background(255);
  fill(245);
  noStroke();
  rect(margin*3, margin*5.5,canvasW-margin*6,canvasH - margin*11.5);

  // draw the label
  stroke(0,0,0,50);
  drawVerticalText(16,'% of bad-faith edits predicted as good-faith edits',50,600);
  drawHorizontalText(16,'% of good-faith edits predicted as bad-faith edits',margin*4,canvasH-130);

  // draw all the point
  for (let i = 0; i < 100; i++){
    var x = data.get(i,2);
    var y = data.get(i,1);
    var posX = map(x, xMin, xMax, margin*5, canvasW-margin*5);
    var posY = map(y, yMin, yMax, canvasH - margin*7, margin*7);
    noStroke();
    var text1 = 'Threshold: '+ data.get(i,0)*100+'%';
    var text2 = 'Good-faith edits predicted as bad-faith edits: ' + data.get(i,2)*100+'%';
    var text3 = 'Bad-faith edits predicted as good-faith edits: ' + data.get(i,1)*100 +'%';
    if (i == currentIndex){
      fill(26, 35, 126,255);
      if (r < 15){
        r = r*1.05;
      }
      circle(posX,posY,r);
      // draw label and compose text
      stroke(0,0,0,250);
      fill(0,0,0,250);
      textSize(14);
      // compose text
      if (i == 0){
        drawFirstLabel(i,posX,posY,(canvasH-posY)/2.5,text1,text2,text3);
      } else {
        drawLabel(i,posX,posY,(canvasH-posY)/2.5,text1,text2,text3);
      }
    /*} else if (i == previousIndex) {
      fill(26, 35, 126,175);
      circle(posX,posY,9);
    */
    }else {
      fill(26, 35, 126,125);
      if (mouseX<=posX+5 && mouseX >= posX-5 && mouseY <= posY+5 && mouseY >= posY-5){
        circle(posX,posY,12);
        //
        stroke(0,0,0,150);
        fill(0,0,0,150);
        textSize(14);
        // compose text
        if (i == 0){
          drawFirstLabel(i,posX,posY,(canvasH-posY)/2.5+50,text1,text2,text3);
        } else {
          drawLabel(i,posX,posY,(canvasH-posY)/2.5+70,text1,text2,text3);
        }

      } else {
        circle(posX,posY,5);
      }


    }
  }
  // update slider values
  if (slider.value()!== currentIndex){
    r = 5;
    previousIndex = currentIndex;
    currentIndex = Math.floor(slider.value());
    input.value('');
  }
  currentIndex = slider.value();
  input.attribute('placeholder',currentIndex+'%');
  // draw slider labels
  drawHorizontalText(15,"I don't let any bad edits get by",margin*3, canvasH-margin*4.3);
  drawHorizontalText(15,"I won't falsely accuse any innocent edits",canvasW-margin*24.4, canvasH-margin*4.3);
  drawHorizontalText(16,"0%",margin*3, canvasH-margin*1.7);
  drawHorizontalText(16,"100%",canvasW-margin*13, canvasH-margin*1.7);
}


function keyPressed(){
  if (keyCode === ENTER) {
    currentIndex = input.value();
    slider.value(currentIndex);
  }
}


function drawLabel(i,x,y,l,text1,text2,text3){
  line(x, y-40-l, x, y-20);
  push();
  translate(x+10, y-l-30);
  noStroke();
  text(text1,0,0);
  text(text2,2,19);
  text(text3,2,36);
  pop();
}

function drawFirstLabel(i,x,y,l,text1,text2,text3){
  line(x, y+30+l, x, y+20);
  push();
  translate(x+10, y+l-15);
  noStroke();
  text(text1,0,0);
  text(text2,2,19);
  text(text3,2,36);
  pop();
}

function drawVerticalText(fontsize,string,x,y){
  push();
  translate(x,y);
  rotate(HALF_PI*3);
  fill(0,0,0,125);
  textSize(fontsize);
  text(string,0,0);
  pop();
}

function drawHorizontalText(fontsize,string,x,y){
  push();
  translate(x,y);
  fill(0,0,0,125);
  textSize(fontsize);
  text(string,0,0);
  pop();
}
