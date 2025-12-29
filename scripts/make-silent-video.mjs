import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

const repoRoot = process.cwd();
const inputPath = path.join(repoRoot, 'public', '111.mp4');
const outputPath = path.join(repoRoot, 'public', '111-silent.mp4');

function assertBinary(bin, name) {
  if (!bin || typeof bin !== 'string') {
    throw new Error(`${name} binary path not found. Is the dependency installed?`);
  }
}

function run(bin, args, label) {
  const result = spawnSync(bin, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

try {
  assertBinary(ffmpegPath, 'ffmpeg');
  assertBinary(ffprobeStatic?.path, 'ffprobe');

  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);

  console.log('\n[1/2] Inspecting streams via ffprobe...');
  run(ffprobeStatic.path, [
    '-hide_banner',
    '-v',
    'error',
    '-show_entries',
    'stream=index,codec_type,codec_name,channels',
    '-of',
    'default=noprint_wrappers=1',
    inputPath,
  ], 'ffprobe');

  console.log('\n[2/2] Writing silent MP4 (video-only)...');
  run(ffmpegPath, [
    '-y',
    '-hide_banner',
    '-i',
    inputPath,
    '-map',
    '0:v:0',
    '-c:v',
    'copy',
    '-an',
    '-movflags',
    '+faststart',
    outputPath,
  ], 'ffmpeg');

  console.log('\nDone. Generated public/111-silent.mp4 (no audio stream).');
} catch (err) {
  console.error('\nERROR:', err?.message ?? err);
  process.exit(1);
}
