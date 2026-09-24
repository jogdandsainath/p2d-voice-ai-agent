import { describe, it, expect } from 'vitest';
import { VoiceFactory, ElevenLabsVoiceAdapter, MockVoiceAdapter } from '../packages/voice/src/index.js';

describe('Voice Provider Abstraction & Adapters', () => {
  it('should instantiate appropriate voice provider via factory', () => {
    const elevenlabs = VoiceFactory.getProvider('elevenlabs');
    expect(elevenlabs.providerName).toBe('elevenlabs');

    const mock = VoiceFactory.getProvider('mock');
    expect(mock.providerName).toBe('mock');
  });

  it('ElevenLabs adapter should return catalog of high-fidelity voices', async () => {
    const elevenlabs = new ElevenLabsVoiceAdapter();
    const voices = await elevenlabs.getVoices();

    expect(voices.length).toBeGreaterThan(0);
    const rachel = voices.find(v => v.id === '21m00Tcm4TlvDq8ikWAM');
    expect(rachel).toBeDefined();
    expect(rachel?.provider).toBe('elevenlabs');
  });

  it('should synthesize audio buffer', async () => {
    const mockVoice = new MockVoiceAdapter();
    const buffer = await mockVoice.synthesize('Hello from P2D', 'mock_rachel');

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
