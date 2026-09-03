import { execSync } from 'child_process';

try {
  const output = execSync('netstat -ano | findstr :3005', { encoding: 'utf8' });
  const lines = output.trim().split('\n');
  const pids = new Set();
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 5) {
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') pids.add(pid);
    }
  }

  for (const pid of pids) {
    try {
      console.log(`Killing PID ${pid} on port 3005...`);
      execSync(`taskkill /F /PID ${pid}`);
    } catch (e) {
      console.log(`Could not kill PID ${pid}: ${e.message}`);
    }
  }
  console.log('✓ Port 3005 successfully cleared!');
} catch (e) {
  console.log('Port 3005 is already free.');
}
