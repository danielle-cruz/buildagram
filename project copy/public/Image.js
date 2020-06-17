import apiRequest from "./api.js";
/* Features to add:
 * Titles, captions, onDelete,
 */


/* A DOM component that displays an image in the gallery. */
export default class Image {

  static async getImages() {
    let [status, data] = await apiRequest("GET", "/images");
    if (status !== 200) throw new Error("Couldn't get images");
    let imageArray = data.images.map(elem => new Image({"file": elem}));
    return imageArray;
  }

  static async createImage(file) {
    let body = {file: file};
    let [status, data] = await apiRequest("POST", "/images", body);
    if (status === 400) throw new Error("Unexpected body parameter token");
    return new Image(data);
  }

  constructor(data) {
    this.file = data.file;

  }

  addToDOM(parent) {
    let image = document.createElement("img");
    image.src = this.file;
    parent.appendChild(image);
  }

  async load() {
    let [status, data] = await apiRequest("GET", "/");
    console.log(data)
    return data;
  }


}
