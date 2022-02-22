
document.getElementById("play-button").addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})

document.getElementById("action-button").addEventListener("click", function() {
  play();
});

const bPat1 = [1,0,0,0, 1,1,0,0, 1,0,0,0, 1,1,0,0];
const bPat2 = [0,0,1,0, 0,0,1,1, 0,0,1,0, 0,0,1,1];



const myDiv = document.getElementById("dots-go-here");
const replacement = document.createElement('div');

let dots = [];
for (let i = 0; i < 16; i++) {
  const dot = document.createElement('span')
  dot.className =  bPat1[i] ? 'on-dot' : 'off-dot';
	dots.push(dot);
  replacement.appendChild(dot);
}
myDiv.parentNode.replaceChild(replacement, myDiv);

let noteSelect = document.getElementById('note-select');
let rhythm = ["4n", "8n", "8n", "4n", "4n"];



const sequenceBinaryPattern = (binaryPattern, synth, note) => {
  return (time) => {
    binaryPattern.forEach((item, i) => {
      if (item) {
        const dTime = Tone.Time("16n").toSeconds()
        synth.triggerAttackRelease(note, "16n", time + (dTime * i))
				scheduleBlink(dots[5], 1000);
      }
    });
  }
}



const play = () => {
  const synthA = new Tone.MembraneSynth().toDestination();
  const synthB = new Tone.MembraneSynth().toDestination();

  const lineA = sequenceBinaryPattern(bPat1,synthA,"C3");
  const lineB = sequenceBinaryPattern(bPat2,synthA,"E4");
  const loopA = new Tone.Loop((time) => {
    lineA(time);
    lineB(time);

  }, "1m").start(0);

  Tone.Transport.start();
};

function scheduleBlink(dot, interval) {
	setInterval(() => dot.classList.add('dot--once'), interval );
}
