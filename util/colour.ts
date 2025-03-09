import getPixels from 'get-pixels';
import { extractColors } from 'extract-colors';

const getColour = async (url: string) => {
  try {
    const pixels: any = await new Promise((resolve, reject) => {
      getPixels(url, (err, pixels) => {
        if (err) reject(err);
        resolve(pixels);
      });
    });
  
    console.log(pixels);
  
    const data = [...pixels.data];
    const [width, height] = pixels.shape;
  
    const colors = await extractColors({ data, width, height });
  
    return colors;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default getColour;
