const fs = require('fs');
const path = require('path');

// Retrieve the command-line arguments
const operation = process.argv[2];
const file = process.argv[3];
const content = process.argv[4];

switch (operation) {
  case 'read':
    // Reading the contents of the file
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file '${file}': ${err.message}`);
        return;
      }
      console.log(`Contents of '${file}':\n${data}`);
    });
    break;

  case 'create':
    // Creating a new file
    fs.writeFile(file, '', (err) => {
      if (err) {
        console.error(`Error creating file '${file}': ${err.message}`);
        return;
      }
      console.log(`File '${file}' created`);
    });
    break;

  case 'append':
    // Appending content to the file
    fs.appendFile(file, content + '\n', (err) => {
      if (err) {
        console.error(`Error appending to file '${file}': ${err.message}`);
        return;
      }
      console.log(`Content appended to the file '${file}'`);
    });
    break;

  case 'delete':
    // Deleting the file
    fs.unlink(file, (err) => {
      if (err) {
        console.error(`Error deleting file '${file}': ${err.message}`);
        return;
      }
      console.log(`File '${file}' deleted`);
    });
    break;

  case 'rename':
    // Renaming the file
    const newFileName = content; // the new file name is the content argument
    fs.rename(file, newFileName, (err) => {
      if (err) {
        console.error(`Error renaming file '${file}' to '${newFileName}': ${err.message}`);
        return;
      }
      console.log(`File '${file}' renamed to '${newFileName}'`);
    });
    break;

  case 'list':
    // Listing all files and directories in the specified directory
    fs.readdir(file, (err, files) => {
      if (err) {
        console.error(`Error listing contents of directory '${file}': ${err.message}`);
        return;
      }
      console.log(`Contents of directory '${file}':`);
      files.forEach(f => console.log(f));
    });
    break;

  default:
    console.log(`Invalid operation '${operation}'`);
    break;
}
