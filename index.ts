import path from "path";
import fs from "fs/promises";
import console from "console";
interface FolderForFiles {
  images: string[];
  videos: string[];
  files: string[];
  document: string[];
}
let mainDir = process.cwd();
let directory = process.argv[2];
let dryRun = process.argv[3];
console.log(process.argv);
const obj: FolderForFiles = {
  images: [".png", ".jpg"],
  videos: [".mp3", ".mp4"],
  files: [".js", ".tsx", ".jsx"], // i have to remove .ts check line 27
  document: [".ts", ".md", ".txt"],
};
//
async function ManagerFolder(directory: string | undefined) {
  try {
    if (!directory) {
      console.log("Provide the directory");
      process.exit();
    }
    if(typeof(dryRun) !== undefined && dryRun !== '--dry-Run'){
        console.log('last argument should be  --dry-Run and not', dryRun)
        process.argv.pop()
        console.log(process.argv)
        process.exit()
    }
    let fullPAth = path.join(mainDir, directory);
    // check whether the dirctory exit
    //
    let stat = await fs.stat(fullPAth);

    if (!stat.isDirectory()) {
      console.log(
        "This is not a directory or it does not exit pls use the -m so we can make a dir",
      )
      process.exit();
    }
    // step 1 get the workdirectory
    // step 2  list the file in the dirctory
    const files = await fs.readdir(fullPAth, { withFileTypes: true });
    // step 3 loop through
    for (const file of files) {

          //if is folder
      if (file.isDirectory()) {
        // since the source file is now a folder this is why am getting path/index.ts can not be found cause this code needs to be a file to run the code
        console.log(file.name, "this is a folder");
      }
      // if file
      else if (file.isFile() && typeof(dryRun) === undefined) {
        // j/j/j.ts
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
      else if (file.isFile() && typeof(dryRun) !== undefined) {
        // j/j/j.ts
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
    
      console.log('dryRun detected')
       console.log('in this directory:', folderPath )
       console.log(sourceFiles, 'will change path to', destinationPath)
              }
            }
          }
    }
    catch(error){
    console.log(error)
    }
      }
  } 
  }
  catch (error: any) {
    if (error.code == "ENOENT") {
      console.log("file or folder not found");
    } else {
      console.log(error);
    }
  }
}

ManagerFolder(directory);
