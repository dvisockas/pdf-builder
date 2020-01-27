(function () {
  const submitButton = document.getElementById('submit')

  submitButton.addEventListener('click', build)

  function build(event) {
    if (typeof window.FileReader !== 'function')
    throw ("The file API isn't supported on this browser.");
    const fileInput = document.getElementById('fileUpload')
    let input = event.target;
    if (!fileInput)
      throw ("The browser does not properly implement the event object");
    if (!fileInput.files)
      throw ("This browser does not support the `files` property of the file input.");
    if (!fileInput.files[0])
      return undefined;
    let file = fileInput.files[0];
    let fileReader = new FileReader();
    fileReader.onload = function(reader) {
      var doc = new jsPDF()

      doc.setFontSize(40)
      doc.text(35, 25, 'Here you gooo!')
      doc.addImage(reader.currentTarget.result, 'JPEG', 15, 40, 180, 160)
      doc.addPage()
      doc.addImage(reader.currentTarget.result, 'JPEG', 15, 40, 180, 160)
      doc.save('manel.pdf')
    }

    fileReader.readAsDataURL(file)
  }

  function resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(async function (resolve, reject) {

      // We create an image to receive the Data URI
      var img = document.createElement('img');

      // When the event "onload" is triggered we can resize the image.
      img.onload = function () {
        // We create a canvas and get its context.
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // We set the dimensions at the wanted size.
        canvas.width = wantedWidth;
        canvas.height = wantedHeight;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

        var dataURI = canvas.toDataURL();

        // This is the return of the Promise
        resolve(dataURI);
      };

      // We put the Data URI in the image's src attribute
      img.src = datas;

    })
  }

  function getImageDimensions(file) {
    return new Promise(function (resolved, rejected) {
      var i = new Image()
      i.onload = function () {
        resolved({ w: i.width, h: i.height })
      };
      i.src = file
    })
  }
})()