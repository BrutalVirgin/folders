import fs from "fs";
import path from "path";

function countfolders(path: string): fs.Dirent[] {
  const folders = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  return folders;
}

function countfiles(path: string): fs.Dirent[] {
  const files = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((d) => !d.isDirectory());

  return files;
}

function createFile(pat: string, folders: number, filesInFolder: number) {
  let newPath = path.resolve(pat, "info.json");
  const object = { absolutePath: newPath, folders, filesInFolder };

  fs.writeFile(
    path.resolve(pat, "info.json"),
    JSON.stringify(object),
    function (err) {
      if (err) throw err;
    }
  );
}

function test(pat: string) {
  const folders = countfolders(pat).length;
  const filesInFolder = countfiles(pat).length;

  const start = fs.readdirSync(pat, { withFileTypes: true });

  if (start.length === 0) {
    createFile(pat, folders, filesInFolder);
  }

  for (let i = 0; i < start.length; i++) {
    createFile(pat, folders, filesInFolder);
    if (start[i].isDirectory()) {
      const newPath = path.resolve(pat, start[i].name);
      console.log(newPath);

      test(newPath);
    }
  }
}

test(__dirname);
