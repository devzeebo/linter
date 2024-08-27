import fs from 'fs/promises';
import path from 'path';

interface WalkOptions {
  dir: string; // root path to recursively search
  filter: RegExp[]; // end of filename filters (e.g. [/.\.ts$/, /\.js$/])
  excludes: RegExp[]; // parts of paths to ignore (e.g. /node_modules/, /bin/)
}

async function* walk(options: WalkOptions): AsyncIterable<string> {
  const { dir, filter, excludes } = options;

  // Read the contents of the root directory
  const dirents = await fs.readdir(dir);

  for (const dirEnt of dirents) {
    const fullPath = path.join(dir, dirEnt);

    // Skip directories in the excludes array
    if (excludes.some((regex) => regex.test(fullPath))) {
      // console.log(`excluding ${fullPath}`);
      continue;
    }

    // If this is a directory, recurse into it
    const stat = await fs.lstat(fullPath);
    if (stat.isDirectory()) {
      yield* walk({ dir: fullPath, filter, excludes });
      continue;
    }

    // Check if the file matches any of the filters
    const matchedFilter = filter.some(filterRegex => filterRegex.test(dirEnt));

    if (matchedFilter && !excludes.some((regex) => regex.test(fullPath))) {
      yield fullPath;
    }
    else {
      // console.log(`excluding ${fullPath}`);
    }
  }
}
export default walk;