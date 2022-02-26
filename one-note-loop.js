
document.getElementById("play-button").addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})

document.getElementById("action-button").addEventListener("click", function() {
  play();
});

const bPat1 = [1,0,0,0, 1,1,0,0, 1,0,0,0, 1,1,0,0];
const bPat2 = [0,0,1,0, 0,0,1,1, 0,0,1,0, 0,0,1,1];
const patterns = [bPat1, bPat2];

const originalDiv = document.getElementById("dots-go-here");
const replacement = document.createElement('div');

let dots = [];
for (let pat of patterns) {
	console.log("pat");
	let subDiv = document.createElement('div');
	let dotLine = [];
	for (let i = 0; i < 16; i++) {
	  const dot = document.createElement('span')
	  dot.className =  pat[i] ? 'on-dot' : 'off-dot';
		dotLine.push(dot);
	  subDiv.appendChild(dot);
	}
	dots.push(dotLine);
	replacement.appendChild(subDiv);
}
originalDiv.parentNode.replaceChild(replacement, originalDiv);

function createDotsFromPattern(pattern) {
	let subDiv = document.createElement('div');
	for (let i = 0; i < pattern.length; i++) {
	  const dot = document.createElement('span')
	  dot.className =  pat[i] ? 'on-dot' : 'off-dot';
	  subDiv.appendChild(dot);
	}
	return subDiv;
}


let i = 0;
const play = () => {
  const synthA = new Tone.MembraneSynth().toDestination();
  const synthB = new Tone.MembraneSynth().toDestination();

  const loopA = new Tone.Loop((time) => {
		processLine(patterns[0],dots[0], synthA, "C3", i, time);
		processLine(patterns[1],dots[1], synthB, "E4", i, time);
    i += 1;
    if (i >= 16) { i = 0};
  }, "16n").start(0);

  Tone.Transport.start();
};


function processLine(booleanLine, dots, synth, note, i, time) {
	if (booleanLine[[i % 16]]) {
		synth.triggerAttackRelease(note, "16n", time);
		dots[i % 16].classList.remove('dot--once');
    void dots[i % 16].offsetWidth;
    dots[i % 16].classList.add('dot--once');
	}
}
