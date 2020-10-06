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
```javascript
createVideos(videoClassName, videoContainerClassName)
// this method uses the classnames of the video(s) and their container(s), instead of passing through each video seperately - the 'template' element must be created beforehand.
// example of a template element:
```

<template class="video-player" src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></template>

or

<template class="video-player" src="/videos/test-video.mp4"></template>

etc

pauseAllVideos()

pauseVideo(String or Array [videoElmtID])

clearAllVideos()

clearVideo(String or Array [videoElmtID])
```
