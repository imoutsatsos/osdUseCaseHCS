/* 
WIP functions supporting loading, layout, Colorization and Filtering
of image sets into Openseadragon iiif viewer
@author: Ioannis K. Moutsatsos
@lastUpdate: AUG-2017
*/

var positionEl = document.querySelectorAll('.info .position')[0];
var zoomEl = document.querySelectorAll('.info .zoom')[0];
Caman.Store.put = function() {}; 
jQuery.noConflict();
 
 jQuery(document).ready(function() {
   var viewer = OpenSeadragon({
     id: "openseadragon1",
     prefixUrl: "js/osdImages/",
     preserveViewport: true,
     crossOriginPolicy:"Anonymous",
     //toolbar: "toolbarDiv",
     viewportMargins: {
       bottom: 120
     },
     tileSources: []
   });
 
   viewer.addHandler('open', function() {
     var count = viewer.world.getItemCount();
     var labelArray = document.getElementById('i2vlabels').value.split(",");
     //var imageIdArray= document.getElementById('i2vlabels').value.split(",");
     var pos = new OpenSeadragon.Point(0, 0);
     var i;
     var rn = document.getElementById('gridRows').value
     var overlayDisplacement=1
     var imgPerComposite=1
     var noAnno = document.getElementById("noAnno").checked
     var fillStrategy = jQuery("input[type='radio'][name='fillBy']:checked").val()
     //Clean up image labels if they will be overlayed
     if (jQuery('#getOverlay').is(":checked")){    
         labelArray=getNoNameLabels(labelArray);
         }
     for (i = 0; i < count; i++) {

       image = viewer.world.getItemAt(i)
        //X-Y displacement of an image in the world depends on whether we will overlay it to others
       if (jQuery('#getOverlay').is(":checked")){
       imgPerComposite=document.getElementById('imgPerComposite').value    
       if (i % imgPerComposite==0){
       console.log('Move Placement on:' + i)
       image.setOpacity(1);
       overlayDisplacement=1
       }else{
       console.log ('Decreasing Opacity:'+1/((i%imgPerComposite)*2))
       image.setOpacity(1/((i%imgPerComposite)*2));
       overlayDisplacement=0
       console.log('Overlay Placement on:' + i)
       }
       	}
       	
	if (!noAnno) {
         jQuery(".imgInfo").append("<div id=Meta" + i + "><p style=color:red >" + labelArray[i] + "</p> </div>");
       }
       
       if (i% rn== 0 && i% imgPerComposite==0) {     


         if (i > 0 ) {
           if (fillStrategy == 'rowsFirst') {
             pos.y = 0;
             pos.x += image.getBounds().width*overlayDisplacement;
             image.setPosition(pos, true);
           } else {
             //columnFirst
             pos.x = 0;
             pos.y += image.getBounds().height*overlayDisplacement;
             image.setPosition(pos, true);
           }

           if (!noAnno) {
             viewer.addOverlay("Meta" + i, image.getBounds(), OpenSeadragon.Placement.BOTTOM);
           }
         } else {
           if (fillStrategy == 'rowsFirst') {
             pos.y = 0 //+= image.getBounds().height;
           } else {
             //column first
             pos.x = 0
           }
           image.setPosition(pos, true);
           if (!noAnno) {
             viewer.addOverlay("Meta" + i, image.getBounds(), OpenSeadragon.Placement.BOTTOM);
           }
         }

       } else {
         if (fillStrategy == 'rowsFirst') {
           pos.y += image.getBounds().height*overlayDisplacement;
         } else {
           pos.x += image.getBounds().width*overlayDisplacement;
         }
         //image.setOpacity(0.3); //for overlays
         image.setPosition(pos, true);
         if (!noAnno) {
           viewer.addOverlay("Meta" + i, image.getBounds(), OpenSeadragon.Placement.BOTTOM);
         }
       }
     }
     imageObjectsList= getImageObjectColors();
     theFilters=assignImageColors(viewer, imageObjectsList)
     //apply the Color filters
      viewer.setFilterOptions({ 
       filters: theFilters
		});
     viewer.viewport.goHome(true);
   }); //end addHandler-open
	
	viewer.initializeAnnotations();
   	//const annotations = new OpenSeadragon.Annotations({viewer});

   jQuery.exposed = {
     viewer: viewer
   }
   
 });

 //we open the OSD viewer with a new set of images
 function viewImage(viewer, imageCsv) {
   imgName = document.getElementById(imageCsv).value;
   //OSD viewer API method
   viewer.open(tileSources);
   viewer.viewport.goHome(true);
 } //end of function

 function viewImageTiles(viewer) {
   imgName = document.getElementById("i2v").value;
   tileSources = imgName.split(",").map(function(it){return{type:'image',url:it}})
     //OSD viewer API method
   viewer.world.resetItems()
   console.log('Reset-viewer world')
   viewer.open(tileSources);
    //sets a parameter to pass to the build
    document.getElementById('fillStrategy').value= document.getElementById('gridRows').value+','+jQuery("input[type='radio'][name='fillBy']:checked").val();
 } //end of function

 
  /*assign image colors from UI properties*/ 
 function assignImageColors(viewer, imageObjectsList){
 	//add corresponding images to imageObjectsList
 	imageIdArray= document.getElementById('i2vlabels').value.split(",");
 	imageObjectsList.forEach(function(imo){
 	imObjName=imo.imageObject
 	// a bit convoluted js to find indices of specific object types in viewer.world
	matchedImageIndex=jQuery.grep(imageIdArray.map(function(it,index){return {'fi':index, 'o':it.split('@')[0]}}),
	function(n,i){return n.o==imObjName}).map(function(item,ind){return item.fi});
 	objImages=[]
 	matchedImageIndex.forEach(function(mi){
 		objImages.push(viewer.world.getItemAt(mi))
 		}); //end for each matchedImageIndex
 	imo['images']=objImages
 	
 	});
 	//console.log(imageObjectsList);

	theFilters=[]	
	imageObjectsList.forEach (function(imo){
	theFilters.push({
		'items':imo.images, 
		'processors':[
	         function(context, callback) {
	            Caman(context.canvas, imo.color, function() {
			this.channels(
			    {red: imo.color.red, green: imo.color.green, blue: imo.color.blue}
			  )
			   this.render(callback);
			            });
			        },
		OpenSeadragon.Filters.BRIGHTNESS(Number(imo.brightness)),
	]}
	) //end push
	});
	return theFilters
 } //end assignImageColors
 
 /* function creates a list of color properties for each of the checked image objects 
   color is returned both as a hex string, as well as a map of rgba color values and transparency
 */
 function getImageObjectColors(){
	 objPropsList=[];
	 checkedImageObjects=[]
	 if (jQuery("[id*='choice-parameter']").size()==0){
	 checkedImageObjects=jQuery("[id*='channel']:checked")
	 }else{
	 checkedImageObjects=jQuery("[id*='choice-parameter']").has("input[value='IMAGE_OBJECTS']").find("input[type='checkbox'][name='value']:checked")
	 }
	 checkedImageObjects.each(function(){
	 objectName=this.getAttribute('value')
	 objectColor=document.getElementById("colpick_"+objectName).value;
	 colorBrightness=document.getElementById("bright_"+objectName).value;
	 objProps={'imageObject':objectName, 'brightness':colorBrightness, 'colorHex':objectColor, 'color':convertHex(objectColor,100)}
	 objPropsList.push(objProps) 
	 });//end for each
	 console.log(objPropsList)
	 return objPropsList
 }
 
/*function to convert a hex color to rgb */
function convertHex(hex,opacity){   
    hex = hex.replace('#','');
    rgbColor={
    'red' : parseInt(hex.substring(0,2), 16)-255,
    'green' : parseInt(hex.substring(2,4), 16)-255,
    'blue' : parseInt(hex.substring(4,6), 16)-255,
    'a' : opacity/100
    }
    return rgbColor;
}

/*function for filter*/
function changeFilter(viewer, filterType, currentValue, spanItem){
brightValue=jQuery('#set_brightness').val();
contrastValue=jQuery('#set_contrast').val();
console.log('currentBrightness='+brightValue);
console.log('currentContrast='+ contrastValue);

     imageObjectsList= getImageObjectColors();
     theFilters=assignImageColors(viewer, imageObjectsList)
     theFilters.forEach(function(filt){
     filt.processors.push(OpenSeadragon.Filters.BRIGHTNESS(Number(brightValue)))
     filt.processors.push(OpenSeadragon.Filters.CONTRAST(contrastValue))
     });
     
     //apply the filter set (color and adjustments)
      viewer.setFilterOptions({ 
       filters: theFilters
		});
     jQuery(spanItem).html(currentValue); 
} //end function changeFilter

/*returns label array without the object name prefix*/
function getNoNameLabels(labelsWithNames){
return labelsWithNames.map(function(lbl){return lbl.split('@')[1]})

}//end getNoNameLabels function
