// Elements
const fileInput = document.getElementById("img-input");
const canvas = document.getElementById("canvas");
const downloadButton = document.getElementById("download-button");
const root = document.getRootNode();

// Get canvas ready
const ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Images
let selectedFile = null;
const circle = new Image(3000, 3000);
circle.crossOrigin = "anonymous";
circle.src = "https://i.ibb.co/jbZLzrn/888-Inner-Circle-Maalavidaa.png";

const handleNewFile = (file) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onloadend = (event) => {
    const image = new Image();
    image.src = event.target.result;
    image.onload = function () {
      console.log("Building canvas...");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = (canvas.width = image.width);
      const height = (canvas.height = image.height);
      ctx.drawImage(image, 0, 0, width, height);
      ctx.drawImage(circle, 0, 0, width, height);
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, height / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      console.log("Finished building canvas");
      selectedFile = file;
    };
  };
};

// Handle new image selection
fileInput.onchange = function (e) {
  console.log("Received", e.target.files[0], "from file input");
  handleNewFile(e.target.files[0]);
};

// Handle drag-and-drop
const preventDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

root.addEventListener("dragenter", preventDefault, false);
root.addEventListener("dragleave", preventDefault, false);
root.addEventListener("dragover", preventDefault, false);
root.addEventListener("drop", preventDefault, false);

root.addEventListener(
  "drop",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    const file = e.dataTransfer?.files[0];

    if (file) {
      handleNewFile(file);
    }
  },
  false
);

// Handle download
downloadButton.onclick = function () {
  console.log("Attemping to download canvas");
  if (!selectedFile) return console.log("No selected image!");

  const linkElement = document.createElement("a");

  const fileName =
    selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) + ".png";

  console.log("Preparing", fileName, "for download");
  linkElement.download = fileName;
  linkElement.href = canvas.toDataURL("image/png");

  linkElement.click();
};
