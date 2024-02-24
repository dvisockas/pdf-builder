$(document).ready(() => {
  const compressionLevels = [
    'NONE',
    'FAST',
    'MEDIUM',
    'SLOW',
  ]

  $('#compression').on('change', (e) => {
    let compression = $(e.target).val()
    const compressionPercentage = parseInt(compression) * 25

    localStorage.setItem('compression', compression)
    $('label[for="compression"]').text('Compression (' + compressionPercentage + '%)')
  })

  $('#compression').val(~~localStorage.getItem('compression')).trigger('change')

  const buildPDF = (event) => {
    const buildButton = event.target
    let doc = new jsPDF()

    const FONT = doc.getFontList()[0]
    const HEADER_IMAGE = getDataUrl(document.querySelector('#helperImages > img.header'))
    const FOOTER_IMAGE = getDataUrl(document.querySelector('#helperImages > img.footer'))

    const compressionValue = parseInt($('#compression').val())
    const compression = compressionLevels[compressionValue]

    const images = $('.listItem > img')

    buildButton.innerText = 'Building...'

    images.each((i, e) => {
      console.log('adding image')
      buildButton.innerText = `Building... (${i + 1}/${window.immutableFileCount})`
      let lastImage = i % 2

      if (!lastImage) {
        doc.addImage(HEADER_IMAGE, 'JPEG', 0, 0, 42, 20, 'HEADER', compression)
      }

      const width = $(e).width()
      const height = $(e).height()
      const ratio = height / width
      const imageSrc = $(e).attr('src')

      const resizedSrc = resize(e, e.naturalHeight, e.naturalWidth)
      y = lastImage ? 147 : 22
      const presentmentWidth = 178

      let imageType = imageSrc.match(/png;base64/) ? 'PNG' : 'JPG'
      doc.addImage(resizedSrc, imageType, 15, y, presentmentWidth, presentmentWidth * ratio, null, compression)

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

  const submitButton = document.getElementById('build')
  submitButton.addEventListener('click', buildPDF)

  const onUpload = (event) => {
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
    window.immutableFileCount = files.length

    for (let i = 0; i < files.length; i++) {
      let fileReader = new FileReader()
      fileReader.onloadend = ((file) => {
        return (reader) => {
          addFile(reader.currentTarget.result, file)
        }
      })(files[i]);
      fileReader.readAsDataURL(files[i])
    }
  }

  const fileUplaod = $('#fileUpload')
  fileUplaod.on('change', onUpload)

  const addFile = (uri, file) => {
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
      fileList.find('.listItem').sort((a, b) => {
        return parseInt(a.dataset.fileName) - parseInt(b.dataset.fileName)
      }).appendTo(fileList)

      fileList.sortable({
        placeholder: "sortablePlaceholder"
      })
    }
  }

  const getDataUrl = (img) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    return canvas.toDataURL()
  }

  const resize = (src, height, width) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const maxWidth = 1600
    const targetWidth = width > maxWidth ? maxWidth : width
    const targetHeight = height * (targetWidth / width)


    canvas.width = targetWidth
    canvas.height = targetHeight

    ctx.drawImage(src, 0, 0, width, height, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL();
  }
})
