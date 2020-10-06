function VideoManager() {
	let self = this;
	
	self.activeVideos = {};
	self.activeVideos.HTML5Videos = [];
	self.activeVideos.YouTubeVideos = [];
	self.activeVideos.iframeVideos = [];
	
	
	
	// formattedCorrectly = true means that all the video elements must:
	// - be wrapped in containers
	// - have the same class name
	// - have the correct tag names and necessary attributes
	// - have an id in the form video0, video1 etc
	self.createVideos = function(videoClass, containerClass="", formattedCorrectly=false) {
		const videoElmts = $(videoClass);
		for (i=0; i < videoElmts.length; i++) {
			let videoElmt = $(videoElmts[i]);
			const newID = "video"+i;
			if (! formattedCorrectly) {
				// Add video container to the video container
				videoElmt.replaceWith(('<div class="'+containerClass.substring(1)+'"><span><i>Loading&nbsp;video&nbsp;/&nbsp;playlist...</i></span></div>'));
				$(containerClass).append(videoElmt);
				videoElmt.attr("id", newID);
			}
			
			let src = videoElmt.attr("src");
			let info = self.getInfo(src);
			info.element = videoElmt;
			
			switch (info.source) {
				case "local":
					if (! formattedCorrectly) {
						// If the video is stored locally
						videoElmt.removeAttr("src");
						replaceTags(videoElmt, "video");
						videoElmt = $("#"+newID);
						
						// After the element has been 'created'
						videoElmt.append('<source src="'+src+'" type="'+info.format+'">');
						videoElmt.parent().attr("src-type", info.source);
						videoElmt.attr("controls", "true");
					}
					info.element = videoElmt; // readd the new element
					self.activeVideos.iframeVideos.push(info);
					break;
				
				case "YouTube":		
					if (! formattedCorrectly) {				
						videoElmt.removeAttr("src");
						videoElmt.parent().attr("src-type", info.source);
					}
					/*
					- YouTube.load() could be called from either in this switch statement, or right after this for loop.
					- at the end of this function, 'YT' is set to undefined, which means that onYouTubePlayerAPIReady can be called for each video, meaning multiple videos can be added seperately.
					- normally, onYouTubePlayerAPIReady would only be called once if 'YT' were not set to undefined.
					- however, for some reason, trying to call YouTube.load() directly with the video info will cause only the last video to load, even after setting YT = undefined. using YouTube.prepare() solves this.
					*/
					YouTube.prepare(info);
					YouTube.load();
					break;
					
				case "unknown":
					if (! formattedCorrectly) {
						// If the video is not local or from youtube, rename the current tag to be an iframe
						replaceTags(videoElmt, "iframe");
						videoElmt = $("#"+newID);
						
						// After the element has been modified
						videoElmt.parent().attr("src-type", "iframe");
					}
					info.element = videoElmt; // readd the new element
					self.activeVideos.iframeVideos.push(info);
					break;
			}
		}
	};
	
	self.getInfo = function(src) {
		const localRegex = RegExp("^(?:[a-z]+:)?//");
		const isLocalURL = ! localRegex.test(src) && src.endsWith(".mp4");
		const YouTubeRegex = RegExp("^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v|list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$");
		const isYouTubeURL = YouTubeRegex.test(src);
		let videoInfo;
		if (isLocalURL) { // if its a relative path (stored locally)
			videoInfo = {
				source: "local",
				format: "video/mp4"
			};
		} else if (isYouTubeURL) { // if its from youtube
			const ytID = src.match(YouTubeRegex);
			// Youtube video ID
			if (ytID[1].length == 11) {
				type = "video";
			// Youtube playlist ID
			} else if (ytID[1].length == 34) {
				type = "playlist";
			}
			videoInfo = {
				source: "YouTube",
				YouTubeID: ytID[1],
				type: type
			};
		} else { // player isnt recognised, go with generic iframe
			videoInfo = {
				source: "unknown"
			};
		}
		return videoInfo;
	};
	
	let replaceTags = function(elmt, newTag) {
		elmt = $(elmt);
		const oldTag = elmt.prop("tagName");
		
		// Replace opening tag
		const openTagRegex = new RegExp('<' + oldTag, 'i');
		newElmt = elmt[0].outerHTML.replace(openTagRegex, '<' + newTag);

		// Replace closing tag
		const closeTagRegex = new RegExp('</' + oldTag, 'i');
		newElmt = newElmt.replace(closeTagRegex, '</' + newTag);
		
		elmt.replaceWith(newElmt);
	};
	
	
	
	
	
	
	let YouTube = {};
		YouTube.videosToPlay = [];
		YouTube.prepare = function(video) {
		YouTube.videosToPlay.push(video);
	};
	YouTube.load = function() {
		window.onYouTubePlayerAPIReady = function() {
			for (const v of YouTube.videosToPlay) {
				let YTPlayer;
    			v.id = v.element.attr("id");
    			switch (v.type) {
    				case "video":
    					YTPlayer = YouTube.loadVideo(v.id, v.YouTubeID);
    					break;						
    				case "playlist":
    					YTPlayer = YouTube.loadPlaylist(v.id, v.YouTubeID);
    					break;
    			}
    			v.YTPlayer = YTPlayer;
    		    v.element = $("#"+v.id); // push the newly created iframe element
    			self.activeVideos.YouTubeVideos.push(v);
		    }
		    YouTube.videosToPlay = [];
			YT = undefined; // pesky YT object prevents onYouTubePlayerAPIReady from being called more than once
		};
		$.getScript('https://www.youtube.com/player_api');
	};
	YouTube.loadVideo = function(elmt, videoID) {
		let YTPlayer = new YT.Player(elmt, { // Creates the YT object
			playerVars: {
				modestbranding: 1,
				rel: 0,
				showinfo: 0,
				autoplay: false,
				targetOrigin: window.location.href
			},
			videoId: videoID,
			events: {
				'onReady': YouTube.ready
			}
		});
		return YTPlayer;
	};
	YouTube.loadPlaylist = function(elmt, playlistID) {
		let YTPlayer = new YT.Player(elmt, { // Creates the YT object
			playerVars: {
				modestbranding: 1,
				rel: 0,
				showinfo: 0,
				autoplay: false,
				listType: "playlist",
				list: playlistID,
				targetOrigin: window.location.href
			},
			events: {
				'onReady': YouTube.ready
			}
		});
		return YTPlayer;
	};
	YouTube.ready = function(e) {
		// Not using currently, but could be useful
		//e.target.seekTo(90);
		//e.target.stopVideo();
		e.target.pauseVideo();
	};
	
	
	
	
	
	
	let pauseVideoMethods = {};
	
	pauseVideoMethods.HTML5Videos = function(v) {
		v = v.element[0];
		v.pause();
	};
	pauseVideoMethods.YouTubeVideos = function(v) {
		v = v.YTPlayer;
		try {
			v.pauseVideo();
		} catch(err) { // If the youtube player hasnt fully loaded then use a postMessage to try and force it to stop
			let cmd = {
				"event": "command",
				"func": "pauseVideo"
			};
			v.contentWindow.postMessage(JSON.stringify(cmd), "*");
		}
	};
	pauseVideoMethods.iframeVideos = function(v) {
		v = v.element[0];
		const src = v.src;
		v.src = "";
		v.src = src;
	};
	
	
	
	self.pauseVideo = function(reqVideos) {
	    reqVideos = [].concat(reqVideos); // allows user to input a single string or an array
	    const a = self.activeVideos;
		for (const reqV of reqVideos) {
       	    for (const videos in a) {
    		    for (const v of a[videos]) {
    			    if (a[videos][v].element.attr("id") == reqV)
		                pauseVideoMethods[videos];
		        }
            }
		}
	};
	self.pauseAllVideos = function() {
	    const a = self.activeVideos;
	    for (const videos in a) {
    		for (const v of a[videos]) {
    			pauseVideoMethods[videos](v); // calls pauseVideoMethods.HTML5Videos(v) or whatever
    		}
	    }
	};
	
	
	
	self.clearVideo = function(reqVideos) {
	    reqVideos = [].concat(reqVideos); // allows user to input a single string or an array
   	    const a = self.activeVideos;
		for (const reqV of reqVideos) {
       	    for (const videos in a) {
    		    for (let v = 0; v < a[videos].length; v++) {
    			    if (a[videos][v].element.attr("id") == reqV) {
    			    	a[videos][v].element.parent().remove(); // remove the video container
    			    	a[videos].splice(v, 1);
    			    }
    			    continue;
    		    }
       	    }
		}
	}
	self.clearAllVideos = function() {
	    const a = self.activeVideos;
	    for (const videos in a) {
    	    for (const v of a[videos]) {
    	        v.element.parent().remove(); // remove the video container
    	    }
    	    a[videos] = [];
	    }
	}
	
}
