import path from "path";
import fs from "fs/promises";
interface FolderForFiles {
  images: string[];
  videos: string[];
  files: string[];
  document: string[];
}

let mainDir = process.cwd();
const obj: FolderForFiles = {
  images: [".png", ".jpg"],
  videos: [".mp3", ".mp4"],
  files: [".js", ".tsx", ".jsx"], // i have to remove .ts check line 27
  document: [".ts",".md", ".txt"],
};
//
async function ManagerFolder(directory: string) {
  try {
    // step 1 get the workdirectory
    // step 2  list the file in the dirctory
    const files = await fs.readdir(directory, { withFileTypes: true });
    // step 3 loop through
    for (const file of files) {
      //if is folder
      if (file.isDirectory()) {
        // since the source file is now a folder this is why am getting path/index.ts can not be found cause this code needs to be a file to run the code
        console.log(file.name, "this is a folder");
      }
      // if file
      else if (file.isFile()) {
        // when this code runs ts is which is the source file will now be in a folder check line 27
        try {
          //console.log(file.name)
          for (const key in obj) {
            let values: string[] = obj[key];
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
      }
    }
  } catch (error) {
    console.log(error);
  }
}

ManagerFolder(mainDir);
