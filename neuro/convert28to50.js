const fs = require("fs");
const sharp = require("sharp");

const pathTo28 = "./neuro/images/28";
const pathTo50 = "./neuro/images/50";

const convertFileTo50 = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            await sharp(pathTo28 + "/" + file)
                .resize({ width: 50, height: 50 })
                .toFile(pathTo50 + "/" + file);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

const convertFilesTo50 = async () => {
    const files = fs.readdirSync(pathTo28);

    await Promise.all(files.map(convertFileTo50));
};

convertFilesTo50();
