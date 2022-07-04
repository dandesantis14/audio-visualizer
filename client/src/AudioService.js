export class AudioService {
    constructor () {
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    }
    createSource(audioElement) {
        const sourceElement = this.audioContext.createMediaElementSource(audioElement);
        sourceElement.connect(this.audioContext.destination)
    }
}