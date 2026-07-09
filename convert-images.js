const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, 'client', 'public');
const clientDir = path.join(__dirname, 'client');

console.log('Step 1: Installing sharp image library...');
try {
  execSync('npm install sharp --no-save', { stdio: 'inherit', cwd: __dirname });
} catch (err) {
  console.error('Failed to install sharp. Make sure you have Node.js installed.');
  process.exit(1);
}

const sharp = require('sharp');

// Find all images in public folder
const files = fs.readdirSync(publicDir);
const imageFiles = files.filter(f => {
  const ext = path.extname(f).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext) && !f.endsWith('.webp');
});

console.log(`Step 2: Converting ${imageFiles.length} images to WebP...`);

const mapping = {};

async function convert() {
  for (const file of imageFiles) {
    const filePath = path.join(publicDir, file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    
    const newName = `${baseName}.webp`;
    const destPath = path.join(publicDir, newName);

    console.log(`Converting ${file} -> ${newName}...`);
    try {
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(destPath);
      
      const oldSize = fs.statSync(filePath).size;
      const newSize = fs.statSync(destPath).size;
      console.log(`  Size reduced from ${(oldSize/1024/1024).toFixed(2)}MB to ${(newSize/1024/1024).toFixed(2)}MB!`);
      
      mapping[file] = newName;
      
      // Delete old heavy file to clean up space
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`  Error converting ${file}:`, err.message);
    }
  }

  console.log('Step 3: Replacing image references in source code...');
  replaceReferences(clientDir);
  console.log('\nAll conversions and code reference replacements completed successfully!');
  console.log('Please verify the website and commit the changes.');
}

function replaceReferences(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Skip node_modules
      if (item === 'node_modules') continue;
      replaceReferences(fullPath);
    } else if (stat.isFile() && ['.js', '.jsx', '.html', '.css'].includes(path.extname(item))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const [oldName, newName] of Object.entries(mapping)) {
        // Handle normal filename reference
        if (content.includes(oldName)) {
          content = content.split(oldName).join(newName);
          modified = true;
          console.log(`  Updated reference in ${path.relative(__dirname, fullPath)}: ${oldName} -> ${newName}`);
        }
        // Handle URL encoded filename reference (e.g. spaces replaced by %20)
        const encodedOldName = encodeURIComponent(oldName);
        const encodedNewName = encodeURIComponent(newName);
        if (content.includes(encodedOldName)) {
          content = content.split(encodedOldName).join(encodedNewName);
          modified = true;
          console.log(`  Updated encoded reference in ${path.relative(__dirname, fullPath)}: ${encodedOldName} -> ${encodedNewName}`);
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

convert();
