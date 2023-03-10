const path = require('path');
const fs = require('fs');
const { BadRequestError, InternalError, ErrorHandler } = require('./ErrorHandler');
const { SuccessResponse, BadRequestResponse, InternalErrorResponse } = require('./ApiResponse');

module.exports = async function upload(req,res, directory) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return new BadRequestResponse('NoFilesWereUploaded').send(res)
    }
    const file_directory = '../../public/files/' + directory
    const tempPath = req.files[directory];
    const filePath = path.join(__dirname, file_directory);

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    let rand = Math.random().toString(36).substring(7);
    const file_name = rand + '_' + tempPath.name
    const targetPath = path.join(filePath, file_name);
    tempPath.mv(targetPath, function (err) {
        if (err)
            ErrorHandler.handle(err, res)
    });
    return file_name
}