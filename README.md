# jQuery-videoManager
(this is highly scuffed currently but it works if using the correct video templates. ideally would make it easier to use but too lazy)

a video manager that can display, play and manage any video with a given URL/source

## requirements
jQuery 3.5.1+ **(not tested on previous versions)**

## creating the object
```javascript
let videoManager = new VideoManager();
```
## methods
the video 'template' element(s) must be created first. 

please note that (at the moment) you should not create the container for the video element template. this will be done with createVideos()

examples:
```
<template class="video-player" src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></template>
```
```
<div class="myVideoClass" src="/videos/test-video.mp4"></div>
```
```
<span class="video-player-class" src="https://player.vimeo.com/video/11899705"></span>
```
etc.

once all of the templates have been created, then the createVideos() method can be called:

```javascript
createVideos(videoClassName, videoContainerClassName)
```
createVideos() uses the classnames of the video(s) and their container(s), instead of passing through each video seperately.

once the videos have been created, you can use these methods below to manage each or all of the videos playing currently:

```javascript
pauseAllVideos()
```
```javascript
pauseVideo(String or Array [videoElmtID])
```
```javascript
clearAllVideos()
```
```javascript
clearVideo(String or Array [videoElmtID])
```
