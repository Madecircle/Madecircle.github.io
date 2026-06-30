const synth = new Tone.Synth().toDestination();

const spans_notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
const btns_notes = ["C#4", "D#4", "F#4", "G#4", "A#4"];

const spans = document.querySelectorAll("span.white-key");
for(let i=0; i<spans.length; i++) {
	spans[i].addEventListener('click', async () => {
		await Tone.start();
		synth.triggerAttackRelease(spans_notes[i % spans_notes.length], '4n');
	});
}

const btns = document.querySelectorAll("button");
for(let i=0; i<btns.length; i++) {
	btns[i].addEventListener('click', async () => {
		await Tone.start();
		synth.triggerAttackRelease(btns_notes[i % btns_notes.length], '4n');
	});
}
