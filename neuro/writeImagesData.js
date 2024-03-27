const fs = require("fs");
const sharp = require("sharp");

// Получить массив чёрно-белых пикселей
const getImageData = async (path, size, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await sharp(path + "/" + file)
                .raw()
                .toBuffer({ resolveWithObject: true });

            const pixels = [];

            for (let i = 0; i < size * size; i += 3) {
                let value = 0;
                for (let j = 0; j < 3; j++) {
                    value += data[i + j];
                }
                value /= 3;
    
                // True - белый, False - чёрный
                pixels.push(Number(value > 0));
            }

            resolve({
                digit: Number(file[10]),
                pixels
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Получить матрицу картинок с пикселями
const getImagesData = async (size) => {
    const path = "./neuro/images/" + size;

    const files = fs.readdirSync(path);

    const imagesData = await Promise.all(
        files.map((file) => getImageData(path, size, file))
    );

    return imagesData;
};

// Записать матрицу картинок в JSON
const writeImagesData = async (size) => {
    const imagesData = await getImagesData(size);

    if (!fs.existsSync("./neuro/data")) {
        fs.mkdirSync("./neuro/data");
    }

    fs.writeFileSync(`./neuro/data/${size}.json`, JSON.stringify(imagesData));
};

writeImagesData(28);
writeImagesData(50);
