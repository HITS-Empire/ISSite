const fs = require("fs");
const sharp = require("sharp");

const path = "./neuro/images/50";
const size = 50 * 50;

// Получить массив чёрно-белых пикселей
const getImageData = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await sharp(path + "/" + file)
                .raw()
                .toBuffer({ resolveWithObject: true });

            const imageData = [];

            for (let i = 0; i < size; i += 3) {
                let value = 0;
                for (let j = 0; j < 3; j++) {
                    value += data[i + j];
                }
                value /= 3;
    
                // True - белый, False - чёрный
                imageData.push(value > 128);
            }

            resolve(imageData);
        } catch (error) {
            reject(error);
        }
    });
};

// Получить матрицу картинок с пикселями
const getImagesData = async () => {
    const files = fs.readdirSync(path);

    const imagesData = await Promise.all(
        files.map(getImageData)
    );

    return imagesData;
};

const start = async () => {
    const imagesData = await getImagesData();

    console.log(imagesData);
};

start();
