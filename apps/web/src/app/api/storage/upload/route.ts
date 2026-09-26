import { NextResponse } from 'next/server';
import { storageService } from '@p2d/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileType, fileData, entityId, name, mimeType } = body;

    let result;
    if (fileType === 'recording') {
      const buffer = Buffer.from(fileData || 'SAMPLE_AUDIO_BUFFER', 'base64');
      result = await storageService.storeCallRecording(entityId || `call_${Date.now()}`, buffer, mimeType || 'audio/mp3');
    } else if (fileType === 'transcript') {
      result = await storageService.storeTranscript(entityId || `conv_${Date.now()}`, fileData || {});
    } else if (fileType === 'summary') {
      result = await storageService.storeIntelligenceSummary(entityId || `conv_${Date.now()}`, fileData || {});
    } else {
      result = await storageService.storeFigureFile(name || 'diagram.png', fileData || 'IMAGE_DATA', mimeType || 'image/png');
    }

    return NextResponse.json({ success: true, file: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
