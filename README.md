# osdUseCaseHCS
Example [OpenSeadragon](http://openseadragon.github.io/) for viewing High Content Screening multi-channel images. These are cellular images obtained using a digital microscope for medical reserach. Cells are stained with fluorescent dies that stain specific cellular structures and proteins, and then imaged at multiple wavelengths (channels) allowing the observation of a single die/structure/protein at a time. Comparisons between fields of views from differnt treatments and the ability to overlay the multiple-channels to a single composite are all central requirements that this example demonstrates
## Installation
Clone the repository to a web server that can serve the ```index.html``` file and files from the two subfolders ```images``` and ```js```.
In your browser open the ```index.html``` page
## What you get
![Image of ](https://docs.google.com/drawings/d/1YOca0YjIkSmU3WoFwW1JQy0SwnaGhyf5I-Yg0iRPbyI/pub?w=769&h=698)
## Usage
Once the ```index.html``` page is loaded click the ```RETRIEVE``` button to retrieve the cellular multi-channel images. 
Each field of view has been imaged with 4 different channels resulting in 4 images per field of view. At the beginning these images are displayed in 4 different rows but the user has the option to select a different layout by adjusting the number of rows/columns and the 'layout strategy' of either filling first the rows or columns.

## Creating Multi-Channel Overlays
The 4 different channel images can be combined to a single color composite by checking the ```Overlay using``` checkbox and clicking the ```RETRIEVE``` button again. Composites are currently created by overlaying the corresponding field of view images from all (or selected) channels. The custom code for the layout and overlay strategies is found in the  [imageGalleryAnnoDemo.js](https://github.com/imoutsatsos/osdUseCaseHCS/blob/master/js/imageGalleryAnnoDemo.js). 

Essentially, to achieve a color composite effect from the **grayscale channel images** , we apply a colorizing filter and then position the images belonging to the same field of view at the same canvas position. Using the OSD image opacity method the images are made semi-transparent so all the images in the color stack can be visualized.
![Image of ](https://docs.google.com/drawings/d/1LxMV2A3KoM6_U-NvV1sDv4mGolY7xvzTU_bR1WvNoP0/pub?w=365&h=715)

This is still **work in progress**  and does not result in optimal brightness for the composite image. Since each overlaid image is only partially transparent, it reduces the intensity of images deeper in the stack. As a result, after overlaying the images, you may need to adjust the brightness and contrast controls. Also, you may need to 'nudge' the image to see the updated colors.

## OpenSeadragon Plugins
This demonstration makes use of the [OSD viewer](http://openseadragon.github.io/) and two of the OSD plugins. The [filtering](https://github.com/usnistgov/OpenSeadragonFiltering) plugin and the [annotations](https://github.com/Emigre/openseadragon-annotations) plugin. Please, refer to these plugin for usage details.

## Limitations
The OpenSeadragon viewer is not able to display 16bit TIFF images (typical digital microscopy format) directly. In actual usage, we use the Cantaloupe IIIF compatible server to serve digital microscopy images. The image server is responsible for creating jpeg tiles from the TIFF images that can be visualized in the OSD viewer.
