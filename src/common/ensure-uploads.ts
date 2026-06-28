import fs from 'fs';
import path from 'path';

if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
  fs.mkdirSync(path.join(process.cwd(), 'uploads'), { recursive: true });
}
