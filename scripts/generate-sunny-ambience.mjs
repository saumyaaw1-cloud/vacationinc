import { writeFile } from "node:fs/promises";

const sampleRate = 22050;
const duration = 18;
const sampleCount = sampleRate * duration;
const samples = new Float32Array(sampleCount);
let seed = 1986;
let low = 0;
let previousNoise = 0;

function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function addBird(start, baseFrequency) {
  const chirpLength = Math.floor(sampleRate * 0.48);
  const startIndex = Math.floor(start * sampleRate);

  for (let index = 0; index < chirpLength; index += 1) {
    const progress = index / chirpLength;
    const time = index / sampleRate;
    const envelope = Math.sin(Math.PI * progress) ** 2;
    const frequency = baseFrequency + 900 * Math.sin(progress * Math.PI);
    samples[startIndex + index] +=
      Math.sin(2 * Math.PI * frequency * time) * envelope * 0.055;
  }
}

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  const noise = random() * 2 - 1;
  low = low * 0.994 + noise * 0.006;
  const airy = noise - previousNoise;
  previousNoise = noise;

  const longWave = (Math.sin(time * Math.PI * 0.24) + 1) / 2;
  const smallWave = (Math.sin(time * Math.PI * 0.68 + 1.2) + 1) / 2;
  const surfEnvelope = 0.18 + longWave * 0.22 + smallWave * 0.06;
  const foam = longWave ** 5 * airy * 0.07;
  const water = low * surfEnvelope * 2.1;

  samples[index] = water + foam;
}

[
  [2.8, 1550],
  [3.45, 1780],
  [8.1, 1650],
  [12.7, 1480],
  [13.28, 1880],
].forEach(([start, frequency]) => addBird(start, frequency));

const bytesPerSample = 2;
const dataSize = sampleCount * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
buffer.writeUInt16LE(bytesPerSample, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

for (let index = 0; index < sampleCount; index += 1) {
  const value = Math.max(-1, Math.min(1, samples[index]));
  buffer.writeInt16LE(Math.round(value * 32767), 44 + index * 2);
}

await writeFile("assets/sunny-poolside.wav", buffer);
