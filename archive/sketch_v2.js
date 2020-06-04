var data0, data1, data2, disparity;
var sliderT, sliderlambda0, sliderlambda1;
var checkboxT1, checkboxT2;
var radio;
var buttonData, buttonScenario;
var canvasW, canvasH, margin;
var controlW, controlH;
var dataCanvasW, dataCanvasH;
var leftX, centerX, rightX, topY, centerY, bottomY;
var leftcenterX, rightCenterX;
var currentType = 0;
var currentThreshold = 0;
var currentlambda0 = 0;
var currentlambda1 = 0;
var radius = 3.25;
var columnPoints;
var view = 0;

var scenario1header, scenario1content, scenario2header,scneario2content, scenario3header, scenario3content;

var thresholdLabel;
var disparityLabel;
var thresholdMin, thresholdMax;
var dfn1Min, dfn1Max, dfn2Min, dfn2Max;

var currentSummary;

// define colors
var controlText, controlBackground, mainText;
var mainBlue, secondBlue, mainPink, secondPink;

var lambda0, lambda1;

function preload(){
  //
  canvasW = 600;
  controlW = 350;
  canvasH = controlH = 600;
  margin = 20;
  // load table from the csv file
  data0 = loadTable('data/non_normalized_2tradeoffs_t0.csv', 'csv');
  data1 = loadTable('data/non_normalized_2tradeoffs_t1.csv', 'csv');
  data2 = loadTable('data/non_normalized_2tradeoffs_t2.csv', 'csv');
  // set up lambda range
  lambda0 = {};
  lambda0.min = 0;
  lambda0.max = 1;
  lambda0.step = 0.025;
  lambda0.range = Math.floor((lambda0.max-lambda0.min)/lambda0.step);
  lambda1 = {};
  lambda1.min = 0;
  lambda1.max = 2;
  lambda1.step = 0.05;
  lambda1.range = Math.floor((lambda1.max-lambda1.min)/lambda1.step);
  console.log(lambda0,lambda1);
}

function setup() {
  // get window height and width, min are 600 x 400
  if(window.innerWidth > 600){
    canvasW = window.innerWidth;}
  if(window.innerHeight > 600){
    canvasH = controlH = window.innerHeight;}
  createCanvas(canvasW, canvasH);
  //
  dataCanvasW = canvasW - margin*4 - controlW;
  datacanvasH = canvasH - 150 - margin*2;
  leftX = controlW + margin*2;
  centerX = leftX + dataCanvasW/2;
  rightX = canvasW - margin*2;
  topY = 140;
  centerY = topY + datacanvasH/2;
  bottomY = canvasH - margin*2;
  leftCenterX = leftX + dataCanvasW/4 - margin;
  rightCenterX = centerX + dataCanvasW/4 - margin;
  columnPoints = Math.floor((bottomY - centerY - 30)/radius/2);

  // setup slider
  var sliderW = 350 +'px';
  sliderT = createSlider(0, 40, 20, 1);
  sliderT.position(20,160);
  sliderT.id("thresholdSlider");
  sliderlambda0 = createSlider(0, lambda0.range, lambda0.range/2, 1);
  sliderlambda0.position(20,490);
  sliderlambda0.id("lambda0Slider");
  //
  sliderlambda1 = createSlider(0, lambda1.range, 10, 1);
  sliderlambda1.position(20,615);
  sliderlambda1.id("lambda1Slider");
  //
  checkboxT1 = createCheckbox('   Race ( Caucasian / African American )', false);
  checkboxT1.changed(checkboxT1Event);
  checkboxT1.position(20,340);

  checkboxT2 = createCheckbox('   Gender ( Female / Male )', false);
  checkboxT2.changed(checkboxT2Event);
  checkboxT2.position(20,360);
  //
  //
  thresholdLabel = createDiv('');
  thresholdLabel.addClass('slider-label');
  disparityLabel = createDiv('');
  disparityLabel.addClass('slider-label');
  //
  thresholdMin = createDiv('');
  thresholdMin.addClass('slider-range-left');
  thresholdMax = createDiv('');
  thresholdMax.addClass('slider-range-right');
  dfn1Min = createDiv('');
  dfn1Min.addClass('slider-range-left');
  dfn1Max = createDiv('');
  dfn1Max.addClass('slider-range-right');
  dfn2Min = createDiv('');
  dfn2Min.addClass('slider-range-left');
  dfn2Max = createDiv('');
  dfn2Max.addClass('slider-range-right');
  //
  sliderT.parent("control-panel");
  sliderlambda0.parent("control-panel");
  sliderlambda1.parent("control-panel");
  checkboxT1.parent("control-panel");
  checkboxT2.parent("control-panel");
  thresholdLabel.parent("control-panel");
  disparityLabel.parent("control-panel");
  thresholdMax.parent("control-panel");
  thresholdMin.parent("control-panel");
  dfn1Min.parent("control-panel");
  dfn1Max.parent("control-panel");
  dfn2Min.parent("control-panel");
  dfn2Max.parent("control-panel");
  //
  buttonData = createButton('Data View');
  buttonData.position(leftX-20, 20);
  buttonData.mousePressed(buttonDataEvent);
  buttonData.addClass('active');

  buttonScenario = createButton('Scenario View');
  buttonScenario.position(buttonData.x+110, 20);
  buttonScenario.mousePressed(buttonScenarioEvent);
  //
  buttonData.parent("view-toggle");
  buttonScenario.parent("view-toggle");
  //
  currentSummary = createDiv('');
  currentSummary.addClass('data-summary');

  //
  scenario1header = createDiv('');
  scenario1header.addClass('scenario-header');
  scenario1content = createDiv('');
  scenario1content.addClass('scenario-content');
  scenario2header = createDiv('');
  scenario2header.addClass('scenario-header');
  scenario2content = createDiv('');
  scenario2content.addClass('scenario-content');
  scenario3header = createDiv('');
  scenario3header.addClass('scenario-header');
  scenario3content = createDiv('');
  scenario3content.addClass('scenario-content');
  //
  controlView();

  currentThreshold = selectedThreshold(sliderT.value());
  currentlambda0 = selectedlambda0(sliderlambda0.value());
  currentlambda1 = selectedlambda1(sliderlambda1.value());
  //
  controlText = color(255,255,255,255);
  controlBackground = color(35,35,35,255);
  mainText = color(35,35,35,255);
  mainBlue = color(3,54,255,255);
  secondBlue = color(3,54,255,125);
  mainPink = color(255,2,102,255);
  secondPink = color(255,2,102,100);
  //
}

function draw() {
  // retrieve current select values
  controlView();

  if(currentType == 0){
    disparityLabel.hide();
    document.getElementById("disparity-instruction").style.display = "none";
    document.getElementById("disparity-label-1").style.display = "none";
    document.getElementById("disparity-label-2").style.display = "none";
    document.getElementById("disparity-label-3").style.display = "none";
    document.getElementById("disparity-label-4").style.display = "none";

  } else if (currentType == 1) {
    disparityLabel.show();
    document.getElementById("disparity-instruction").style.display = "block";
    document.getElementById("disparity-label-1").style.display = "block";
    document.getElementById("disparity-label-2").style.display = "block";
    document.getElementById("disparity-label-3").style.display = "block";
    document.getElementById("disparity-label-4").style.display = "block";
    document.getElementById("disparity-label-1").innerHTML = "Minimize error rate"; //AA
    document.getElementById("disparity-label-2").innerHTML = "Minimize disparity"; // Caucasian
    document.getElementById("disparity-label-3").innerHTML = "Minimize disparity of false positives";
    document.getElementById("disparity-label-4").innerHTML = "Minimize disparity of false negatives";
  }else{
    disparityLabel.show();
    document.getElementById("disparity-instruction").style.display = "block";
    document.getElementById("disparity-label-1").style.display = "block";
    document.getElementById("disparity-label-2").style.display = "block";
    document.getElementById("disparity-label-3").style.display = "block";
    document.getElementById("disparity-label-4").style.display = "block";
    document.getElementById("disparity-label-1").innerHTML = "Minimize error rate";
    document.getElementById("disparity-label-2").innerHTML = "Minimize disparity";
    document.getElementById("disparity-label-3").innerHTML = "Minimize disparity of false positives";
    document.getElementById("disparity-label-4").innerHTML = "Minimize disparity of false negatives";
  }

  fill(255);
  noStroke();
  rect(controlW,0,canvasW-controlW,canvasH);
  if (view == 0){
    // hide
    toggleScenario();
    // draw data panel
    stroke(225);
    strokeWeight(1);
    line(leftX,centerY,rightX,centerY);
    line(centerX,topY,centerX,bottomY);
    noStroke();
  //
    updateView();
    //
    var index = findData(currentType,currentlambda0,currentlambda1,currentThreshold);
    var data = readData(currentType,index);

    drawData(currentType,data);
    // draw summary
    var text = "False-positive rate: "+Math.floor(data.fpr*10000)/100+"% &nbsp;&nbsp;&nbsp;&nbsp;False-negative rate: "+Math.floor(data.fnr*10000)/100 + "% &nbsp;&nbsp;&nbsp;&nbsp;Error rate: "+Math.floor(data.error*10000)/100+"%";
    currentSummary.html(text);
    currentSummary.show();
    currentSummary.position(390,75);
    //
    // draw panel label
    var dy = 2*radius*columnPoints/2 - 60;
    drawAreaLabelLeft(leftX,topY+dy, mainBlue, "TRUE POSITIVE","Defendants who are predicted to recommit actually do relapse into criminal behavior");
    drawAreaLabelLeft(leftX,centerY+dy, mainPink, "FALSE POSITIVE","Defendants who are predicted to recommit do not relapse into criminal behavior");
    //
    drawAreaLabelRight(rightX-130,topY+dy, mainPink, "FALSE NEGATIVE","Defendants who are predicted not to recommit actually do relapse into criminal behavior");
    drawAreaLabelRight(rightX-130,centerY+dy, mainBlue, "TRUE NEGATIVE","Defendants who are predicted not to recommit do not relapse into criminal behavior");
    //

  } else {
    toggleScenario();
    currentSummary.hide();
    // draw scenario
    var index = findData(currentType,currentlambda0,currentlambda1,currentThreshold);
    var data = readData(currentType,index);

    updateView();
    drawScenario(data);
  }
}


function toggleScenario(){
  if (view == 0){
    scenario1content.hide();
    scenario2content.hide();
    scenario3content.hide();
    scenario1header.hide();
    scenario2header.hide();
    scenario3header.hide();
  } else {
    scenario1content.show();
    scenario2content.show();
    scenario3content.show();
    scenario1header.show();
    scenario2header.show();
    scenario3header.show();
  }
}

function updateView(){
  //
  if (currentThreshold !== selectedThreshold(sliderT.value())){
    currentThreshold = selectedThreshold(sliderT.value());
  }
  //
  if (currentType == 1 || currentType == 2){
    if (currentlambda0 !== selectedlambda0(sliderlambda0.value())){
      currentlambda0 = selectedlambda0(sliderlambda0.value());
    }
    if (currentlambda1 !== selectedlambda1(sliderlambda1.value())){
      currentlambda1 = selectedlambda1(sliderlambda1.value());
    }
  }
}

function drawScenario(data){
  fill(255);
  noStroke();
  rect(controlW,0,canvasW-controlW,canvasH);
  if (currentType == 0){
    stroke(0,0,0,50);
    line(450, 100, canvasW - margin*6 , 100);
    constructScenario(450,120,data);
  } else {
    stroke(0,0,0,50);
    line(450, 100, canvasW - margin*6 , 100);
    constructScenario(450,120,data);

  }
}


function constructScenario(x,y,data){
  //
  scenario2header.html('Scneario Two <br> (Algorithm Decision)')
  scenario2header.position(x,y);
  // compose data
  var content = 0;
  if(currentType == 0){
    // content = "Overall, among 3,959 defendants in the dataset, <strong>" + Math.floor(data.error*10000)/100 + "%</strong> of the defendants are predicted incorrectly. “Incorrect predictions” mean that those who are <strong>incorrectly predicted</strong> to recommit or not to recommit. <br><br>";
    content = "Overall, among 3,959 defendants, <strong>prediction errors</strong>is"+ Math.floor(data.fpa0+data.fpa1+data.fna0+data.fna1) " which is the number of <strong>incorrectly predicted</strong> defendants, i.e., defendants who are incorrectly predicted to re-offend or not to re-offend.<br><br>"
    //
    content = content + "Of all the defendants who <strong>do not</strong> relapse into criminal behavior, <strong>" + Math.floor(data.fpr*10000)/100 + "%</strong> of them are <strong>predicted to</strong> recommit.<br>";
    content = content + data.tpa0 + " defendants who are <strong>predicted to</strong> recommit <strong>do</strong> relapse into criminal behavior.<br>";
    content = content + data.fpa0 + " defendants who are <strong>predicted to</strong> recommit <strong>do not</strong> relapse into criminal behavior.<br><br>";
    //
    content = content + "Of all the defendants who <strong>do</strong> relapse into criminal behavior, <strong>" + Math.floor(data.fnr*10000)/100 + "%</strong> of them are <strong>predicted not to</strong> recommit.<br>";
    content = content + data.fna0 + " defendants who are <strong>predicted not to</strong> recommit <strong>do</strong> relapse into criminal behavior.<br>";
    content = content + data.tna0 + " defendants who are <strong>predicted not to</strong> recommit <strong>do not</strong> relapse into criminal behavior.<br><br>";
    scenario2content.html(content);
    scenario2content.position(x+300,y);
  } else if (currentType == 1) {
    var data1 = (data.fpa0+data.fpa1)/(data.fpa0+data.tna0+data.fpa1+data.tna1);
    //console.log(data1);
    //data1 = Math.floor(data1*10000)/100;
    data1 = data1*100;
    data1 = Math.floor(data.fpr*100000)/1000;

    var data11 = parseInt(data.tpa0)+parseInt(data.tpa1);
    var data12 = parseInt(data.fpa0)+parseInt(data.fpa1);
    var data2 = (data.fna0+data.fpa1)/(data.fna0+data.tpa0+data.fna1+data.tpa1);
    //data2 = Math.floor(data2*10000)/100;
    data2 = data2*100;
    data2 = Math.floor(data.fnr*100000)/1000;
    var data20 = data.fna0 / (data.fna0+data.tpa0); data20 = Math.floor(data20*100000)/1000;
    var data21 = parseInt(data.fna0)+parseInt(data.fna1);
    var data22 = parseInt(data.tna0)+parseInt(data.tna1);
    //
    // content = "Overall, among 5,099 defendants in the dataset, <strong>" + Math.floor(data.error*10000)/100 + "%</strong> of the defendants are predicted incorrectly. “Incorrect predictions” mean that those who are <strong>incorrectly predicted</strong> to recommit or not to recommit.<br><br>";
    content = "Overall, among 3,959 defendants, <strong>prediction errors</strong>is"+ Math.floor(data.fpa0+data.fpa1+data.fna0+data.fna1) " which is the number of <strong>incorrectly predicted</strong> defendants, i.e., defendants who are incorrectly predicted to re-offend or not to re-offend.<br><br>"
    //
    content = content + "Of all the defendants who <strong>do not</strong> relapse into criminal behavior, <strong>" + data1 + "%</strong> of them are <strong>predicted to</strong> recommit.<br>";
    content = content + "<strong>"+ data11 + "</strong> defendants who are <strong>predicted to</strong> recommit <strong>do</strong> relapse into criminal behavior. "+ data.tpa0 + " of them are African American. <br>";
    content = content + data12 + " defendants who are <strong>predicted to</strong> recommit <strong>do not</strong> relapse into criminal behavior. "+ data.fpa0 + " of them are African American.<br>";
    //
    content = content + "The disparity between African American and Caucasian is <strong>" + Math.abs(data.fpa1 - data.fpa0)+ "</strong>.<br><br>";
    //
    content = content + "Of all the defendants who <strong>do</strong> relapse into criminal behavior, <strong>" +data2 + "%</strong> of them are <strong>predicted not to</strong> recommit.<br>";
    content = content + data21 + " defendants who are <strong>predicted not to</strong> recommit <strong>do</strong> relapse into criminal behavior. "+ data.fna0 + " of them are African American. <br>";
    content = content + data22 + " defendants who are <strong>predicted not to</strong> recommit <strong>do not</strong> relapse into criminal behavior. "+ data.tna0 + " of them are African American. <br><br>";
    //
    content = content + "The disparity between African American and Caucasian is <strong>" + Math.abs(data.fna1 - data.fna0)+ "</strong>.";
    //
    scenario2content.html(content);
    scenario2content.position(x+300,y);
    stroke(0,0,0,50);
    line(x, y+610, canvasW - margin*6 , y+610);
  } else {
    var data1 = (data.fpa0+data.fpa1)/(data.fpa0+data.tna0+data.fpa1+data.tna1);
    //data1 = Math.floor(data1*10000)/100;
    data1 = data1*100;
    data1 = Math.floor(data.fpr*100000)/1000;

    var data11 = parseInt(data.tpa0)+parseInt(data.tpa1);
    var data12 = parseInt(data.fpa0)+parseInt(data.fpa1);
    var data2 = (data.fna0+data.fpa1)/(data.fna0+data.tpa0+data.fna1+data.tpa1);
    //data2 = Math.floor(data2*10000)/100;
    data2 = data2*100;
    data2 = Math.floor(data.fnr*100000)/1000;
    var data20 = data.fna0 / (data.fna0+data.tpa0); data20 = Math.floor(data20*100000)/1000;
    var data21 = parseInt(data.fna0)+parseInt(data.fna1);
    var data22 = parseInt(data.tna0)+parseInt(data.tna1);
    //
    // content = "Overall, among 5,099 defendants in the dataset, <strong>" + Math.floor(10000-data.accuracy*10000)/100 + "%</strong> of the defendants are predicted incorrectly. “Incorrect predictions” mean that those who are <strong>incorrectly predicted</strong> to recommit or not to recommit.<br><br>";
    content = "Overall, among 3,959 defendants, <strong>prediction errors</strong>is"+ Math.floor(data.fpa0+data.fpa1+data.fna0+data.fna1) " which is the number of <strong>incorrectly predicted</strong> defendants, i.e., defendants who are incorrectly predicted to re-offend or not to re-offend.<br><br>"
    //
    content = content + "Of all the defendants who <strong>do not</strong> relapse into criminal behavior, <strong>" + data1 + "%</strong> of them are <strong>predicted to</strong> recommit.<br>";
    content = content + data11 + " defendants who are <strong>predicted to</strong> recommit <strong>do</strong> relapse into criminal behavior. "+ data.tpa0 + " of them are male. <br>";
    content = content + data12 + " defendants who are <strong>predicted to</strong> recommit <strong>do not</strong> relapse into criminal behavior. "+ data.fpa0 + " of them are male. <br>";

    content = content + "The disparity between female and male is <strong>" +Math.abs(data.fpa1 - data.fpa0)+ "</strong>.<br><br>";
    //
    content = content + "Of all the defendants who <strong>do</strong> relapse into criminal behavior, <strong>" +data2 + "%</strong> of them are <strong>predicted not to</strong> recommit.<br>";
    content = content + data21 + " defendants who are <strong>predicted not to</strong> recommit <strong>do</strong> relapse into criminal behavior. "+ data.fna0 + " of them are male. <br>";
    content = content + data22 + " defendants who are <strong>predicted not to</strong> recommit <strong>do not</strong> relapse into criminal behavior. "+ data.tna0 + " of them are male. <br>";
    //
    content = content + "The disparity between female and male is <strong>" +Math.abs(data.fna1 - data.fna0) + "</strong>.";
    //
    scenario2content.html(content);
    scenario2content.position(x+300,y);
  }
}

function drawData(type,data){
  if(type == 0){
    drawPoints(centerX,centerY,0,columnPoints,data.tpa0, data.tpa1);
    drawPoints(centerX,centerY,3,columnPoints,data.tna0, data.tna1);
    drawPoints(centerX,centerY,1,columnPoints,data.fna0, data.fna1);
    drawPoints(centerX,centerY,2,columnPoints,data.fpa0, data.fpa1);
    //
    drawLabel(centerX-10,topY-12,0,columnPoints,data.tpa0, data.tpa1);
    drawLabel(centerX+10,bottomY,3,columnPoints,data.tna0, data.tna1);
    drawLabel(centerX+10,topY-12,1,columnPoints,data.fna0, data.fna1);
    drawLabel(centerX-10,bottomY,2,columnPoints,data.fpa0, data.fpa1);
  } else if(type == 1){
    drawPoints(centerX,centerY,0,columnPoints,data.tpa0, data.tpa1);
    drawPoints(centerX,centerY,3,columnPoints,data.tna0, data.tna1);
    drawPoints(centerX,centerY,1,columnPoints,data.fna0, data.fna1);
    drawPoints(centerX,centerY,2,columnPoints,data.fpa0, data.fpa1);
    //
    drawLabel(centerX-10,topY-12,0,columnPoints,data.tpa0, data.tpa1);
    drawLabel(centerX+10,bottomY,3,columnPoints,data.tna0, data.tna1);
    drawLabel(centerX+10,topY-12,1,columnPoints,data.fna0, data.fna1);
    drawLabel(centerX-10,bottomY,2,columnPoints,data.fpa0, data.fpa1);
  } else {
    drawPoints(centerX,centerY,0,columnPoints,data.tpa0, data.tpa1);
    drawPoints(centerX,centerY,3,columnPoints,data.tna0, data.tna1);
    drawPoints(centerX,centerY,1,columnPoints,data.fna0, data.fna1);
    drawPoints(centerX,centerY,2,columnPoints,data.fpa0, data.fpa1);
    //
    drawLabel(centerX-10,topY-12,0,columnPoints,data.tpa0, data.tpa1);
    drawLabel(centerX+10,bottomY,3,columnPoints,data.tna0, data.tna1);
    drawLabel(centerX+10,topY-12,1,columnPoints,data.fna0, data.fna1);
    drawLabel(centerX-10,bottomY,2,columnPoints,data.fpa0, data.fpa1);
  }
}

function drawPoints(initx,inity,area,columnMax,points1,points2){
  var totalpoints = parseInt(points1,10)+parseInt(points2,10);
  for(var i = 0; i < totalpoints; i++){
    var x, y;
    if (area == 0){
      x = initx - 7 - radius*2*Math.floor(i/columnMax);
      y = inity - 7 - (i%columnMax)*radius*2
    } else if (area == 1){
      x = initx + 7 + radius*2*Math.floor(i/columnMax);
      y = inity - 7 - (i%columnMax)*radius*2
    } else if (area == 2){
      x = initx - 7 - radius*2*Math.floor(i/columnMax);
      y = inity + 7 + (i%columnMax)*radius*2
    } else {
      x = initx + 7 + radius*2*Math.floor(i/columnMax);
      y = inity + 7 + (i%columnMax)*radius*2
    }
    if (i < points1){
      if(area == 0 || area == 3){
        fill(mainBlue);
      }else {
        fill(mainPink);
      }
    } else{
      if(area == 0 || area == 3){
        fill(secondBlue);
      }else {
        fill(secondPink);
      }
    }
    circle(x,y,radius-.5);
  }
}

function numDigits(number){
  var digits = 0;
  if(number == 0){
    digits = 1;
  }
  while (number > 0) {
    number = Math.floor(number/10);
    digits ++;
  }
  return digits;
}

function drawLabel(initx,inity,area,columnMax,points1,points2){
  var totalpoints = parseInt(points1,10)+parseInt(points2,10);
  var x0,x1,y;
  if (currentType == 0){
    if (area == 0){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      y = inity + 13;
    }else if (area == 1) {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(points1)*8;
      y = inity + 13;
    }else if(area == 2){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      y = inity - 13;
    }else {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(points1)*8;
      y = inity - 13;
    }
    push();
    translate(x1,y);
    fill(mainText);
    noStroke();
    textSize(18);
    textStyle(BOLD);
    text(points1,0,0);
    textSize(12);
    textStyle(NORMAL);
    text("DEFENDANTS",0,14);
    pop();
  } else if (currentType == 1) {
    var t1,t2;
    if (area == 0){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      x0 = radius*2*Math.ceil(points2/columnMax)+30;
      y = inity + 13;
      t1 = points2 + "  /  " + points1;
      t2 = "CAUCASIAN / AFRICAN AMERICAN";
    }else if (area == 1) {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*8;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity + 13;
      t1 = points1 + " / " + points2;
      t2 = "AFRICAN AMERICAN / CAUCASIAN";
    }else if(area == 2){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      x0 = radius*2*Math.ceil(points2/columnMax)+30;
      y = inity - 13;
      t1 = points2 + " / " + points1;
      t2 = "CAUCASIAN / AFRICAN AMERICAN";
    }else {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*8;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity - 13;
      t1 = points1 + " / " + points2;
      t2 = "AFRICAN AMERICAN / CAUCASIAN";
    }
    push();
    translate(x1,y);
    fill(mainText);
    noStroke();
    textSize(18);
    textStyle(BOLD);
    text(t1,0,0);
    textSize(11);
    textStyle(NORMAL);
    text(t2,0,13);
    pop();
  } else {
    var t1,t2;
    if (area == 0){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      x0 = radius*2*Math.ceil(points2/columnMax)+30;
      y = inity + 13;
      t1 = points2 + "  /  " + points1;
      t2 = "FEMALE / MALE";
    }else if (area == 1) {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*10;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity + 13;
      t1 = points1 + " / " + points2;
      t2 = "MALE / FEMALE";
    }else if(area == 2){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      x0 = radius*2*Math.ceil(points2/columnMax)+30;
      y = inity - 13;
      t1 = points2 + " / " + points1;
      t2 = "FEMALE / MALE";
    }else {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*10;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity - 13;
      t1 = points1 + " / " + points2;
      t2 = "MALE / FEMALE";
    }
    push();
    translate(x1,y);
    fill(mainText);
    noStroke();
    textSize(18);
    textStyle(BOLD);
    text(t1,0,0);
    textSize(11);
    textStyle(NORMAL);
    text(t2,0,13);
    pop();
  }

}

function drawAreaLabelLeft(x,y,c,text1,text2){
  fill(255,255,255,150);
  rect(x-5,y-5,140,130);
  fill(c);
  noStroke();
  rect(x,y,130,25);
  fill(255,255,255);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  text(text1,x+7,y+17.5);
  fill(35,35,35,200);
  noStroke();
  textSize(12);
  textStyle(NORMAL);
  text(text2,x+7,y+32,120,300);
}

function drawAreaLabelRight(x,y,c,text1,text2){
  fill(255,255,255,150);
  rect(x-5,y-5,140,130);
  fill(c);
  noStroke();
  rect(x,y,130,25);
  fill(255,255,255);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  text(text1,x+6,y+17.5);
  fill(35,35,35,200);
  noStroke();
  textSize(12);
  textStyle(NORMAL);
  textAlign(RIGHT);
  text(text2,x+3,y+32,120,300);
  textAlign(LEFT);
}




function checkboxT1Event() {
  if (this.checked()) {
    currentType = 1;
    checkboxT2.checked(false)
    console.log('Type 1');
  } else {
    currentType = 0;
  }
}

function checkboxT2Event() {
  if (this.checked()) {
    currentType = 2;
    console.log('Type 2');
    checkboxT1.checked(false)
  } else {
    currentType = 0;
  }
}

function buttonDataEvent(){
  this.addClass('active');
  buttonScenario.removeClass('active');
  view = 0;
}

function buttonScenarioEvent(){
  this.addClass('active');
  buttonData.removeClass('active');
  view = 1;
}

function controlView(){
  if (currentType == 0){
    sliderlambda0.hide();
    sliderlambda1.hide();
  } else if (currentType == 1) {
    sliderlambda0.show();
    sliderlambda1.show();
  } else {
    sliderlambda0.show();
    sliderlambda1.show();
  }
}

function selectedlambda0(value) {
  var lambda = lambda0.min + lambda0.step*value;
  return lambda;
}

function selectedlambda1(value) {

  var lambda = lambda1.min + lambda1.step*value;
  return lambda;
}

function selectedThreshold(value) {
  var threshold = 0 + 0.025*value;
  return threshold;
}


function findData(type,l0,l1,threshold){
  var index = 0;
  if (currentType == 0) {
    index = Math.floor(threshold/0.025);
  } else {
    index = (41)*(lambda1.range+1)*Math.floor((l0)/lambda0.step)+(41)*Math.floor((l1)/lambda1.step)+Math.floor(threshold/0.025);
  }
  return index;
}

function readData(type, index) {
  var table;
  if (type == 0) {
    table = data0;
  } else if (type == 1) {
    table = data1;
  } else { table = data2;}
  //
  var lambda0 = table.get(index,0);
  var lambda1 = table.get(index,1);
  var threshold = table.get(index,2);
  var disp = table.get(index,3);
  var error = table.get(index,4);
  var precision = table.get(index,5);
  var recall = table.get(index,6);
  var fpr = table.get(index,7);
  var fnr = table.get(index,8);
  var accuracy = table.get(index,9);
  var tpa0  = table.get(index,10);
  var tpa1 = table.get(index,11);
  var fpa0 = table.get(index,12);
  var fpa1 = table.get(index,13);
  var fna0 = table.get(index,14);
  var fna1 = table.get(index,15);
  var tna0 = table.get(index,16);
  var tna1 = table.get(index,17);
  //
  var data = {};
  data.lamba1 = lambda0;
  data.lambda1 = lambda1;
  data.threshold = threshold;
  data.disp = disp;
  data.error = error;
  data.precision = precision;
  data.recall = recall;
  data.fpr = fpr;
  data.fnr = fnr;
  data.accuracy = accuracy;
  data.tpa0 = tpa0;
  data.tpa1 = tpa1;
  data.fpa0 = fpa0;
  data.fpa1 = fpa1;
  data.fna0 = fna0;
  data.fna1 = fna1;
  data.tna0 = tna0;
  data.tna1 = tna1;
  return data;
}
