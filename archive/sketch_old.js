var data0, data1, data2, disparity;
var sliderT, sliderDfn1, sliderDfn2;
var checkboxT1, checkboxT2;
var buttonData, buttonScenario;
var canvasW, canvasH, margin;
var controlW, controlH;
var dataCanvasW, dataCanvasH;
var leftX, centerX, rightX, topY, centerY, bottomY;
var leftcenterX, rightCenterX;
var currentType = 0;
var currentThreshold = previousThreshold = 0;
var currentDisparityFn = previousDisparityFn = 0;
var currentDisparityFp = previousDisparityFp = 0;
var radius = 3;
var rowPoints;
var moreSliders = false;
var view = 0;

var scenario1header, scenario1content, scenario2header,scneario2content, scenario3header, scenario3content;

var thresholdLabel;
var disparityLabel;
var thresholdMin, thresholdMax;
var dfn1Min, dfn1Max, dfn2Min, dfn2Max;

var currentSummary;

function preload(){
  //
  canvasW = 1000;
  controlW = 400;
  canvasH = controlH = 600;
  margin = 20;
  // load table from the csv file
  data0 = loadTable('data/data0.csv', 'csv');
  data1 = loadTable('data/data1.csv', 'csv');
  data2 = loadTable('data/data2.csv', 'csv');
  disparity = loadTable('data/disparity.csv', 'csv');
  // get max and min range from the table
}

function setup() {
  // get window height and width, min are 600 x 400
  if(window.innerWidth > 1000){
    canvasW = window.innerWidth;}
  if(window.innerHeight > 600){
    canvasH = controlH = window.innerHeight;}
  createCanvas(canvasW, canvasH);
  //
  dataCanvasW = canvasW - margin*4 - controlW;
  datacanvasH = canvasH - 150 - margin*2;
  leftX = controlW + margin*2;
  centerX = leftX + dataCanvasW/2;
  rightY = canvasW - margin*2;
  topY = 150;
  centerY = topY + datacanvasH/2;
  bottomY = canvasH - margin*2;
  leftCenterX = leftX + dataCanvasW/4 - margin;
  rightCenterX = centerX + dataCanvasW/4 - margin;
  rowPoints = Math.floor((centerX - leftX - 40)/radius/2);

  // setup slider
  var sliderW = 350 +'px';
  sliderT = createSlider(0, 40, 20, 1);
  sliderT.position(20,200);
  sliderT.id("thresholdSlider");
  sliderDfn1 = createSlider(0, 41, 10, 1);
  sliderDfn1.position(20,630);
  sliderDfn1.id("type1dfnSlider");
  //
  sliderDfn2 = createSlider(0, 35, 10, 1);
  sliderDfn2.position(20,630);
  sliderDfn2.id("type2dfnSlider");
  //
  checkboxT1 = createCheckbox('   Race ( Caucasian / African American )', false);
  checkboxT1.changed(checkboxT1Event);
  checkboxT1.position(20,420);

  checkboxT2 = createCheckbox('   Gender ( Female / Male )', false);
  checkboxT2.changed(checkboxT2Event);
  checkboxT2.position(20,450);
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
  sliderDfn1.parent("control-panel");
  sliderDfn2.parent("control-panel");
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
  buttonData.position(leftX, 20);
  buttonData.mousePressed(buttonDataEvent);
  buttonData.addClass('active');

  buttonScenario = createButton('Scenario View');
  buttonScenario.position(buttonData.x+120, 20);
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

  previousThreshold = currentThreshold = selectedThreshold(sliderT.value());
  previousDisparityFn = currentDisparityFn = selectedDisparity(sliderDfn1.value());
  previousDisparityFp = currentDisparityFp;
}

function draw() {
  // retrieve current select values
  controlView();
  updateControl();
  var control1 = "Current selected confidence level: <strong>"+Math.floor(currentThreshold*1000)/10+"</strong>%";
  thresholdLabel.html(control1);
  thresholdLabel.position(20,270);
  var control2 = "Current selected disparity level: <strong>"+Math.floor(currentDisparityFn*100000)/1000+"</strong>%";
  disparityLabel.html(control2);
  disparityLabel.position(20,700);
  //
  var min = "Minimum <br>confidence<br><br><br>" + getThresholdRange("thresholdSlider").min  + "%"
  var max = "Maximum <br>confidence<br><br><br>" + getThresholdRange("thresholdSlider").max + "%";
  thresholdMin.html(min);
  thresholdMin.position(20, 150);
  thresholdMax.html(max);
  thresholdMax.position(300, 150);

  var dmin = "Minimum <br>disparity<br><br><br>" + getDisparityRange("type1dfnSlider").min  + "%"
  var dmax = "Maximum <br>disparity<br><br><br>" + getDisparityRange("type1dfnSlider").max + "%";
  dfn1Min.html(dmin);
  dfn1Min.position(20, 580);
  dfn1Max.html(dmax);
  dfn1Max.position(305, 580);

  var dmin = "Minimum <br>disparity<br><br><br>" + getDisparityRange("type2dfnSlider").min  + "%"
  var dmax = "Maximum <br>disparity<br><br><br>" + getDisparityRange("type2dfnSlider").max + "%";
  dfn2Min.html(dmin);
  dfn2Min.position(20, 580);
  dfn2Max.html(dmax);
  dfn2Max.position(305, 580);


  if(currentType == 0){
    disparityLabel.hide();
    document.getElementById("disparity-instruction").style.display = "none";
    dfn1Min.hide(); dfn1Max.hide();
    dfn2Min.hide(); dfn2Max.hide();
  } else if (currentType == 1) {
    disparityLabel.show();
    document.getElementById("disparity-instruction").style.display = "block";
    dfn1Min.show(); dfn1Max.show();
    dfn2Min.hide(); dfn2Max.hide();
  }else{
    disparityLabel.show();
    document.getElementById("disparity-instruction").style.display = "block";
    dfn1Min.hide(); dfn1Max.hide();
    dfn2Min.show(); dfn2Max.show();
  }

  fill(255);
  noStroke();
  rect(400,0,canvasW-400,canvasH);
  if (view == 0){
    // hide
    toggleScenario();
    // draw data panel
    fill(245);
    noStroke();
    rect(leftX,topY,centerX-leftX-5,centerY-topY-5);
    rect(leftX,centerY,centerX-leftX-5,centerY-topY-5);
    rect(centerX,topY,centerX-leftX-5,centerY-topY-5);
    rect(centerX,centerY,centerX-leftX-5,centerY-topY-5);
    // draw panel label
    drawAreaLabelLeft(leftX,topY,"Defendants who are predicted to have high chance of recidivism","actually relapse into criminal behavior", "");
    drawAreaLabelLeft(leftX,centerY,"Defendants who are predicted to have high chance of recidivism","do not relapse into criminal behavior", "");
    drawAreaLabelRight(centerX+canvasW/2,topY,"Defendants who are predicted to have low chance of recidivism","actually relapse into criminal behavior", "");
    drawAreaLabelRight(centerX+canvasW/2, centerY,"Defendants who are predicted to have low chance of recidivism","do not relapse into criminal behavior", "");
    //
    updateView();
    //
    var index = findData(currentType,0,currentDisparityFn,currentThreshold);
    var data = readData(currentType,index);
    var prevIndex = findData(currentType,0,previousDisparityFn,previousThreshold);
    var prevData = readData(currentType,prevIndex);
    console.log(index);

    drawData(currentType,data);
    // draw summary
    var text = "Precision: "+Math.floor(data.precision*10000)/100+"%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recall: "+Math.floor(data.recall*10000)/100+"%<br>False-positive rate: "+Math.floor(data.fpr*10000)/100+"% &nbsp;&nbsp;&nbsp;&nbsp;False-negative rate: "+Math.floor(data.fnr*10000)/100 + "% &nbsp;&nbsp;&nbsp;&nbsp;Accuracy: "+Math.floor(data.accuracy*10000)/100+"%";
    currentSummary.html(text);
    currentSummary.show();
    currentSummary.position(450,90);

  } else {
    toggleScenario();
    currentSummary.hide();
    // draw scenario
    var index = findData(currentType,0,currentDisparityFn,currentThreshold);
    var data = readData(currentType,index);
    var prevIndex = findData(currentType,0,previousDisparityFn,previousThreshold);
    var prevData = readData(currentType,prevIndex);

    updateView();
    drawScenario(data,prevData);
  }
}

function getThresholdRange(id){
  var range = {};
  range.min = document.getElementById(id).min * 0.025;
  range.max = document.getElementById(id).max * 0.025;
  range.min = Math.floor(range.min * 1000 ) / 10;
  range.max = Math.floor(range.max * 1000 )/ 10;
  return range;
}

function getDisparityRange(id){
  var range = {};
  if (currentType == 1){
    var min = document.getElementById(id).min;
    range.min = selectedDisparity(min, currentType, 0);
    var max = document.getElementById(id).max;
    range.max = selectedDisparity(max, currentType, 0);

  } else if (currentType == 2) {
    var min = document.getElementById(id).min;
    range.min = selectedDisparity(min, currentType, 0);
    var max = document.getElementById(id).max;
    range.max = selectedDisparity(max, currentType, 0);
  }
  range.min = Math.floor(range.min * 100000 ) / 1000;
  range.max = Math.floor(range.max * 100000 )/ 1000;
  return range;
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
    previousThreshold = currentThreshold;
    currentThreshold = selectedThreshold(sliderT.value());
  }
  //
  if (currentType == 1){
    if (currentDisparityFn !== selectedDisparity(sliderDfn1.value(),currentType,0)){
      previousDisparityFn = currentDisparityFn;
      currentDisparityFn = selectedDisparity(sliderDfn1.value(),currentType,0);
    }
  } else if (currentType == 2) {
    if (currentDisparityFn !== selectedDisparity(sliderDfn2.value(),currentType,0)){
      previousDisparityFn = currentDisparityFn;
      currentDisparityFn = selectedDisparity(sliderDfn2.value(),currentType,0);
      console.log(currentDisparityFn);
    }
  }
}

function drawScenario(data,prevData){
  fill(255);
  noStroke();
  rect(controlW,0,canvasW-controlW,canvasH);
  if (currentType == 0){
    stroke(0,0,0,50);
    line(450, 100, canvasW - margin*6 , 100);
    constructScenario2(450,120,data);
  } else {
    stroke(0,0,0,50);
    line(450, 100, canvasW - margin*6 , 100);
    constructScenario2(450,120,data);

  }
}

function constructScenario1(x,y){
  scenario1header.html("Scneario One <br> (Judge's Decision)");
  scenario1header.position(x,y);

  scenario1content.html('The judge will manually look at similar cases in the past to make decisions, which takes time and is still possible to make mistakes.');
  scenario1content.position(x+300,y);

  stroke(0,0,0,50);
  line(x, y+100, canvasW - margin*6 , y+100);
}


function constructScenario2(x,y,data){
  //
  scenario2header.html('Scneario Two <br> (Algorithm Decision)')
  scenario2header.position(x,y);
  // compose data
  var content = 0;
  if(currentType == 0){
    content = "Overall, <strong>" + Math.floor(data.accuracy*10000)/100 + "%</strong> of the defendants are predicted correctly. “Correct predictions” mean that those who are predicted to have high chance of recidivism actually relapse into criminal behavior and those who are predicted to have low chance of recidivism do not relapse. <br><br>";
    content = content + "Among all the defendants who were predicted to have <strong>high</strong> chance of recidivism, <strong>" + Math.floor(data.fpr*10000)/100 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br><br>";
    content = content + "Among all the defendants who were predicted to have <strong>low</strong> chance of recidivism, <strong>" + Math.floor(data.fnr*10000)/100 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br><br>";
    content = content + "Because the algorithm make the decisions, <strong>no</strong> human effort is required";
    scenario2content.html(content);
    scenario2content.position(x+300,y);
    stroke(0,0,0,50);
    line(x, y+380, canvasW - margin*6 , y+380);
  } else if (currentType == 1) {
    var data1 = (data.fpa0+data.fpa1)/(data.fpa0+data.tna0+data.fpa1+data.tna1);
    data1 = Math.floor(data1*10000)/100;
    var data10 = data.fpa0 / (data.fpa0+data.tna0); data10 = Math.floor(data10*100000)/1000;
    var data11 = data.fpa1 / (data.fpa1+data.tna1); data11 = Math.floor(data11*100000)/1000;
    var data12 = Math.floor(data.dfp*100000)/1000;
    content = "Overall, <strong>" + Math.floor(data.accuracy*10000)/100 + "%</strong> of the defendants are predicted correctly. “Correct predictions” mean that those who are predicted to have high chance of recidivism actually relapse into criminal behavior and those who are predicted to have low chance of recidivism do not relapse. <br><br>";
    //
    content = content + "Among all the defendants who were predicted to have <strong>high</strong> chance of recidivism, <strong>" + data1 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>African American</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data10+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>Caucasian</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data11+"%</strong> of them are predicted incorrectly.<br>The difference between African American and Caucasian is <strong>"+data12+"%</strong><br><br>";
    //
    var data2 = (data.fna0+data.fpa1)/(data.fna0+data.tpa0+data.fna1+data.tpa1);
    data2 = Math.floor(data2*10000)/100;
    var data20 = data.fna0 / (data.fna0+data.tpa0); data20 = Math.floor(data20*100000)/1000;
    var data21 = data.fna1 / (data.fna1+data.tpa1); data21 = Math.floor(data21*100000)/1000;
    var data22 = Math.floor(data.dfn*100000)/1000;
    //
    content = content + "Among all the defendants who were predicted to have <strong>low</strong> chance of recidivism, <strong>" + data2 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>African American</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data20+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>Caucasian</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data21+"%</strong> of them are predicted incorrectly.<br>The difference between African American and Caucasian is <strong>"+data22+"%</strong>.";
    //
    content = content + "<br><br>Because the algorithm make the decisions, <strong>no</strong> human effort is required";
    scenario2content.html(content);
    scenario2content.position(x+300,y);
    stroke(0,0,0,50);
    line(x, y+610, canvasW - margin*6 , y+610);
  } else {
    var data1 = (data.fpa0+data.fpa1)/(data.fpa0+data.tna0+data.fpa1+data.tna1);
    data1 = Math.floor(data1*10000)/100;
    var data10 = data.fpa0 / (data.fpa0+data.tna0); data10 = Math.floor(data10*100000)/1000;
    var data11 = data.fpa1 / (data.fpa1+data.tna1); data11 = Math.floor(data11*100000)/1000;
    var data12 = Math.floor(currentDisparityFp*100000)/1000;
    content = "Overall, <strong>" + Math.floor(data.accuracy*10000)/100 + "%</strong> of the defendants are predicted correctly. “Correct predictions” mean that those who are predicted to have high chance of recidivism actually relapse into criminal behavior and those who are predicted to have low chance of recidivism do not relapse. <br><br>";
    //
    content = content + "Among all the defendants who were predicted to have <strong>high</strong> chance of recidivism, <strong>" + data1 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>female</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data10+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>male</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data11+"%</strong> of them are predicted incorrectly.<br>The difference between female and male is <strong>"+data12+"%</strong><br><br>";
    //
    var data2 = (data.fna0+data.fpa1)/(data.fna0+data.tpa0+data.fna1+data.tpa1);
    data2 = Math.floor(data2*10000)/100;
    var data20 = data.fna0 / (data.fna0+data.tpa0); data20 = Math.floor(data20*100000)/1000;
    var data21 = data.fna1 / (data.fna1+data.tpa1); data21 = Math.floor(data21*100000)/1000;
    var data22 = Math.floor(currentDisparityFn*100000)/1000;
    //
    content = content + "Among all the defendants who were predicted to have <strong>low</strong> chance of recidivism, <strong>" + data2 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>female</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data20+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>male</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data21+"%</strong> of them are predicted incorrectly.<br>The difference between female and male is <strong>"+data22+"%</strong>.";
    //
    content = content + "<br><br>Because the algorithm make the decisions, <strong>no</strong> human effort is required";
    scenario2content.html(content);
    scenario2content.position(x+300,y);
    stroke(0,0,0,50);
    line(x, y+610, canvasW - margin*6 , y+610);
  }
}

function constructScenario3(x,y,data,prevData){
  scenario3header.html('Scenario Three <br> (Using this tool)')
  // compose data
  var content = 0;
  if(currentType == 0){
    scenario3header.position(x,y);
    content = "Overall, <strong>" + Math.floor(data.accuracy*10000)/100 + "%</strong> of the defendants are predicted correctly. “Correct predictions” mean that those who are predicted to have high chance of recidivism actually relapse into criminal behavior and those who are predicted to have low chance of recidivism do not relapse. <br><br>";
    content = content + "Among all the defendants who were predicted to have <strong>high</strong> chance of recidivism, <strong>" + Math.floor(data.fpr*10000)/100 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br><br>";
    content = content + "Among all the defendants who were predicted to have <strong>low</strong> chance of recidivism, <strong>" + Math.floor(data.fnr*10000)/100 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br><br>";
    var deltafpr = Math.floor((data.fpr-prevData.fpr)*10000)/100;
    var deltafnr = Math.floor((data.fnr-prevData.fnr)*10000)/100;
    content = content + "By changing the prediction confidence, there is a <strong>"+ deltafpr + "%</strong> change of predicted high-chance recidivism to be incorrectly predicted, and a <strong>"+ deltafnr + "%</strong> change of predicted low-chance recidivism to be incorrectly predicted.";
    scenario3content.html(content);
    scenario3content.position(x+300,y);
    stroke(0,0,0,50);
    line(x,y+340, canvasW - margin*6 , y+340);
  } else if (currentType == 1) {
    scenario3header.position(x,y);
    var data1 = (data.fpa0+data.fpa1)/(data.fpa0+data.tna0+data.fpa1+data.tna1);
    data1 = Math.floor(data1*10000)/100;
    var data10 = data.fpa0 / (data.fpa0+data.tna0); data10 = Math.floor(data10*100000)/1000;
    var data11 = data.fpa1 / (data.fpa1+data.tna1); data11 = Math.floor(data11*100000)/1000;
    var data12 = Math.floor(data.dfp*100000)/1000;
    content = "Overall, <strong>" + Math.floor(data.accuracy*10000)/100 + "%</strong> of the defendants are predicted correctly. “Correct predictions” mean that those who are predicted to have high chance of recidivism actually relapse into criminal behavior and those who are predicted to have low chance of recidivism do not relapse. <br><br>";
    //
    content = content + "Among all the defendants who were predicted to have <strong>high</strong> chance of recidivism, <strong>" + data1 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>African American</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data10+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>Caucasian</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data11+"%</strong> of them are predicted incorrectly.<br>The difference between African American and Caucasian is <strong>"+data12+"%</strong><br><br>";
    //
    var data2 = (data.fna0+data.fpa1)/(data.fna0+data.tpa0+data.fna1+data.tpa1);
    data2 = Math.floor(data2*10000)/100;
    var data20 = data.fna0 / (data.fna0+data.tpa0); data20 = Math.floor(data20*100000)/1000;
    var data21 = data.fna1 / (data.fna1+data.tpa1); data21 = Math.floor(data21*100000)/1000;
    var data22 = Math.floor(data.dfn*100000)/1000;
    //
    content = content + "Among all the defendants who were predicted to have <strong>low</strong> chance of recidivism, <strong>" + data2 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>African American</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data20+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>Caucasian</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data21+"%</strong> of them are predicted incorrectly.<br>The difference between African American and Caucasian is <strong>"+data22+"%</strong>.";
    //
    var deltafpr = Math.floor((data.fpr-prevData.fpr)*10000)/100;
    var deltafnr = Math.floor((data.fnr-prevData.fnr)*10000)/100;
    content = content + "<br><br>By changing the prediction confidence, there is a <strong>"+ deltafpr + "%</strong> change of predicted high-chance recidivism to be incorrectly predicted, and a <strong>"+ deltafnr + "%</strong> change of predicted low-chance recidivism to be incorrectly predicted.";
    scenario3content.html(content);
    scenario3content.position(x+300,y);
    stroke(0,0,0,50);
    line(x, y+610, canvasW - margin*6 , y+610);
  } else {
    scenario3header.position(x,y);
    var data1 = (data.fpa0+data.fpa1)/(data.fpa0+data.tna0+data.fpa1+data.tna1);
    data1 = Math.floor(data1*10000)/100;
    var data10 = data.fpa0 / (data.fpa0+data.tna0); data10 = Math.floor(data10*100000)/1000;
    var data11 = data.fpa1 / (data.fpa1+data.tna1); data11 = Math.floor(data11*100000)/1000;
    var data12 = Math.floor(currentDisparityFp*100000)/1000;
    content = "Overall, <strong>" + Math.floor(data.accuracy*10000)/100 + "%</strong> of the defendants are predicted correctly. “Correct predictions” mean that those who are predicted to have high chance of recidivism actually relapse into criminal behavior and those who are predicted to have low chance of recidivism do not relapse. <br><br>";
    //
    content = content + "Among all the defendants who were predicted to have <strong>high</strong> chance of recidivism, <strong>" + data1 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>female</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data10+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>male</strong> defendants who were predicted to have high chance of recidivism, <strong>"+data11+"%</strong> of them are predicted incorrectly.<br>The difference between female and male is <strong>"+data12+"%</strong><br><br>";
    //
    var data2 = (data.fna0+data.fpa1)/(data.fna0+data.tpa0+data.fna1+data.tpa1);
    data2 = Math.floor(data2*10000)/100;
    var data20 = data.fna0 / (data.fna0+data.tpa0); data20 = Math.floor(data20*100000)/1000;
    var data21 = data.fna1 / (data.fna1+data.tpa1); data21 = Math.floor(data21*100000)/1000;
    var data22 = Math.floor(currentDisparityFn*100000)/1000;
    //
    content = content + "Among all the defendants who were predicted to have <strong>low</strong> chance of recidivism, <strong>" + data2 + "%</strong> of them  are predicted incorrectly (i.e., they do not actually relapse into criminal behavior). <br>";
    content = content + "Among all the <strong>female</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data20+"%</strong> of them are predicted incorrectly.<br> Among all the <strong>male</strong> defendants who were predicted to have low chance of recidivism, <strong>"+data21+"%</strong> of them are predicted incorrectly.<br>The difference between female and male is <strong>"+data22+"%</strong>.";
    //
    var deltafpr = Math.floor((data.fpr-prevData.fpr)*10000)/100;
    var deltafnr = Math.floor((data.fnr-prevData.fnr)*10000)/100;
    content = content + "<br><br>By changing the prediction confidence, there is a <strong>"+ deltafpr + "%</strong> change of predicted high-chance recidivism to be incorrectly predicted, and a <strong>"+ deltafnr + "%</strong> change of predicted low-chance recidivism to be incorrectly predicted.";
    scenario3content.html(content);
    scenario3content.position(x+300,y);
    stroke(0,0,0,50);
    line(x, y+610, canvasW - margin*6 , y+610);
  }
}


function drawData(type,data){
  if(type == 0){
    fill(26, 35, 126,255);
    drawPoints(leftX,centerY,rowPoints,data.tna0);
    drawPoints(centerX,centerY,rowPoints,data.fpa0);
    drawPoints(leftX,bottomY,rowPoints,data.fna0);
    drawPoints(centerX,bottomY,rowPoints,data.tpa0);
    //
    drawLabel(leftX,centerY,rowPoints,data.tna0,"defendants");
    drawLabel(centerX,centerY,rowPoints,data.fpa0,"defendants");
    drawLabel(leftX,bottomY,rowPoints,data.fna0,"defendants");
    drawLabel(centerX,bottomY,rowPoints,data.tpa0,"defendants");
  } else if(type == 1){
    fill(26, 35, 126,255);
    drawPoints(leftX,centerY,rowPoints/2,data.tna0);
    drawPoints(centerX,centerY,rowPoints/2,data.fpa0);
    drawPoints(leftX,bottomY,rowPoints/2,data.fna0);
    drawPoints(centerX,bottomY,rowPoints/2,data.tpa0);
    //
    drawLabel(leftX,centerY,rowPoints/2,data.tna0,"African American");
    drawLabel(centerX,centerY,rowPoints/2,data.fpa0,"African American");
    drawLabel(leftX,bottomY,rowPoints/2,data.fna0,"African American");
    drawLabel(centerX,bottomY,rowPoints/2,data.tpa0,"African American");
    //
    fill(66, 179, 213, 255);
    drawPoints(leftCenterX,centerY,rowPoints/2,data.tna1);
    drawPoints(rightCenterX,centerY,rowPoints/2,data.fpa1);
    drawPoints(leftCenterX,bottomY,rowPoints/2,data.fna1);
    drawPoints(rightCenterX,bottomY,rowPoints/2,data.tpa1);
    //
    drawLabel(leftCenterX,centerY,rowPoints/2,data.tna1,"Caucasian");
    drawLabel(rightCenterX,centerY,rowPoints/2,data.fpa1,"Caucasian");
    drawLabel(leftCenterX,bottomY,rowPoints/2,data.fna1,"Caucasian");
    drawLabel(rightCenterX,bottomY,rowPoints/2,data.tpa1,"Caucasian");
  } else {
    fill(26, 35, 126,255);
    drawPoints(leftX,centerY,rowPoints/2,data.tna0);
    drawPoints(centerX,centerY,rowPoints/2,data.fpa0);
    drawPoints(leftX,bottomY,rowPoints/2,data.fna0);
    drawPoints(centerX,bottomY,rowPoints/2,data.tpa0);
    //
    drawLabel(leftX,centerY,rowPoints/2,data.tna0,"female");
    drawLabel(centerX,centerY,rowPoints/2,data.fpa0,"female");
    drawLabel(leftX,bottomY,rowPoints/2,data.fna0,"female");
    drawLabel(centerX,bottomY,rowPoints/2,data.tpa0,"female");
    //
    fill(66, 179, 213, 255);
    drawPoints(leftCenterX,centerY,rowPoints/2,data.tna1);
    drawPoints(rightCenterX,centerY,rowPoints/2,data.fpa1);
    drawPoints(leftCenterX,bottomY,rowPoints/2,data.fna1);
    drawPoints(rightCenterX,bottomY,rowPoints/2,data.tpa1);
    //
    drawLabel(leftCenterX,centerY,rowPoints/2,data.tna1,"male");
    drawLabel(rightCenterX,centerY,rowPoints/2,data.fpa1,"male");
    drawLabel(leftCenterX,bottomY,rowPoints/2,data.fna1,"male");
    drawLabel(rightCenterX,bottomY,rowPoints/2,data.tpa1,"male");
  }
}

function drawPoints(left,bottom,rowMax,numPoints){
  for(var i = 0; i < numPoints; i++){
    var x = left+20+(i%rowMax)*radius*2;
    var y = -10+bottom-radius-radius*2*Math.floor(i/rowMax);
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

function drawLabel(left,bottom,rowMax,numPoints,addLabel){
  var x = left+20;
  var y = -17+bottom-radius-radius*2*Math.floor(numPoints/rowMax);
  push();
  translate(x,y);
  fill(0,0,0,200);
  noStroke();
  textSize(20);
  textStyle(BOLD);
  text(numPoints,0,0);
  textSize(16);
  textStyle(NORMAL);
  text(addLabel,numDigits(numPoints)*12+3,0);
  pop();
}

function drawAreaLabelLeft(x,y,content1,content2,content3){
  push();
  translate(x + 20,y + 30);
  fill(0,0,0,150);
  noStroke();
  textSize(15);
  textAlign(LEFT);
  text(content1,0,0);
  textAlign(LEFT);
  text(content2,0,19);
  textAlign(LEFT);
  text(content3,0,38);
  pop();
}

function drawAreaLabelRight(x,y,content1,content2,content3){
  push();
  translate(x - 265,y + 30);
  fill(0,0,0,150);
  noStroke();
  textSize(15);
  textAlign(RIGHT);
  text(content1,0,0);
  textAlign(RIGHT);
  text(content2,0,19);
  textAlign(RIGHT);
  text(content3,0,38);
  pop();
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
    sliderDfn1.hide();
    sliderDfn2.hide();
  } else if (currentType == 1) {
    sliderDfn1.show();
    sliderDfn2.hide();
  } else {
    sliderDfn1.hide();
    sliderDfn2.show();
  }
}


function updateControl(){
  if (currentType == 1){
    var dfn = selectedDisparity(sliderDfn1.value(),currentType,0);
    var min = selectedDisparity(sliderDfn1.value(),currentType,1);
    var max = selectedDisparity(sliderDfn1.value(),currentType,2);
    document.getElementById("thresholdSlider").max = max/0.025;
    document.getElementById("thresholdSlider").min = min/0.025;
  } else if (currentType == 2) {
    var dfn = selectedDisparity(sliderDfn2.value(),currentType,0);
    var min = selectedDisparity(sliderDfn2.value(),currentType,1);
    var max = selectedDisparity(sliderDfn2.value(),currentType,2);
    document.getElementById("thresholdSlider").max = max/0.025;
    document.getElementById("thresholdSlider").min = min/0.025;
  } else {
    document.getElementById("thresholdSlider").max = 1/0.025;
    document.getElementById("thresholdSlider").min = 0/0.025;
  }

}

function selectedDisparity(value, type, fnpn) {
  var disp = disparity.get(value,3*(type-1)+fnpn);
  return disp;
}

function selectedThreshold(value) {
  var threshold = 0 + 0.025*value;
  return threshold;
}

function inputThreshold(value) {
  var sVal = Math.floor(value/0.025);
  return sVal;
}

function inputDisparity(value, type, fnpn){
  var sVal = 0;
  for(var i = 0; i < 44; i++) {
    if(disparity.get(i,2*(type-1)+fnpn) == value){
      sVal = i;
      break
    }
  }
  return sVal;
}


function findData(type,fnpn,disparity,threshold){
  var index = 0;
  var fnpa = fnpn;
  if (currentType == 0) {
    index = Math.floor(threshold / 0.025);
  } else if (currentType == 1) {
    for (var i = 0; i < 1107; i++) {
      if (data1.get(i,0) == disparity && data1.get(i,2) == threshold) {
        index = i;
        break;
      }
    }
  } else if (currentType == 2){
    for (var i = 0; i < 1107;i++) {
      if (data2.get(i,0) == disparity && data2.get(i,2) == threshold) {
        index = i;
        break;
      }
    }
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
  var dfn = table.get(index,0);
  var dfp = table.get(index,1);
  var precision = table.get(index,3);
  var recall = table.get(index,4);
  var fpr = table.get(index,5);
  var fnr = table.get(index,6);
  var accuracy = table.get(index,7);
  var tpa0  = table.get(index,8);
  var tpa1 = table.get(index,9);
  var fpa0 = table.get(index,10);
  var fpa1 = table.get(index,11);
  var fna0 = table.get(index,12);
  var fna1 = table.get(index,13);
  var tna0 = table.get(index,14);
  var tna1 = table.get(index,15);
  //
  var data = {};
  data.dfn = dfn;
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
