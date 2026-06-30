const synth = new Tone.Synth().toDestination();

let spans_octave = 4;
let btns_octave = 4;

const spans_notes = ["C", "D", "E", "F", "G", "A", "B"];
const btns_notes = ["C#", "D#", "F#", "G#", "A#"];

const spans = document.querySelectorAll("span.white-key");
for(let i=0; i<spans.length; i++) {
	const note_name = spans_notes[i % spans_notes.length];
	const note = `${note_name}${spans_octave}`;
	spans[i].addEventListener('click', async () => {
		await Tone.start();
		synth.triggerAttackRelease(note, '4n');
		// console.log(note);
	});
	if(i%spans_notes.length === spans_notes.length-1) { spans_octave++; }
}

const btns = document.querySelectorAll("button");
for(let i=0; i<btns.length; i++) {
	const note_name = btns_notes[i % btns_notes.length];
	const note = `${note_name}${btns_octave}`;
	btns[i].addEventListener('click', async () => {
		await Tone.start();
		synth.triggerAttackRelease(note, '4n');
		// console.log(note);
	});
	if(i%btns_notes.length === btns_notes.length-1) { btns_octave++; }
}
