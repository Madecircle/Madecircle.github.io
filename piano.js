const synth = new Tone.Synth().toDestination();

let spans_octave = 4;
let btns_octave = 4;

const spans_notes = ["C", "D", "E", "F", "G", "A", "B"];
const btns_notes = ["C#", "D#", "F#", "G#", "A#"];

const spans = document.querySelectorAll("span.white-key");
const btns = document.querySelectorAll("button");

(function registerHandlers() {
	for(let i=0; i<spans.length; i++) {
		const note_name = spans_notes[i % spans_notes.length];
		const note = `${note_name}${spans_octave}`;
		if(note === "D5") {
			spans[i].addEventListener('click', async () => {
				await Tone.start();
				const melody = new Tone.Part((time, value) => {
				    // value contains both the pitch and the custom duration
				    synth.triggerAttackRelease(value.note, value.dur, time);
				}, [
				    { time: "0:0:0", note: "D5", dur: "8n" },   // Quarter note
				    { time: "0:0:2", note: "E5", dur: "8n" },   // Eighth note
				    { time: "0:1:0", note: "F5", dur: "8n" },   // Eighth note
				    { time: "0:1:2", note: "G5", dur: "8n" },   // Eighth note
				    { time: "0:2:0", note: "E5", dur: "4n" },   // Half note
				    { time: "0:3:0", note: "C5", dur: "8n" },   // Next measure
				    { time: "0:3:2", note: "D5", dur: "2n" },   // Next measure
				]);
				melody.start(0);
				Tone.Transport.start();
			});
		} else {
			spans[i].addEventListener('click', async () => {
				await Tone.start();
				synth.triggerAttackRelease(note, '4n');
			});
		}
		if(i%spans_notes.length === spans_notes.length-1) { spans_octave++; }
	}

	for(let i=0; i<btns.length; i++) {
		const note_name = btns_notes[i % btns_notes.length];
		const note = `${note_name}${btns_octave}`;
		btns[i].addEventListener('click', async () => {
			await Tone.start();
			synth.triggerAttackRelease(note, '4n');
		});
		if(i%btns_notes.length === btns_notes.length-1) { btns_octave++; }
	}
})();
