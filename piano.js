const synth = new Tone.Synth().toDestination();

const span_notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
const btns_notes = ["C#4", "D#4", "F#4", "G#4", "A#4"];

const btns = document.querySelectorAll("button");
for(let i=0; i<btns.length; i++) {
	btns[i].addEventListener('click', async () => {
		await Tone.start();
		synth.triggerAttackRelease(btns_notes[i], '4n') 
	});
}
