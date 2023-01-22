
function loadingredients(){
    console.log(ingredients.length); 
    var startPos = 100;
    for (var i = 0; i < ingredients.length; i++) { 
        console.log(ingredients[i]); 
        var val = document.createElement("div");
        val.innerHTML = ingredients[i];
        val.className = "ingredient";
        val.id = i; 
        var topPos = startPos + (i*20);
        val.style.top = topPos + "px";
        val.style.left = "0px";
        val.style.right = "0px";
        val.style.bottom = "0px";
        val.style.display = "inline"; 
        val.style.position = "absolute";
        val.style.height = "15px";
        val.style.width = "100px";
        val.style.fontSize = "10pt";
        val.onmousedown = function(e) { handleMouseDown(e)} ;
        val.onmousemove = function(e) { handleMouseMove(e)} ;;
        val.onmouseup = function(e) { handleMouseUp(e)} ;;
        document.body.appendChild(val);
        
    } 
}

var score = 0; 
var timer = 20; 
var curRecipe = -1;
var running = false; 

function afterWait(){
  timer -= 10; 
  console.log(timer); 
  document.getElementById("time").innerHTML = timer;
  if(timer == 0){
    running = false; 
    var button = document.getElementById("start");
    button.disabled = false; 
  }


}

function afterWait2(){
  while(timer > 10){
    running = true; 
  }
  myVar = setTimeout(afterWait, 10000);

}

var ingredientsFound = []; 

function onStart(){
    var recipeidx = Math.floor(Math.random() * recipes.length ) ;
    var recipe = document.getElementById("Recipe");
    recipe.innerHTML = recipes[recipeidx].name; 
    running = true; 
    var button = document.getElementById("start");
    button.disabled = true; 
    score = 0; 
    timer = 20; 
    document.getElementById("time").innerHTML = timer;
    document.getElementById("scorevalue").innerHTML = score;

    var inds = document.getElementById("ind");
    inds.innerHTML = "";
    for(var i = 0; i < recipes[recipeidx].ingredients.length; i++){
        inds.innerHTML += recipes[recipeidx].ingredients[i]; 
        inds.innerHTML += "<br/>"; 
        ingredientsFound[i] = 0; 
    }
    
    
    curRecipe = recipeidx;
      myVar = setTimeout(afterWait, 10000);
     
      myVar = setTimeout(afterWait2, 10000);
      console.log(timer); 


    
    
}

    function inBox(x,y) {
        return true;
    }
   var isDragging = false;
   var mouseXoffset = 0; 
   var mouseYOffset = 0; 
   var origXPos = 0;
   var origYPos = 0;
   var skilletXPos = 0;
   var skilletYPos = 0;
   var failed = false; 
   var success = false; 
   
   function handleMouseDown(evt) {
    if(!running){
      isDragging = false; 
    }
      if (inBox(evt.clientX,evt.clientY)) {
         isDragging = true; 
         evt.preventDefault();
         mouseXoffset = parseInt(evt.clientX);
         mouseYOffset = parseInt(evt.clientY); 
         var image = document.elementFromPoint(mouseXoffset, mouseYOffset);
         image.style.cursor = "move";
         origXPos = parseInt(image.style.left);
         origYPos = parseInt(image.style.top);
         console.log(origXPos, origYPos);
         var skillet = document.getElementById("skillet");
         skilletXPos = 200;
         skilletYPos = 50;
         console.log(skilletXPos, skilletYPos);
      }
   }
   
   function handleMouseUp(evt) {
     
     if(!running){
       isDragging = false; 
     }
      if (isDragging) {
        if(failed ){
          getNext(); 
          
        } else if(success) {
          getNext();
        }
         isDragging = false;	
         evt.preventDefault();
         mouseXoffset = parseInt(evt.clientX);
         mouseYOffset = parseInt(evt.clientY); 
         var image = document.elementFromPoint(mouseXoffset, mouseYOffset);
         image.style.top = origYPos;
         image.style.left = origXPos;
         mouseXoffset = 0; 
         mouseYOffset = 0;

   
        var skillet = document.getElementById("skillet");
        skillet.style.background = "white";
         	
      }
   }
   function allFound(){
     for(var i = 0; i < ingredientsFound.length; i++){
       if(ingredientsFound[i] == 0){
         return false; 
       }
     }
     return true; 
   }


   function getNext(){
    failed = false; 
    success = false; 
    for(var i = 0; i < recipes[curRecipe].ingredients.length; i++){
      ingredientsFound[i] = 0; 
    }
    var recipeidx = Math.floor(Math.random() * recipes.length ) ;
    var recipe = document.getElementById("Recipe");
    recipe.innerHTML = recipes[recipeidx].name; 
    var inds = document.getElementById("ind");
    inds.innerHTML = "";
    curRecipe = parseInt(recipeidx);
    console.log(recipeidx, curRecipe); 
    for(var i = 0; i < recipes[recipeidx].ingredients.length; i++){
        inds.innerHTML += recipes[recipeidx].ingredients[i]; 
        inds.innerHTML += "<br/>"; 
        ingredientsFound[i] = 0; 
    }
 

   }
   
   function inSkillet(curVal, x,y) { 
     if ( x > skilletXPos  && y > skilletYPos ) { 
        var match = false; 
        if(success){
          return; 
        }

        if (failed) {
          return;
        }
       for(var i = 0; i < recipes[curRecipe].ingredients.length; i++){
         if ( curVal == recipes[curRecipe].ingredients[i]) { 
           var skillet = document.getElementById("skillet");
           skillet.style.background = "red";
           ingredientsFound[i] = 1; 
           console.log(allFound()); 
            if(allFound()){
              score++; 
              document.getElementById("scorevalue").innerHTML = score;
              success = true; 
            } 
            match = true; 
         } 
         
         

       }

       if(!match) {
        console.log("fail"); 
         failed = true; 
         for(var i = 0; i < recipes[curRecipe].ingredients.length; i++){
          ingredientsFound[i] = 0; 
        }

      }

     } 
      
   } 

   function handleMouseMove(evt) {
    if(!running){
      isDragging = false; 
    }
   
      if (isDragging) {
        evt.preventDefault();
         var image = document.elementFromPoint(parseInt(evt.clientX), parseInt(evt.clientY));
         image.style.left = parseInt(image.style.left) + (parseInt(evt.clientX) - mouseXoffset); 
         image.style.top = parseInt(image.style.top) + (parseInt(evt.clientY) - mouseYOffset); 
         mouseXoffset = parseInt(evt.clientX); 
         mouseYOffset = parseInt(evt.clientY);
         inSkillet(image.innerHTML, parseInt(image.style.left) + 100, parseInt(image.style.top));
         
         
      }
   }

   
