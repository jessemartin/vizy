:sparkles:vizy:sparkles:
========================

A webaudio + canvas music visualizer.

<img src="http://i.imgur.com/7H7Fztz.png" alt="vizy screenshot" />

Installation
------------

First, run ```npm start``` to initialize and start the application. It will run the following:
* ```npm install``` to install tooling
* ```bower install``` to install vendor code
* ```gulp build``` to build minified javascript and css packages
* ```gulp server``` to start up the server


Usage
-----

Ensure ```gulp server``` is running, then navigate to [http://localhost:5000](http://localhost:5000) in your browser.

Drag an audio file onto the viewport to load and play it with interactive visualizations! **Note: The HTML5 File API takes a while to load files under Windows-based operating systems. Expect loading to take up to 20 seconds on Windows. OSX does not have this problem.**

Use the indicated keys (q, e, w, s, a, d) or the sliders in the upper left to control the speed, length and frequency response of the visualizer. **Note: Some audio files do not properly sample across the frequency spectrum. If the file starts playing and no visuals (or only a single dot) is present, adjust the frequency slider to pickup audio data.**
