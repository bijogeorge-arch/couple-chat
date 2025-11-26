import { Buffer } from 'buffer';
import process from 'process';
import { EventEmitter } from 'events';
import stream from 'stream-browserify';

// Set up global polyfills for simple-peer
if (typeof globalThis !== 'undefined') {
    globalThis.Buffer = Buffer;
    globalThis.process = process;
    globalThis.EventEmitter = EventEmitter;
    globalThis.stream = stream;
}

if (typeof window !== 'undefined') {
    window.global = window;
    window.Buffer = Buffer;
    window.process = process;
    window.EventEmitter = EventEmitter;
    window.stream = stream;
}

// Ensure process.env exists
if (!process.env) {
    process.env = {};
}
