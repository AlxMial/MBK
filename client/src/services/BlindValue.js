class BlindValue {
    blindValue = (e) => {
        e = "xxxxxx" + e.substring(e.length - 4, e.length);
    }
}

export default new BlindValue();
