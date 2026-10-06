import path from "path";
import fs from "fs/promises";
interface FolderForFiles {
  images: string[];
  videos: string[];
  files: string[];
  document: string[];
}
process.argv.splice(0, 2);
let mainDir = process.cwd();
let directory = process.argv[0];
let dryRun = process.argv[1];
const obj: FolderForFiles = {
  images: [".png", ".jpg"],
  videos: [".mp3", ".mp4"],
  files: [".js", ".tsx", ".jsx, .ts"],
  document: [".ts", ".md", ".txt"],
};
//
async function ManagerFolder(directory: string | undefined) {
  try {
    if (!directory) {
      console.log("Provide the directory");
      process.exit();
    } else if (dryRun && dryRun !== "--dry-Run") {
      console.log(process.argv);
      console.log("last argument should be  --dry-Run and not", dryRun);
      process.argv.pop();
      process.exit();
    }
    let fullPAth = path.join(mainDir, directory);
    // check whether the dirctory exit
    let stat = await fs.stat(fullPAth);

    // The -m a dir logic does not exxit yet
    if (!stat.isDirectory()) {
      console.log("Directory does not exit can't find", fullPAth);
      process.exit();
    }

    const files = await fs.readdir(fullPAth, { withFileTypes: true });
    // step 3 loop through
    for (const file of files) {
      //if is folder
      if (file.isDirectory()) {
        //console.log(file.name, "this is a folder");
        // the isFile already goes through subfoleder and get the file name
      }
      // if file
      else if (file.isFile() && !dryRun) {
        console.log("first");
        try {
          //console.log(file.name)
          for (const key in obj) {
            let values = obj[key];
            for (let i = 0; i < values.length; i++) {
              //  console.log(values[i], key)
              if (path.extname(file.name) === values[i]) {
                let folderPath = path.join(directory, key);
                let sourceFiles = path.join(file.parentPath, file.name);
                let destinationPath = path.join(folderPath, file.name);

                await fs.access(sourceFiles);
                try {
                  await fs.access(destinationPath);
                  console.log("destinationPath already exit");
                  return;
                } catch {
                  await fs.mkdir(folderPath, { recursive: true });
                  await fs.rename(sourceFiles, destinationPath);
                }
              }
            }
          }
        } catch (error: any) {
          if (error.code == "ENOENT") {
            console.log("source file does not exit");
          } else {
            console.log("error", error);
          }
        }
      } else if (dryRun && file.isFile()) {
        console.log("second");
        try {
          for (const key in obj) {
            let values: string[] = obj[key];
            for (let i = 0; i < values.length; i++) {
              if (path.extname(file.name) === values[i]) {
                let folderPath = path.join(directory, key);
                let sourceFiles = path.join(file.parentPath, file.name);
                let destinationPath = path.join(folderPath, file.name);

                console.log("dryRun detected");
                console.log("in this directory:", folderPath);
                console.log(
                  sourceFiles,
                  "will change path to",
                  destinationPath,
                );
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error: any) {
    if (error.code == "ENOENT") {
      console.log("file or folder not found");
    } else {
      console.log(error);
    }
  }
}

ManagerFolder(directory);
