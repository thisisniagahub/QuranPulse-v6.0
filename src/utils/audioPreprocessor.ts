/**
 * Audio Preprocessor - Web Audio API-based audio cleaning
 * Features: Noise reduction, VAD, Normalization
 */

export interface AudioProcessingResult {
    cleanedBlob: Blob;
    metadata: {
        originalDuration: number;
        processedDuration: number;
        noiseLevel: number;
        peakAmplitude: number;
        voiceActivityDetected: boolean;
    };
}

export interface AudioProcessorConfig {
    noiseGateThreshold: number; // 0-1, default 0.02
    normalizationTarget: number; // dB, default -3
    vadSensitivity: number; // 0-1, default 0.5
    sampleRate: number; // Hz, default 16000
}

const DEFAULT_CONFIG: AudioProcessorConfig = {
    noiseGateThreshold: 0.02,
    normalizationTarget: -3,
    vadSensitivity: 0.5,
    sampleRate: 16000,
};

/**
 * Audio Preprocessor class for cleaning Quran recitation audio
 */
export class AudioPreprocessor {
    private audioContext: AudioContext | null = null;
    private config: AudioProcessorConfig;

    constructor(config: Partial<AudioProcessorConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Initialize AudioContext (must be called after user interaction)
     */
    async initialize(): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new AudioContext({ sampleRate: this.config.sampleRate });
        }
    }

    /**
     * Process audio blob through cleaning pipeline
     */
    async process(audioBlob: Blob): Promise<AudioProcessingResult> {
        await this.initialize();

        if (!this.audioContext) {
            throw new Error('AudioContext not initialized');
        }

        // Decode audio
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        // Get raw samples
        const samples = audioBuffer.getChannelData(0);
        const originalDuration = audioBuffer.duration;

        // Calculate noise level
        const noiseLevel = this.calculateNoiseFloor(samples);

        // Apply noise gate
        const gatedSamples = this.applyNoiseGate(samples, noiseLevel);

        // Apply VAD
        const { trimmedSamples, voiceActivityDetected } = this.applyVAD(gatedSamples);

        // Normalize
        const normalizedSamples = this.normalize(trimmedSamples);

        // Calculate peak amplitude
        const peakAmplitude = this.calculatePeakAmplitude(normalizedSamples);

        // Create output buffer
        const outputBuffer = this.audioContext.createBuffer(
            1,
            normalizedSamples.length,
            this.config.sampleRate
        );
        outputBuffer.getChannelData(0).set(normalizedSamples);

        // Encode to WAV
        const cleanedBlob = await this.encodeWav(outputBuffer);

        return {
            cleanedBlob,
            metadata: {
                originalDuration,
                processedDuration: outputBuffer.duration,
                noiseLevel,
                peakAmplitude,
                voiceActivityDetected,
            },
        };
    }

    /**
     * Calculate noise floor from first 0.5s of audio
     */
    private calculateNoiseFloor(samples: Float32Array): number {
        const silenceWindow = Math.min(samples.length, Math.floor(0.5 * this.config.sampleRate));
        let sum = 0;
        for (let i = 0; i < silenceWindow; i++) {
            sum += Math.abs(samples[i]);
        }
        return sum / silenceWindow;
    }

    /**
     * Apply noise gate to remove low-level noise
     */
    private applyNoiseGate(samples: Float32Array, noiseFloor: number): Float32Array {
        const threshold = Math.max(this.config.noiseGateThreshold, noiseFloor * 1.5);
        const output = new Float32Array(samples.length);

        for (let i = 0; i < samples.length; i++) {
            output[i] = Math.abs(samples[i]) > threshold ? samples[i] : 0;
        }

        return output;
    }

    /**
     * Voice Activity Detection - trim silence from start/end
     */
    private applyVAD(samples: Float32Array): { trimmedSamples: Float32Array; voiceActivityDetected: boolean } {
        const sensitivity = this.config.vadSensitivity;
        const windowSize = Math.floor(0.05 * this.config.sampleRate); // 50ms windows

        let startIndex = 0;
        let endIndex = samples.length;
        let voiceActivityDetected = false;

        // Find start of voice
        for (let i = 0; i < samples.length - windowSize; i += windowSize) {
            const windowEnergy = this.calculateWindowEnergy(samples, i, windowSize);
            if (windowEnergy > sensitivity * 0.1) {
                startIndex = Math.max(0, i - windowSize); // Include a little before
                voiceActivityDetected = true;
                break;
            }
        }

        // Find end of voice
        for (let i = samples.length - windowSize; i > startIndex; i -= windowSize) {
            const windowEnergy = this.calculateWindowEnergy(samples, i, windowSize);
            if (windowEnergy > sensitivity * 0.1) {
                endIndex = Math.min(samples.length, i + windowSize * 2); // Include a little after
                break;
            }
        }

        return {
            trimmedSamples: samples.slice(startIndex, endIndex),
            voiceActivityDetected,
        };
    }

    /**
     * Calculate energy of a window of samples
     */
    private calculateWindowEnergy(samples: Float32Array, start: number, length: number): number {
        let sum = 0;
        const end = Math.min(start + length, samples.length);
        for (let i = start; i < end; i++) {
            sum += samples[i] * samples[i];
        }
        return Math.sqrt(sum / length);
    }

    /**
     * Normalize audio to target level
     */
    private normalize(samples: Float32Array): Float32Array {
        const peak = this.calculatePeakAmplitude(samples);
        if (peak === 0) return samples;

        const targetLinear = Math.pow(10, this.config.normalizationTarget / 20);
        const gain = targetLinear / peak;

        const output = new Float32Array(samples.length);
        for (let i = 0; i < samples.length; i++) {
            output[i] = Math.max(-1, Math.min(1, samples[i] * gain)); // Clip to [-1, 1]
        }

        return output;
    }

    /**
     * Calculate peak amplitude
     */
    private calculatePeakAmplitude(samples: Float32Array): number {
        let peak = 0;
        for (let i = 0; i < samples.length; i++) {
            peak = Math.max(peak, Math.abs(samples[i]));
        }
        return peak;
    }

    /**
     * Encode AudioBuffer to WAV blob
     */
    private async encodeWav(audioBuffer: AudioBuffer): Promise<Blob> {
        const numChannels = 1;
        const sampleRate = audioBuffer.sampleRate;
        const samples = audioBuffer.getChannelData(0);
        const bitsPerSample = 16;

        const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
        const blockAlign = numChannels * (bitsPerSample / 8);
        const dataSize = samples.length * numChannels * (bitsPerSample / 8);

        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        // WAV header
        const writeString = (offset: number, str: string) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);

        // Write samples
        let offset = 44;
        for (let i = 0; i < samples.length; i++) {
            const sample = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    }

    /**
     * Dispose of resources
     */
    dispose(): void {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

// Singleton instance
let preprocessorInstance: AudioPreprocessor | null = null;

export const audioPreprocessor = {
    /**
     * Get or create preprocessor instance
     */
    getInstance(config?: Partial<AudioProcessorConfig>): AudioPreprocessor {
        if (!preprocessorInstance) {
            preprocessorInstance = new AudioPreprocessor(config);
        }
        return preprocessorInstance;
    },

    /**
     * Process audio with default settings
     */
    async process(audioBlob: Blob, config?: Partial<AudioProcessorConfig>): Promise<AudioProcessingResult> {
        const processor = this.getInstance(config);
        return processor.process(audioBlob);
    },
};

export default audioPreprocessor;
