$(document).ready(function() {
  const submitButton = document.getElementById('build')
  submitButton.addEventListener('click', buildPDF)

  const fileUplaod = $('#fileUpload')
  fileUplaod.on('change', onUpload)
  // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
  // Compression values: 'NONE', 'FAST', 'MEDIUM' and 'SLOW'

  function buildPDF(event) {
    let doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(35, 25, 'Hello, Manel :)')
    let firstImage = true

    $('.listItem > img').each(function(i, e) {
      if (i % 2 == 1) {
        firstImage = false 
        if (i > 1) {
          doc.addPage()
        }
      } else {
        firstImage = true
      } 
      
      const imageSrc = $(e).attr('src')
      y = firstImage ? 30 : 150
      doc.addImage(imageSrc, 'JPEG', 0, y, 180, 100, null, 'SLOW')
    })

    // doc.addImage(reader.currentTarget.result, 'JPEG', 15, 40, 180, 160)
    // doc.addImage(reader.currentTarget.result, 'JPEG', 15, 40, 180, 160)
    doc.save('manel.pdf')
  }

  function onUpload(event) {
    if (typeof window.FileReader !== 'function')
    throw ("The file API isn't supported on this browser.")
    const fileInput = document.getElementById('fileUpload')
    let input = event.target
    if (!fileInput)
      throw ("The browser does not properly implement the event object")
    if (!fileInput.files)
      throw ("This browser does not support the `files` property of the file input.")
    if (!fileInput.files[0])
      return undefined

    let files = Array.from(fileInput.files)
    window.fileCount = files.length

    for (let i = 0; i < files.length; i++) {
      let fileReader = new FileReader()
      fileReader.onload = function(reader) {
        addFile(reader.currentTarget.result)
      }
      fileReader.readAsDataURL(files[i])
    }
  }

  function addFile(uri) {
    const fileList = $('#fileList')
    let wrapper = $(document.createElement('div'))
    wrapper.addClass('listItem')
    let img = $(document.createElement('img'))
    img.attr('src', uri)
    wrapper.append(img)
    fileList.append(wrapper)
    window.fileCount -= 1
    if (window.fileCount == 0) {
      fileList.sortable({
        placeholder: "sortablePlaceholder"
      })
    }
  }

  // function resizedataURL(datas, wantedWidth, wantedHeight) {
  //   return new Promise(async function (resolve, reject) {

  //     // We create an image to receive the Data URI
  //     let img = document.createElement('img')

  //     // When the event "onload" is triggered we can resize the image.
  //     img.onload = function () {
  //       // We create a canvas and get its context.
  //       let canvas = document.createElement('canvas')
  //       let ctx = canvas.getContext('2d')

  //       // We set the dimensions at the wanted size.
  //       canvas.width = wantedWidth
  //       canvas.height = wantedHeight

  //       // We resize the image with the canvas method drawImage()
  //       ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight)

  //       let dataURI = canvas.toDataURL()

  //       // This is the return of the Promise
  //       resolve(dataURI)
  //     }

  //     // We put the Data URI in the image's src attribute
  //     img.src = datas

  //   })
  // }

  function getImageDimensions(file) {
    return new Promise(function (resolved, rejected) {
      let image = new Image()
      image.onload = function () {
        resolved({ w: i.width, h: i.height })
      }
      i.src = file
    })
  }
})