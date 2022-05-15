class BlindValue {
    blindValue = (e) => {
        e = "xxxxxx" + e.substring(e.length - 4, e.length);
        return e;
    }
}

export default new BlindValue();
