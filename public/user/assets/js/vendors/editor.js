// var quill,
//   editorElement = document.querySelector("#editor");
// editorElement &&
//   (quill = new Quill(editorElement, {
//     modules: {
//       toolbar: [
//         [{ header: [1, 2, !1] }],
//         [{ font: [] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ size: ["small", !1, "large", "huge"] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ color: [] }, { background: [] }, { align: [] }],
//         ["link", "image", "code-block", "video"],
//       ],
//     },
//     theme: "snow",
//   }));

//   const description = editor.root.innerHTML;

var quill,
    editorElement = document.querySelector("#editor");

if (editorElement) {
    quill = new Quill(editorElement, {
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                [{ font: [] }],
                ["bold", "italic", "underline", "strike"],
                [{ size: ["small", false, "large", "huge"] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ color: [] }, { background: [] }, { align: [] }],
                ["link", "image", "code-block", "video"],
            ],
        },
        theme: "snow",
    });

    // Access the content of the Quill editor
    // const description = quill.root.innerHTML;
}
