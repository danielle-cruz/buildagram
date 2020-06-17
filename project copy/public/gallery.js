import Image from "./Image.js";

class Gallery {
  constructor() {
    this._uploadInput = null;
    this._onUploadImage = this._onUploadImage.bind(this);

    this._image = null;
    this._gallery = null;
  }

  setup() {
    this._uploadInput = document.querySelector("#upload");
    this._uploadInput.addEventListener("change", this._onUploadImage);
    this._gallery = document.querySelector("#gallery");
    this._loadGallery();

  }

  async _loadGallery() {
    this._gallery.textContent = "";
    let images = await Image.getImages();
    for (let image of images) {
      image.addToDOM(this._gallery);
    }
  }

  async _onUploadImage (event) {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    // add to gallery
    reader.addEventListener("load", async () => {
      this._image = await Image.createImage(reader.result);
      this._image.addToDOM(this._gallery);
    });

    if (file) {
      reader.readAsDataURL(file);
    }
  }

}

let gallery = new Gallery();
gallery.setup();
