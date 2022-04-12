class FilesService {
    
     buffer64 = (e) => {
        const base64ToText = Buffer.from(e, 'base64').toString('ascii')
        return base64ToText;
    }

    buffer64UTF8 = (e) => {
        const base64ToText = Buffer.from(e, 'base64').toString('utf8')
        return base64ToText;
    }


    convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    changeImageType = (type) => {
        const ImgType = ["7z.png", "avi.png", "doc.png", "gif.png","jpg.png","m3u.png","mkv.png","mp3.png","mp4.png","mpeg.png","pdf.png","png.png","ppt.png","rar.png","txt.png","wav.png","wmv.png","xls.png","zip.png"];
        if(type.includes("spreadsheetml"))
            return "xls.png"
        else if (type.includes("wordprocessingml"))
            return "doc.png"
        else if (type.includes("zip"))
            return "zip.png"
        else if (type.includes("presentationml"))
            return "ppt.png"
        else if (type.includes("jpeg"))
            return "jpg.png"
        else if (type.includes("png"))
            return "png.png"
        else if (type.includes("mp4"))
            return "mp4.png"
        else if (type.includes("mp3"))
            return "mp3.png"
        else
            return "pdf.png"
    };

    changeImage = () => {
        return 'pdf.png';
    };
}

export default new FilesService();