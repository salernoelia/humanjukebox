import fs from "fs";
import path from "path";

export default defineEventHandler((event) => {
  const downloadsFolderPath = "/Users/eliasalerno/Downloads/";

  try {
    // Read the contents of the Downloads folder
    let files = fs.readdirSync(downloadsFolderPath);

    // Filter out files with a "." in the beginning
    files = files.filter((file) => !file.startsWith("."));

    // Sort files by their last modification time in ascending order
    const sortedFiles = files
      .map((file) => {
        const filePath = path.join(downloadsFolderPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          modifiedTime: stats.mtime.getTime(),
        };
      })
      .sort((b, a) => a.modifiedTime - b.modifiedTime);

    // Extract just the names of the sorted files
    const sortedFileNames = sortedFiles.map((file) => file.name);
    const fullFilePath = downloadsFolderPath + sortedFileNames[0];
    const readFile = fs.readFileSync(fullFilePath);
    const base64 = readFile.toString("base64");
    // Return the sorted list of files
    return {
      files: sortedFileNames,
      readFile: readFile,
      fullFilePath,
      base64,
    };
  } catch (error) {
    // If there's an error reading the folder, return the error message
    return {
      error: error.message,
    };
  }
});
