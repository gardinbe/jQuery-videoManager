# jQuery-videoManager
a video manager that can display, play and manage any video with a given URL/source

## requirements
jQuery 3.5.1+ **(not tested on previous versions)**

jQuery UI 1.12+ **(not tested on previous versions)**

## creating the object
```javascript
let videoManager = new VideoManager();
```
## methods
the video 'template' element(s) must be created first. examples:
```
<template class="video-player" src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></template>
```
or
```
<template class="video-player" src="/videos/test-video.mp4"></template>
```
etc

once all of the templates have been created, then the createVideos() method can be called.

```javascript
createVideos(videoClassName, videoContainerClassName)
```
createVideos() uses the classnames of the video(s) and their container(s), instead of passing through each video seperately.

once the videos have been created, you can use these methods below to manage each or all of the videos playing currently

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
