Dropzone.autoDiscover = false;
const myDropzone = new Dropzone("#my-dropzone", {
  url: "/admin/addNewProduct",
  maxFilesize: 5,
  acceptedFiles: "image/*",
  addRemoveLinks: true,
  autoProcessQueue: true,
  paramName: "image" ,// Specify the field name for the image
});

const files = myDropzone.file
console.log('this is my added image files',files);
// Event listeners
myDropzone.on("addedfile", function (file) {
  console.log("File added: " + file.name);
});

myDropzone.on("removedfile", function (file) {
  console.log("File removed: " + file.name);
});

myDropzone.on("success", function (file) {
  console.log("File uploaded successfully:", file);
});




// Dropzone.autoDiscover = false;

// // Initialize Dropzone
// const myDropzone = new Dropzone("#my-dropzone", {
//   url: "/admin/addNewProduct",
//   maxFilesize: 5,
//   acceptedFiles: "image/*",
//   addRemoveLinks: true,
//   autoProcessQueue: true,
//   paramName: "image", // Specify the field name for the image
// });

// // Event listeners
// myDropzone.on("addedfile", function (file) {
//   console.log("File added: " + file.name);
// });

// myDropzone.on("removedfile", function (file) {
//   console.log("File removed: " + file.name);
// });

// myDropzone.on("success", function (file) {
//   console.log("File uploaded successfully:", file);
// });

// // Access files array after Dropzone processes files
// myDropzone.on("complete", function (file) {
//   const files = myDropzone.files;
//   console.log('Added image files:', files);
// });


