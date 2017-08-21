# osdUseCaseHCS
Example Openseadragon for viewing High Content Screening multi-channel images
## Installation
Clone the repository to a web server that can serve the ```index.html``` file and files from the two subfolders ```images``` and ```js```.
In your browser open the ```index.html``` page
## What you get
![Image of ](https://docs.google.com/drawings/d/1YOca0YjIkSmU3WoFwW1JQy0SwnaGhyf5I-Yg0iRPbyI/pub?w=769&h=698)
## Usage
Once the ```index.html``` page is loaded click the ```<RETRIEVE>``` button to retrieve the cellular multi-channel images. 
Each field of view has been imaged with 4 different channels resulting in 4 images per field of view. At the beginning these images are displayed in 4 different rows 
but the user has the option to select a different layout by adjusting the number of rows/columns and the 'layout strategy' of either filling first the rows or columns.

## Creating Multi-Channel Layouts
The 4 different channel images can be overlayed to create a composite image. This is created by placing all images at the sam eposition on the canvas and adjusting their transparency. 
This is still work in progress and does not result in optimal visualization. You may need to adjust the brightness and contrast controls.

## Openseadragon Plugins
This demonstration includes 2 different OSD plugins. The filtering plugin and the annotations plugin. Please, refer to these plugin for usage details.

