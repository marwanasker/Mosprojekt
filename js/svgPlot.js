var green = "rgb(0,255,0)";
var plotMaxValues = 100;
var cogPlot = [0];

function line(x1, y1, x2, y2, color) {
  var svg_namespace = "http://www.w3.org/2000/svg";
  var newLine = document.createElementNS(svg_namespace, "line");

  //newLine.setAttribute('id','line2');
  newLine.setAttribute('x1', x1);
  newLine.setAttribute('y1', y1);
  newLine.setAttribute('x2', x2);
  newLine.setAttribute('y2', y2);
  newLine.setAttribute("stroke", color);

  return newLine;
}

function clearPlot(plot) {
  var n = plot.childNodes.length;
  for (i = 0; i < n; i++) {
    plot.childNodes[0].remove();
  }
}

function plotArray(plot, array, color) {
  clearPlot(plot);

  var width = plot.getBoundingClientRect().width;
  var height = plot.getBoundingClientRect().height;

  var x1, y1, x2, y2;

  for (i = 0; i < array.length - 1; i++) {

    x1 = i*(width/array.length);
    y1 = height - array[i]*300;
    x2 = (i+1)*(width/array.length);
    y2 = height - array[i+1]*300;

    plot.appendChild(line(x1, y1, x2, y2, color));
  }

}

function pushPlot(value, plotArray, max) {
  if (plotArray.length > max) {
    plotArray.shift();
  }
  plotArray.push(value);
}

function init() {
  var plot = document.getElementById("plot");
  plotArray(plot, cogPlot, "red");
}
