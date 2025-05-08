
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/imgs')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`)

    }
  })
  
const uploadImg = multer({ storage })

module.exports = uploadImg