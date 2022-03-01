
document.getElementById("play-button").addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})

document.getElementById("action-button").addEventListener("click", function() {
  play();
});

document.getElementById("stop-button").addEventListener("click", function() {
  Tone.Transport.stop();
	loopA.cancel();
});

document.getElementById("swap-button").addEventListener("click", function() {
  swapLoops();
});

document.getElementById("random1-button").addEventListener("click", function() {
  randomReplace(1);
});

document.getElementById("random2-button").addEventListener("click", function() {
  randomReplace(2);
});


const bPat1 = [1,0,0,0, 1,1,0,0, 1,0,0,0, 1,1,0,0];
const bPat2 = [0,0,1,0, 0,0,1,1, 0,0,1,0, 0,0,1,1];
const bPat3 = [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,1,0];
const bPat4 = [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,1,0,1];
const bPat5 = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0];
const notes = ["C3", "C4", "G4"];
let patterns = [bPat1, bPat2, bPat5];
let state = true;
const synthA = new Tone.MembraneSynth().toDestination();
const synthB = new Tone.MembraneSynth().toDestination();
const synthC = new Tone.MembraneSynth().toDestination();
const synths = [synthA, synthB, synthC];


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
function setNotes(patterns, notes, synths) {
	lineBundles = [];
	let replacement = document.createElement('div');
	for (let i = 0; i < patterns.length; i++) {
		let lineBundle = createObjectBundleFromPattern(patterns[i], notes[i], synths[i]);
		replacement.appendChild(lineBundle.dotsDiv);
		lineBundles.push(lineBundle);
	}
	originalDiv.replaceChildren(replacement);
	// originalDiv.parentNode.replaceChild(replacement, originalDiv);
}

function swapLoops() {
	patterns = state ? [bPat3, bPat4, bPat5] : [bPat1, bPat2, bPat5];
	state = !state;
	setNotes(patterns, notes, synths);
}

function randomReplace(index) {
	let pat = [];
	for (let i = 0; i < 16; i++) {
		pat.push(Math.round(Math.random()));
	}
	patterns[index] = pat;
	setNotes(patterns, notes, synths);
}

// execution at start
setNotes(patterns, notes, synths);

// play loop
let i = 0;
let loopA;
const play = () => {
  loopA = new Tone.Loop((time) => {
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
