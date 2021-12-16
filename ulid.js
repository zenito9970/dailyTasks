const newUlid = (function() {
    const timestamp = new Uint8Array(6); // 48bit
    const randomness = new Uint8Array(10); // 80bit

    const offset32 = Math.pow(2, 32);
    function settime() {
        const now = Date.now();
        const lo = now % offset32;
        const hi = (now - lo) / offset32;
        timestamp[0] = (hi >>> 8) & 0xff;
        timestamp[1] = (hi >>> 0) & 0xff;
        timestamp[2] = (lo >>> 24) & 0xff;
        timestamp[3] = (lo >>> 16) & 0xff;
        timestamp[4] = (lo >>> 8) & 0xff;
        timestamp[5] = (lo >>> 0) & 0xff;
    }

    const table = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    function encode() {
        const split5bit = [
            // timestamp
            (timestamp[0] & 0xe0) >> 5,
            (timestamp[0] & 0x1f),

            (timestamp[1] & 0xf8) >> 3,
            ((timestamp[1] & 0x07) << 2) | ((timestamp[2] & 0xc0) >> 6),
            (timestamp[2] & 0x3e) >> 1,
            ((timestamp[2] & 0x01) << 4) | ((timestamp[3] & 0xf0) >> 4),
            ((timestamp[3] & 0x0e) << 1) | ((timestamp[4] & 0x80) >> 7),
            (timestamp[4] & 0x7c) >> 2,
            ((timestamp[4] & 0x03) << 3) | ((timestamp[5] & 0xe0) >> 5),
            (timestamp[5] & 0x1f),

            // randomness
            (randomness[0] & 0xf8) >> 3,
            ((randomness[0] & 0x07) << 2) | ((randomness[1] & 0xc0) >> 6),
            (randomness[1] & 0x3e) >> 1,
            ((randomness[1] & 0x01) << 4) | ((randomness[2] & 0xf0) >> 4),
            ((randomness[2] & 0x0e) << 1) | ((randomness[3] & 0x80) >> 7),
            (randomness[3] & 0x7c) >> 2,
            ((randomness[3] & 0x03) << 3) | ((randomness[4] & 0xe0) >> 5),
            (randomness[4] & 0x1f),

            (randomness[5] & 0xf8) >> 3,
            ((randomness[5] & 0x07) << 2) | ((randomness[6] & 0xc0) >> 6),
            (randomness[6] & 0x3e) >> 1,
            ((randomness[6] & 0x01) << 4) | ((randomness[7] & 0xf0) >> 4),
            ((randomness[7] & 0x0e) << 1) | ((randomness[8] & 0x80) >> 7),
            (randomness[8] & 0x7c) >> 2,
            ((randomness[8] & 0x03) << 3) | ((randomness[9] & 0xe0) >> 5),
            (randomness[9] & 0x1f),
        ];
        return split5bit.map(i => table[i & 0b11111]).join("");
    }

    return function() {
        settime();
        crypto.getRandomValues(randomness);
        return encode();
    };
})();
