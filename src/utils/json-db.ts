import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'src', 'data');

export function loadData<T>(filename: string): T {
  const filePath = join(dataDir, filename);
  
  if (!existsSync(filePath)) {
    throw new Error(`Data file not found: ${filename}`);
  }
  
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export function loadAllData<T>(directory: string): T[] {
  const dirPath = join(dataDir, directory);
  
  if (!existsSync(dirPath)) {
    return [];
  }
  
  const files = readdirSync(dirPath)
    .filter(file => file.endsWith('.json'))
    .sort();
  
  return files.map(file => {
    const content = readFileSync(join(dirPath, file), 'utf-8');
    return JSON.parse(content) as T;
  });
}

export function loadDataBySlug<T>(directory: string, slug: string): T | null {
  const filePath = join(dataDir, directory, `${slug}.json`);
  
  if (!existsSync(filePath)) {
    return null;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export function listSlugs(directory: string): string[] {
  const dirPath = join(dataDir, directory);
  
  if (!existsSync(dirPath)) {
    return [];
  }
  
  return readdirSync(dirPath)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''))
    .sort();
}