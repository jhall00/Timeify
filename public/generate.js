// length hint
var lengthQ = document.getElementById("lengthQ")

var lengthInst = document.getElementById("lengthInstructions")
lengthQ.onmouseover = function(){
    lengthInst.style.visibility = "visible"

};
lengthQ.onmouseout = function(){
    lengthInst.style.removeProperty("visibility")
};

//source hint
var sourceQ = document.getElementById("sourceQ")

var sourceInst = document.getElementById("sourceInstructions")
sourceQ.onmouseover = function(){
    sourceInst.style.visibility = "visible"

};
sourceQ.onmouseout = function(){
    sourceInst.style.removeProperty("visibility")
};

//name hint
var nameQ = document.getElementById("nameQ")

var nameInst = document.getElementById("nameInstructions")
nameQ.onmouseover = function(){
    nameInst.style.visibility = "visible"

};
nameQ.onmouseout = function(){
    nameInst.style.removeProperty("visibility")
};
