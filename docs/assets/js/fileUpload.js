$(document).ready(function() {
  const submitButton = document.getElementById('build')
  submitButton.addEventListener('click', buildPDF)

  const fileUplaod = $('#fileUpload')
  fileUplaod.on('change', onUpload)

  const compressionLevels = [
    'NONE',
    'FAST',
    'MEDIUM',
    'SLOW',
  ]

  $('#compression').on('change', function(e) {
    let compression = $(e.target).val()
    const compressionPercentage = parseInt(compression) * 25

    localStorage.setItem('compression', compression)
    $('label[for="compression"]').text('Compression (' + compressionPercentage + '%)')
  })

  $('#compression').val(~~localStorage.getItem('compression')).trigger('change')

  function buildPDF(event) {
    const compressionValue = parseInt($('#compression').val())
    const compression = compressionLevels[compressionValue]
    const CARDIO_CARE_URL = '/assets/img/cardiocare.png'
    const CARIMBO_URL = '/assets/img/carimbo.jpg'

    let doc = new jsPDF()
    // doc.setFontSize(15)
    // doc.text(35, 25, 'Hello, Manel :)')
    const images = $('.listItem > img')
    images.each(function(i, e) {
      console.log(i)
      let lastImage = i % 2

      if (!lastImage) {
        doc.addImage(CARDIO_CARE_URL, 'PNG', 0, 0, 205, 98, null, compression)
      }

      const ratio = $(e).height() / $(e).width()
      const imageSrc = $(e).attr('src')

      y = lastImage ? 150 : 0
      const width = 200
      // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
      doc.addImage(imageSrc, 'JPEG', 0, y, width, width * ratio, null, compression)

      if (lastImage && (i != (images.length - 1))) {
        doc.addPage()
      }
    })

    doc.save('composed.pdf')
  }

  function toInt32(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]
  }

  function getDimensions(data) {
    return {
      width: toInt32(data.slice(16, 20)),
      height: toInt32(data.slice(20, 24))
    }
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