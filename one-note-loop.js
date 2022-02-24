
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



let i = 0;
const play = () => {
  const synthA = new Tone.MembraneSynth().toDestination();
  const synthB = new Tone.MembraneSynth().toDestination();

  const loopA = new Tone.Loop((time) => {
    if (bPat1[i % 16]) {
      synthA.triggerAttackRelease("C3", "16n", time);
    }
    dots[i % 16].classList.remove('dot--once');
    void dots[i % 16].offsetWidth;
    dots[i % 16].classList.add('dot--once');
    if (bPat2[i % 16])
      synthB.triggerAttackRelease("E4", "16n", time);
    i += 1;
    if (i >= 16) { i = 0};
  }, "16n").start(0);

  Tone.Transport.start();
};
