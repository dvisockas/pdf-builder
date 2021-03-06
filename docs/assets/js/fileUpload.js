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
    let doc = new jsPDF()

    const FONT = doc.getFontList()[0]
    const HEADER_IMAGE = getDataUrl(document.querySelector('#helperImages > img.header'))
    const FOOTER_IMAGE = getDataUrl(document.querySelector('#helperImages > img.footer'))

    const compressionValue = parseInt($('#compression').val())
    const compression = compressionLevels[compressionValue]

    const images = $('.listItem > img')
    images.each(function(i, e) {
      let lastImage = i % 2

      if (!lastImage) {
        doc.addImage(HEADER_IMAGE, 'JPEG', 0, 0, 42, 20, 'HEADER', compression)
      }

      const ratio = $(e).height() / $(e).width()
      const imageSrc = $(e).attr('src')

      y = lastImage ? 147 : 22
      const width = 178

      let imageType = imageSrc.match(/png;base64/) ? 'PNG' : 'JPG'
      doc.addImage(imageSrc, imageType, 15, y, width, width * ratio, null, compression)

      if (lastImage || (i == (images.length - 1))) {
        doc.fromHTML('<b><i>CARDIOcare</i></b>', 10, 275)

        doc.setFontSize(9)
        doc.setFont(FONT, 'normal')
        doc.text('Serviço ambulatório de Cardiologia Veterinária', 11, 285)

        doc.addImage(FOOTER_IMAGE, 'JPEG', 80, 275, 36.85, 17.5, 'FOOTER', compression)
      }

      if (lastImage && (i != (images.length - 1))) {
        doc.addPage()
      }
    })

    doc.save('composed.pdf')
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
      fileReader.onloadend = (function (file) {
        return function (reader) {
          addFile(reader.currentTarget.result, file)
        }
      })(files[i]);
      fileReader.readAsDataURL(files[i])
    }
  }

  function addFile(uri, file) {
    const fileList = $('#fileList')
    let div = document.createElement('div')
    div.dataset.fileName = file.name
    let wrapper = $(div)
    wrapper.addClass('listItem')
    let img = $(document.createElement('img'))
    img.attr('src', uri)
    wrapper.append(img)
    fileList.append(wrapper)
    window.fileCount -= 1
    if (window.fileCount == 0) {
      fileList.find('.listItem').sort(function (a, b) {
        return parseInt(a.dataset.fileName) - parseInt(b.dataset.fileName)
      }).appendTo(fileList)

      fileList.sortable({
        placeholder: "sortablePlaceholder"
      })
    }
  }

  function getDataUrl(img) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    return canvas.toDataURL()
  }
})