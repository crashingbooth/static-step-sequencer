
document.getElementById("play-button").addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})

document.getElementById("action-button").addEventListener("click", function() {
  play();
});

document.getElementById("stop-button").addEventListener("click", function() {
  Tone.Transport.stop();
});

const bPat1 = [1,0,0,0, 1,1,0,0, 1,0,0,0, 1,1,0,0];
const bPat2 = [0,0,1,0, 0,0,1,1, 0,0,1,0, 0,0,1,1];
const notes = ["C3", "E4"];
const patterns = [bPat1, bPat2];
const synthA = new Tone.MembraneSynth().toDestination();
const synthB = new Tone.MembraneSynth().toDestination();
const synths = [synthA, synthB];


const originalDiv = document.getElementById("dots-go-here");


function createDotsFromPattern(pattern) {
	let subDiv = document.createElement('div');
	for (let i = 0; i < pattern.length; i++) {
	  const dot = document.createElement('span')
	  dot.className =  pattern[i] ? 'on-dot' : 'off-dot';
	  subDiv.appendChild(dot);
	}
	return subDiv;
}

function createObjectBundleFromPattern(pat, note, synth) {
	return { dotsDiv: createDotsFromPattern(pat),
	 				 pattern: pat,
					 note: note,
					 synth: synth,
				}
}

let lineBundles = [];
let replacement = document.createElement('div');
for (let i = 0; i < patterns.length; i++) {
	let lineBundle = createObjectBundleFromPattern(patterns[i], notes[i], synths[i]);
	console.log(lineBundle);
	replacement.appendChild(lineBundle.dotsDiv);
	lineBundles.push(lineBundle);
}
originalDiv.parentNode.replaceChild(replacement, originalDiv);


let i = 0;
const play = () => {
  const loopA = new Tone.Loop((time) => {
		for (let lineBundle of lineBundles) {
			processLineBundle(lineBundle, i, time);
		}
    i += 1;
    if (i >= 16) { i = 0};
  }, "16n").start(0);

  Tone.Transport.start();
};


function processLineBundle(lineBundle, i, time) {
	// let {pattern, dotsDiv, note, synth} = lineBundle;
	let dots = lineBundle.dotsDiv.children;
	if (lineBundle.pattern[[i % 16]]) {
		lineBundle.synth.triggerAttackRelease(lineBundle.note, "16n", time);
		dots[i % 16].classList.remove('dot--once');
    void dots[i % 16].offsetWidth;
    dots[i % 16].classList.add('dot--once');
	}
}
