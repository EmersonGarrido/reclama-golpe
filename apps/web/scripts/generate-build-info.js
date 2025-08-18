#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get package.json version
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../..', 'package.json'), 'utf8')
);

// Get git information
let gitHash = 'unknown';
let gitBranch = 'unknown';

try {
  gitHash = execSync('git rev-parse HEAD').toString().trim();
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
} catch (error) {
  console.log('Git information not available');
}

// Generate build information with São Paulo timezone
const now = new Date();
const buildInfo = {
  version: packageJson.version || '1.0.0',
  buildNumber: `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`,
  buildDate: now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  buildTime: now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  timestamp: now.toISOString(),
  environment: process.env.NODE_ENV || 'development',
  gitHash,
  gitBranch: gitBranch === 'HEAD' ? 'main' : gitBranch, // Fix for detached HEAD state
};

// Create build-info.json
const buildInfoPath = path.join(__dirname, '../public/build-info.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

// Create .env.build with build information
const envContent = `# Build Information - Generated automatically
NEXT_PUBLIC_VERSION=${buildInfo.version}
NEXT_PUBLIC_BUILD_NUMBER=${buildInfo.buildNumber}
NEXT_PUBLIC_BUILD_DATE=${buildInfo.buildDate}
NEXT_PUBLIC_BUILD_TIME=${buildInfo.buildTime}
NEXT_PUBLIC_BUILD_TIMESTAMP=${buildInfo.timestamp}
NEXT_PUBLIC_COMMIT_HASH=${buildInfo.gitHash}
NEXT_PUBLIC_BRANCH=${buildInfo.gitBranch}
`;

const envPath = path.join(__dirname, '../.env.build');
fs.writeFileSync(envPath, envContent);

console.log('✅ Build information generated:');
console.log(`   Version: ${buildInfo.version}`);
console.log(`   Build: ${buildInfo.buildNumber}`);
console.log(`   Date: ${buildInfo.buildDate} ${buildInfo.buildTime}`);
console.log(`   Branch: ${buildInfo.gitBranch}`);
console.log(`   Commit: ${buildInfo.gitHash.substring(0, 7)}`);
console.log('');
console.log('📁 Files created:');
console.log('   - public/build-info.json');
console.log('   - .env.build');