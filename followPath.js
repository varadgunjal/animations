queue()
.defer(d3.xml, "wiggle.svg", "image/svg+xml")
.await(ready);

function ready(error, xml) {

  //Adding our svg file to HTML document
  var importedNode = document.importNode(xml.documentElement, true);
  d3.select("#pathAnimation").node().appendChild(importedNode);

  var svg = d3.select("svg");

  var path = svg.select("path#wiggle"),
  startPoint = pathStartPoint(path);

  var marker = svg.append("circle");
  marker.attr("r", 5).attr("id", "marker")
        .attr("transform", "translate(" + startPoint + ")");

  transition();

  //Get path start point for placing marker
  function pathStartPoint(path) {
    var d = path.attr("d"),
    dsplitted = d.split(" ");
    return dsplitted[1].split(",");
  }

  function transition() {
    marker.transition()
        .duration(4000)        
        .attrTween("cx", function() {
            var start = d3.select(this).attr("cx"),
                i = d3.interpolate(start, 200)
            return function(t) {                      
                var current = i(t);
                svg.select("line.tmp").attr("x2", current);
                return current;
            }
        })
        .attrTween("cy", function() {
            var start = d3.select(this).attr("cy"),
                i = d3.interpolate(start, 200)
            return function(t) {
                var current = i(t);
                svg.select("line.tmp").attr("y2", current);
                return current;
            }
        })
        .each("start", function() {
            svg.append("line").attr("class", "tmp")
            .attr("stroke", "red")
            .attr("stroke-width", 2)            
            .attr("x1", d3.select(this).attr("cx"))
            .attr("y1", d3.select(this).attr("cy"))
        })
        .each("end", function() {
            svg.select("line.tmp").remove();
        })
        // .each("end", transition);// infinite loop    
  }
  
  function translateAlong(path) {
    var l = path.getTotalLength();
    return function(i) {
      return function(t) {
        var p = path.getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";//Move marker
      }
    }
  }
}

