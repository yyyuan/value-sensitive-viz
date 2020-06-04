var data0, data1, data2, disparity;
var sliderT, sliderError1, sliderError2;
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
var currentError = 0;
var currentIndex = 0;
var radius = 3;
var columnPoints;
var moreSliders = false;
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

var thresholdRange1, thresholdRange2;
var errorRange1, errorRange2;
var disparityRange1, disparityRange2;
var xRange, yRange;

function preload(){
  //
  canvasW = 800;
  controlW = 350;
  canvasH = controlH = 600;
  margin = 20;
  // load table from the csv file
  data0 = loadTable('data/curve_t0.csv', 'csv');
  data1 = loadTable('data/pareto_range1_t1.csv', 'csv');
  data2 = loadTable('data/pareto_range1_t2.csv', 'csv');

  error1 = loadTable('data/pareto_steps_range1_t1.csv', 'csv');
  error2 = loadTable('data/pareto_steps_range1_t2.csv', 'csv');
  //

}

function setup() {
  // get window height and width, min are 600 x 400
  if(window.innerWidth > 800){
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
  sliderT = createSlider(1, 40, 20, 1);
  sliderT.position(20,165);
  sliderT.id("thresholdSlider");
  sliderError1 = createSlider(1, 10, 5, 1);
  sliderError1.position(20,630);
  sliderError1.id("type1dfnSlider");
  //
  sliderError2 = createSlider(1, 10, 5, 1);
  sliderError2.position(20,630);
  sliderError2.id("type2dfnSlider");
  //
  checkboxT1 = createCheckbox('   Race ( African / White American )', false);
  checkboxT1.changed(checkboxT1Event);
  checkboxT1.position(20,320);

  checkboxT2 = createCheckbox('   Gender ( Female / Male )', false);
  checkboxT2.changed(checkboxT2Event);
  checkboxT2.position(20,340);
  checkboxT2.hide();
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
  sliderError1.parent("control-panel");
  sliderError2.parent("control-panel");
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
  updateControl();

  currentThreshold = selectedThreshold(sliderT.value());
  currentError = sliderError1.value();
  //
  controlText = color(255,255,255,255);
  controlBackground = color(35,35,35,255);
  mainText = color(35,35,35,255);
  mainBlue = color(3,54,255,255);
  secondBlue = color(3,54,255,125);
  mainPink = color(255,2,102,255);
  secondPink = color(255,2,102,100);
  // hard-coded: number of thresholds in the current data
  thresholdRange1 = 33;
  thresholdRange2 = 38;
  //
  errorRange1 = {}; errorRange1.min = 881; errorRange1.max = 1718;
  disparityRange1 = {}; disparityRange1.min = 97; disparityRange1.max = 472;
  //
  errorRange2 = {}; errorRange2.min = 0.306; errorRange2.max = 0.377;
  disparityRange2 = {}; disparityRange2.min = 392; disparityRange2.max = 687;
  //
  xRange = {}; xRange.min = 35; xRange.max = controlW - 30;
  yRange = {}; yRange.min = 580; yRange.max = 460;
}

function draw() {
  // retrieve current select values
  controlView();
  updateControl();

  if(currentType == 0){
    disparityLabel.hide();
    document.getElementById("disparity-instruction").style.display = "none";
    document.getElementById("disparity-label-1").style.display = "none";
    document.getElementById("disparity-label-2").style.display = "none";
  } else if (currentType == 1) {
    disparityLabel.show();
    document.getElementById("disparity-instruction").style.display = "block";
    document.getElementById("disparity-label-1").style.display = "block";
    document.getElementById("disparity-label-2").style.display = "block";
  }else{
    disparityLabel.show();
    document.getElementById("disparity-instruction").style.display = "block";
    document.getElementById("disparity-label-1").style.display = "block";
    document.getElementById("disparity-label-2").style.display = "block";
  }

  fill(255);
  noStroke();
  rect(controlW,0,canvasW-controlW,canvasH);
  fill(35,35,35);
  rect(0,0,controlW,canvasH);
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
    var index = findData(currentType,currentThreshold,currentError,);
    var data = readData(currentType,index);
    currentIndex = index;

    drawData(currentType,data);
    if (currentType == 1 || currentType == 2){
      drawCurve(sliderT.value(),data.index);
    }

    var errors = Math.floor((Math.floor(data.fpa0)+Math.floor(data.fpa1)+Math.floor(data.fna0)+Math.floor(data.fna1)));
    var errorRate = Math.floor(errors/3000*10000/100);

    if (currentType == 1 || currentType == 2){
      var text = "<u>Total Defendants</u>: 3000&nbsp;&nbsp;&nbsp;&nbsp;<u>Prediction Errors</u>: "+ errors+ " ("+errorRate+"%)"+"&nbsp;&nbsp;&nbsp;&nbsp;<u>Disparity</u>: " +data.dfp + " ("+Math.floor(data.dfp/3000*10000/100)+"%)" +data.index;
    } else {
      var text = "<u>Total Defendants</u>: 3000&nbsp;&nbsp;&nbsp;&nbsp;<u>Prediction Errors</u>: "+ errors + " ("+errorRate+"%)" +data.index;
    }

    var data21 = (Math.floor(data.fpa0)+Math.floor(data.fpa1)+Math.floor(data.fna0)+Math.floor(data.fna1));
    var data22 = Math.floor(100-data.accuracy*100);
    document.getElementById("summary-2-data").innerHTML = data21 + " ("+data22+"%)";
    document.getElementById("model-id").innerHTML = data.index;
    if (currentType == 1 || currentType == 2){
      var data3 = data.dfp;
      document.getElementById("summary-3").style.display = "block";
      document.getElementById("summary-3-data").style.display = "block";
      document.getElementById("summary-3-data").innerHTML = data3;
      //document.getElementById("disparity-bar-label").style.display = "block";
    } else {
      document.getElementById("summary-3").style.display = "none";
      document.getElementById("summary-3-data").style.display = "none";
      //document.getElementById("disparity-bar-label").style.display = "none";
    }
    //
    // draw panel label
    var dy = 2*radius*columnPoints/2 - 60;
    drawAreaLabelLeft(leftX,topY+dy, mainBlue, "TRUE POSITIVE (TP)","Predict defendants will reoffend and the prediction is CORRECT");
    drawAreaLabelLeft(leftX,centerY+dy, mainPink, "FALSE POSITIVE (FP)","Predict defendants will reoffend but the prediction is WRONG");
    //
    drawAreaLabelRight(rightX-160,topY+dy, mainPink, "FALSE NEGATIVE (FN)","Predict defendants will NOT reoffend but the prediction is WRONG");
    drawAreaLabelRight(rightX-160,centerY+dy, mainBlue, "TRUE NEGATIVE (TN)","Predict defendants will NOT reoffend and the prediction is CORRECT");
    //
    // call drawLegend
    drawLegend(canvasW-200,85);

  } else {
    toggleScenario();
    currentSummary.hide();
    // draw scenario
    var index = findData(currentType,currentThreshold,currentError);
    var data = readData(currentType,index);

    updateView();
    drawScenario(data);

    if (currentType == 1 || currentType == 2){
      drawCurve(sliderT.value(),data.index);
      document.getElementById("disparity-bar-label").style.display = "block";
    } else {
      document.getElementById("disparity-bar-label").style.display = "none";
    }
    document.getElementById("summary-1").style.display = "none";
    document.getElementById("summary-1-data").style.display = "none";
    document.getElementById("summary-2").style.display = "none";
    document.getElementById("summary-2-data").style.display = "none";
    document.getElementById("summary-3").style.display = "none";
    document.getElementById("summary-3-data").style.display = "none";
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
  if (currentType == 1){
    if (currentError !== sliderError1.value()){
      currentError = sliderError1.value();
    }
  } else if (currentType == 2) {
    if (currentError !== sliderError2.value()){
      currentError = sliderError2.value();
      //console.log(currentError);
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
    line(450, 550, canvasW - margin*6 , 550);
  } else {
    stroke(0,0,0,50);
    line(450, 100, canvasW - margin*6 , 100);
    constructScenario(450,120,data);
    line(450, 650, canvasW - margin*6 , 650);

  }
}

function constructScenario(x,y,data){
  //
  // scenario2header.html('Scneario Two <br> (Algorithm Decision)')
  // scenario2header.position(x,y);
  // compose data
  var content = 0;
  var errors = Math.floor((Math.floor(data.fpa0)+Math.floor(data.fpa1)+Math.floor(data.fna0)+Math.floor(data.fna1)));
  var corrections = Math.floor(3000-errors);
  var errorRate = Math.floor(errors/3000*10000/100);

  if(currentType == 0){
    content = "Overall, among <strong>3000</strong> defendants, <strong>"+errors+" ("+errorRate+"%)</strong> are incorrectly predicted. <br><br>";
    //
    var fn = Math.floor(data.fna0) + Math.floor(data.fna1);
    var fp = Math.floor(data.fpa0) + Math.floor(data.fpa1);
    content = content + "Among these <strong>"+errors+"</strong> incorrect predictions:<br><ul><li>";
    content = content + "<strong>FALSE NEGATIVE: "+ fn + "</strong> defendants who are predicted NOT to reoffend will actually reoffend.</li><li>";
    content = content + "<strong>FALSE POSITIVE: "+ fp + " </strong> defendants who are predicted to reoffend will actually NOT reoffend.</li></ul><br>";
    //
    var tp = Math.floor(data.tpa0) + Math.floor(data.tpa1);
    var tn = Math.floor(data.tna0) + Math.floor(data.tna1);
    content = content + "Among these <strong>"+corrections+"</strong> correct predictions:<br><ul><li>";

    content = content + "<strong>TRUE NEGATIVE: "+ tn + "</strong> defendants who are predicted NOT to reoffend will actually NOT reoffend.</li><li>";
    content = content + "<strong>TRUE POSITIVE: "+ tp + " </strong> defendants who are predicted to reoffend will actually reoffend.</li></ul><br>";

    scenario2content.html(content);
    scenario2content.position(x,y);
  } else if (currentType == 1) {

    content = "Overall, among <strong>3000</strong> defendants, <strong>"+errors+" ("+errorRate+"%)</strong> are incorrectly predicted. <br><br>";
    //
    var diffFN = Math.abs(data.fna1 - data.fna0);
    var diffFP = Math.abs(data.fpa1 - data.fpa0);
    content = content + "Among these <strong>"+errors+"</strong> incorrect predictions:<br><ul><li>";
    content = content + "<strong>FALSE NEGATIVE: "+ data.fna1 + " White American </strong> and <strong>" +data.fna0+" African American</strong> defendants who are predicted NOT to reoffend will actually reoffend (Difference "+diffFN+").</li><li>";
    content = content + "<strong>FALSE POSITIVE: "+ data.fpa1 + " White American </strong> and <strong>" +data.fpa0+" African American</strong> defendants who are predicted to reoffend will actually NOT reoffend (Difference "+diffFP+").</li></ul><br>";
    //
    var diffTP = Math.abs(data.tpa0 - data.tpa1);
    var diffTN = Math.abs(data.tna0 - data.tna1);
    content = content + "Among these <strong>"+corrections+"</strong> correct predictions:<br><ul><li>";

    content = content + "<strong>TRUE NEGATIVE: "+ data.tna1 + " White American </strong> and <strong>" + data.tna0 +" Afrian American</strong> defendants who are predicted NOT to reoffend will actually NOT reoffend (Difference "+diffTN+").</li><li>";
    content = content + "<strong>TRUE POSITIVE: "+ data.tpa1 + " White American </strong> and <strong>" + data.tpa0 + " Afrian American</strong> defendants who are predicted to reoffend will actually reoffend (Difference "+diffTP+").</li></ul><br>";

    scenario2content.html(content);
    scenario2content.position(x,y);
    stroke(0,0,0,50);
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
    content = "Overall, among <strong>3000</strong> defendants, <strong>"+errors+" ("+errorRate+"%)</strong> are incorrectly predicted. <br><br>";
    //
    content = content + "Of all the defendants who <strong>do not</strong> relapse into criminal behavior, <strong>" + data1 + "%</strong> of them are <strong>predicted to</strong> recommit.<br><ul><li>";
    content = content + data11 + " defendants who are <strong>predicted to</strong> recommit <strong>do</strong> relapse into criminal behavior. "+ data.tpa0 + " of them are male.</li><li>";
    content = content + data12 + " defendants who are <strong>predicted to</strong> recommit <strong>do not</strong> relapse into criminal behavior. "+ data.fpa0 + " of them are male.</li></ul><br>";
    //
    //content = content + "The disparity between female and male is <strong>" +Math.abs(data.fpa1 - data.fpa0)+ "</strong>.<br><br>";
    //
    content = content + "Of all the defendants who <strong>do</strong> relapse into criminal behavior, <strong>" +data2 + "%</strong> of them are <strong>predicted not to</strong> recommit.<br><ul><li>";
    content = content + data21 + " defendants who are <strong>predicted not to</strong> recommit <strong>do</strong> relapse into criminal behavior. "+ data.fna0 + " of them are male.</li><li>";
    content = content + data22 + " defendants who are <strong>predicted not to</strong> recommit <strong>do not</strong> relapse into criminal behavior. "+ data.tna0 + " of them are male. </li></ul><br>";
    //
    content = content + "The disparity between female and male is <strong>" +Math.abs(data.fna1 - data.fna0) + "</strong>.";
    //
    scenario2content.html(content);
    scenario2content.position(x,y);
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

    if (area == 0){
      if (i < points2){
        fill(secondBlue);
      } else {
        fill(mainBlue);
      }
    } else if (area == 1) {
      if(i<points1){
        fill(mainPink);
      } else {
        fill(secondPink);
      }
    } else if (area == 3) {
      if (i < points1) {
        fill(mainBlue);
      } else {
        fill(secondBlue);
      }
    } else {
      if (i < points2){
        fill(secondPink);
      } else {
        fill(mainPink);
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
      x0 = radius*2*Math.ceil(points1/columnMax)+30;
      y = inity + 13;
      t1 = points1 + " / " + points2;
      t2 = "AFRICAN / WHITE AMERICAN";
    }else if (area == 1) {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*8;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity + 13;
      t1 = points1 + " / " + points2;
      t2 = "AFRICAN / WHITE AMERICAN";
    }else if(area == 2){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      x0 = radius*2*Math.ceil(points1/columnMax)+30;
      y = inity - 13;
      t1 = points1 + " / " + points2;
      t2 = "AFRICAN / WHITE AMERICAN";
    }else {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*8;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity - 13;
      t1 = points1 + " / " + points2;
      t2 = "AFRICAN / WHITE AMERICAN";
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
      t1 = points1 + "  /  " + points2;
      t2 = "FEMALE / MALE";
    }else if (area == 1) {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*10;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity + 13;
      t1 = points1 + " / " + points2;
      t2 = "FEMALE / MALE";
    }else if(area == 2){
      x1 = initx-radius*2*Math.ceil(totalpoints/columnMax);
      x0 = radius*2*Math.ceil(points2/columnMax)+30;
      y = inity - 13;
      t1 = points1 + " / " + points2;
      t2 = "FEMALE / MALE";
    }else {
      x1 = initx+radius*2*Math.ceil(totalpoints/columnMax)-numDigits(totalpoints)*10;
      x0 = -radius*2*Math.ceil(points1/columnMax)-20;
      y = inity - 13;
      t1 = points1 + " / " + points2;
      t2 = "FEMALE / MALE";
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

function drawLegend(x,y){
  if (currentType == 1){
    fill(mainBlue);
    circle(x,y,radius);
    fill(mainPink);
    circle(x+radius*2.5,y,radius);
    fill(secondBlue);
    circle(x,y+radius*4.5,radius);
    fill(secondPink);
    circle(x+radius*2.5,y+radius*4.5,radius);
    push();
    translate(x+radius*5,y+radius);
    fill(mainText);
    noStroke();
    textSize(12);
    textStyle(NORMAL);
    text("African American",5,0);
    text("White American",5,15);
  } else if (currentType == 2) {
    fill(mainBlue);
    circle(x,y,radius);
    fill(mainPink);
    circle(x+radius*2.5,y,radius);
    fill(secondBlue);
    circle(x,y+radius*4.5,radius);
    fill(secondPink);
    circle(x+radius*2.5,y+radius*4.5,radius);
    push();
    translate(x+radius*5,y+radius);
    fill(mainText);
    noStroke();
    textSize(12);
    textStyle(NORMAL);
    text("Female",5,0);
    text("Male",5,15);
  }
}

function drawAreaLabelLeft(x,y,c,text1,text2){
  fill(255,255,255,150);
  rect(x-5,y-5,160,130);
  fill(c);
  noStroke();
  rect(x,y,157,25);
  fill(255,255,255);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  text(text1,x+7,y+17.5);
  fill(35,35,35,200);
  noStroke();
  textSize(12);
  textStyle(NORMAL);
  text(text2,x+7,y+32,150,300);
}

function drawAreaLabelRight(x,y,c,text1,text2){
  fill(255,255,255,150);
  rect(x-5,y-5,160,130);
  fill(c);
  noStroke();
  rect(x,y,160,25);
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
  text(text2,x+3,y+32,150,300);
  textAlign(LEFT);
}




function checkboxT1Event() {
  if (this.checked()) {
    currentType = 1;
    checkboxT2.checked(false)
    document.getElementById("thresholdSlider").max = thresholdRange1;
    document.getElementById("thresholdSlider").min = 1;
    //console.log('Type 1');
  } else {
    currentType = 0;
    document.getElementById("thresholdSlider").max = 40;
    document.getElementById("thresholdSlider").min = 0;
  }
}

function checkboxT2Event() {
  if (this.checked()) {
    currentType = 2;
    //console.log('Type 2');
    checkboxT1.checked(false)
    document.getElementById("thresholdSlider").max = thresholdRange2;
    document.getElementById("thresholdSlider").min = 1;
  } else {
    currentType = 0;
    document.getElementById("thresholdSlider").max = 40;
    document.getElementById("thresholdSlider").min = 0;
  }
}

function buttonDataEvent(){
  this.addClass('active');
  buttonScenario.removeClass('active');
  view = 0;
}

function buttonScenarioEvent(){
  //this.addClass('active');
  //buttonData.removeClass('active');
  //view = 1;
  //window.open("explore_1_scenario.html",'_self');
}

function controlView(){
  if (currentType == 0){
    sliderError1.hide();
    sliderError2.hide();
  } else if (currentType == 1) {
    sliderError1.show();
    sliderError2.hide();
  } else {
    sliderError1.hide();
    sliderError2.show();
  }
}

/* update current threshold range */
function updateControl(){
  if (currentType == 1){
    var range = selectedError(sliderT.value());
    document.getElementById("type1dfnSlider").max = range;
    document.getElementById("type1dfnSlider").min = 1;
    document.getElementById("thresholdSlider").max = thresholdRange1;
    document.getElementById("thresholdSlider").min = 1;
  } else if (currentType == 2) {
    var range = selectedError(sliderT.value());
    document.getElementById("type2dfnSlider").max = range;
    document.getElementById("type2dfnSlider").min = 1;
    document.getElementById("thresholdSlider").max = thresholdRange2;
    document.getElementById("thresholdSlider").min = 1;
  } else {
    document.getElementById("thresholdSlider").max = 40;
    document.getElementById("thresholdSlider").min = 0;
  }
}

/* retreive error rate table - find */
function selectedError(value) {
  var range = 0;
  if (value == 0){
    v = 1;
  } else if (value == 40) {
    v = 39;
  } else {
    v = value;
  }
  if (currentType == 1){
    range = error1.get(v-1,1);
  } else if (currentType == 2) {
    range = error2.get(v-1,1);
  }
  return range;
}


function selectedThreshold(value) {
  var threshold = 0 + 0.025*value;
  return threshold;
}


// need to check index
function findData(type,threshold,error){
  var index = 0;
  var t = Math.floor(threshold / 0.025);
  if (currentType == 0) {
    index = Math.floor(threshold / 0.025);
  } else if (currentType == 1) {
    index = error1.get(t-1,1+error);
  } else if (currentType == 2){
    index = error2.get(t-1,1+error);
  }
  return index;
}


function drawCurve(currentT, currentI){

  var index = [];
  var error  = [];
  var disparity = [];
  var range = 0;
  var disparityMin, disparityMax;
  var errorMin, errorMax;
  //
  var eTable,dTable;
  if (currentType == 1) {
    eTable = error1;
    dTable = data1;
    disparityMin = disparityRange1.min; disparityMax = disparityRange1.max;
    errorMin = errorRange1.min; errorMax = errorRange1.max;
  } else if (currentType == 2) {
    eTable= error2;
    dTable = data2;
    disparityMin = disparityRange2.min; disparityMax = disparityRange2.max;
    errorMin = errorRange2.min; errorMax = errorRange2.max;
  }
  //
  range = eTable.get(currentT-1,1);
  //
  for(var i = 0; i < range; i++){
    var a = parseInt(eTable.get(currentT-1,2+i));
    index.push(parseInt(a));
  }

  //
  for(var i = 0; i < index.length; i++){
    var e = parseInt(dTable.get(index[i],2));
    var d = parseInt(dTable.get(index[i],3));
    error.push(parseInt(e));
    disparity.push(parseInt(d));
  }
  //
  disparityMin = arrayMin(disparity)-2;
  disparityMax = arrayMax(disparity)+2;
  errorMin = arrayMin(error)-2;
  errorMax = arrayMax(error)+2;
  //console.log(error);
  //console.log(errorMin,errorMax);
  // test areal
  fill(255,255,255,25);
  //rect(xRange.min,yRange.max,xRange.max-xRange.min,yRange.min-yRange.max);
  stroke(255,255,255,25);
  line(xRange.min-5,yRange.min+3,xRange.max-10,yRange.min+3);
  line(xRange.min-5,yRange.min+3,xRange.min-5,yRange.max);
  noStroke();
  // draw curve

  for (let i = 0; i < index.length; i++){
    var posX = map(disparity[i], disparityMin, disparityMax, xRange.min+5, xRange.max-10);
    var posY = map(error[i], errorMin, errorMax, yRange.min-5, yRange.max+10);
    if (index[i]==currentI){
      fill(255,222,3,50);
      circle(posX,posY,12.5);
      fill(255,222,3);

    } else {
      fill(255,255,255,125);

    }
    circle(posX,posY,2.5);
  }

  fill(255,255,255,200);
  noStroke();
  textSize(11);
  textStyle(NORMAL);
  text("Disparity",xRange.max-50,yRange.min+17);
  push();
  translate(xRange.min-10,yRange.min);
  rotate(-PI/2);

  text("Errors",90,0);
  pop();

}


function readData(type, index) {
  var table;
  if (type == 0) {
    table = data0;
  } else if (type == 1) {
    table = data1;
  } else { table = data2;}
  //
  var idx = table.get(index,0);
  var threshold = table.get(index,1);
  var error = table.get(index,2);
  var dfp = table.get(index,3);
  var precision = table.get(index,4);
  var recall = table.get(index,5);
  var fpr = table.get(index,6);
  var fnr = table.get(index,7);
  var accuracy = table.get(index,8);
  var tpa0  = table.get(index,9);
  var tpa1 = table.get(index,10);
  var fpa0 = table.get(index,11);
  var fpa1 = table.get(index,12);
  var fna0 = table.get(index,13);
  var fna1 = table.get(index,14);
  var tna0 = table.get(index,15);
  var tna1 = table.get(index,16);
  //
  var data = {};
  data.index = idx;
  data.threshold = threshold;
  data.error = error;
  data.dfp = dfp;
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

function arrayMin(arr) {
  var min = arr[0];
  for(var i = 0; i < arr.length; i++){
    if(arr[i] < min){
      min = arr[i];
    }
  }
  return min;
}

function arrayMax(arr) {
  var max = arr[0];
  for(var i = 0; i < arr.length; i++){
    if(arr[i] > max){
      max = arr[i];
    }
  }
  return max;
}
