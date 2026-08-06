const e_piano = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2.01,
    modulationIndex: 7,

    oscillator: {
        type: "sine"
    },

    modulation: {
        type: "sine"
    },

    envelope: {
        attack: 0.008,
        decay: 1.4,
        sustain: 0.35,
        release: 3.5
    },

    modulationEnvelope: {
        attack: 0.002,
        decay: 0.55,
        sustain: 0.08,
        release: 1
    },

    volume: -6
});

const chorus = new Tone.Chorus({
    frequency: 0.6,
    delayTime: 4.5,
    depth: 0.45,
    spread: 90,
    wet: 0.35
}).start();

const eq = new Tone.EQ3({
    low: 2,
    mid: 1.5,
    high: -2,
    lowFrequency: 250,
    highFrequency: 2800
});

const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 0.02,
    release: 0.25
});

const reverb = new Tone.Reverb({
    decay: 2.8,
    preDelay: 0.02,
    wet: 0.38
});

e_piano.chain(
    eq,
    compressor,
    chorus,
    reverb,
    Tone.Destination
);

const body = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: "triangle"
    },
    envelope: {
        attack: 0.015,
        decay: 1.2,
        sustain: 0.18,
        release: 3
    },
    volume: -15
});

body.chain(
    eq,
    compressor,
    chorus,
    reverb,
    Tone.Destination
);

Tone.Transport.swing = 0.3;
Tone.Transport.swingSubdivision = "8n";

let spans_octave = 4;
let btns_octave = 4;

const spans_notes = ["C", "D", "E", "F", "G", "A", "B"];
const btns_notes = ["C#", "D#", "F#", "G#", "A#"];

const spans = document.querySelectorAll("span.white-key");
const btns = document.querySelectorAll("button");

const lick = new Tone.Part((time, value) => {
	e_piano.triggerAttackRelease(value.note, value.dur, time, value.velocity);
	body.triggerAttackRelease(value.note, value.dur, time, value.velocity * 0.65);
}, [
	{ time: "0:0:0", note: "D5", dur: "8n", velocity: 0.8 },
	{ time: "0:0:2", note: "E5", dur: "8n", velocity: 0.8 },
	{ time: "0:1:0", note: "F5", dur: "8n", velocity: 0.8 },
	{ time: "0:1:2", note: "G5", dur: "8n", velocity: 0.8 },
	{ time: "0:2:0", note: "E5", dur: "4n", velocity: 0.8 },
	{ time: "0:3:0", note: "C5", dur: "8n", velocity: 0.8 },
	{ time: "0:3:2", note: "D5", dur: "2n", velocity: 0.8 },
]);

const porgy = new Tone.Part((time, value) => {
	e_piano.triggerAttackRelease(value.note, value.dur, time, value.velocity);
	body.triggerAttackRelease(value.note, value.dur, time, value.velocity * 0.65);
}, [
	{ time: "0:0:2", note: "E4", dur: "8n", velocity: 0.8 },
	{ time: "0:1:0", note: "G#4", dur: "8n", velocity: 0.8 },
	{ time: "0:1:2", note: "B4", dur: "8n", velocity: 0.8 },
	{ time: "0:2:0", note: "D#5", dur: "8n", velocity: 0.8 },
	{ time: "0:2:2", note: "F#5", dur: "4n", velocity: 0.8 },
]);

function playOnly(part) {
	Tone.Transport.stop();
	Tone.Transport.cancel();
	lick.stop();
	porgy.stop();

	if(part == "lick") {
		Tone.Transport.bpm.value = 120;
		lick.start(0);
	} else {
		Tone.Transport.bpm.value = 60;
		porgy.start(0);
	}
	Tone.Transport.start();
}

(function registerHandlers() {
	for(let i=0; i<spans.length; i++) {
		const note_name = spans_notes[i % spans_notes.length];
		const note = `${note_name}${spans_octave}`;
		if(note === "D5") {
			spans[i].addEventListener('click', async () => {
				await Tone.start();
				playOnly('lick');
			});
		} else {
			spans[i].addEventListener('click', async () => {
				await Tone.start();
				e_piano.triggerAttackRelease(note, '4n');
			});
		}
		if(i%spans_notes.length === spans_notes.length-1) { spans_octave++; }
	}

	for(let i=0; i<btns.length; i++) {
		const note_name = btns_notes[i % btns_notes.length];
		const note = `${note_name}${btns_octave}`;
		if(note === "G#5") {
			btns[i].addEventListener('click', async () => {
				await Tone.start();
				playOnly("porgy");
			});
		} else {
			btns[i].addEventListener('click', async () => {
				await Tone.start();
				e_piano.triggerAttackRelease(note, '4n');
			});
		}
		if(i%btns_notes.length === btns_notes.length-1) { btns_octave++; }
	}
})();
