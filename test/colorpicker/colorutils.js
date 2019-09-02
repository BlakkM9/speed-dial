export class ColorUtils {

    /**
     * Converts hsv to hsl color
     * hue ranging from 0 to 359
     * sat, val, light ranging from 0 to 1
     * @param hsv in format {hue: >=0 && < 360, sat: >= 0 && < 1, val: >= 0 && < 1}
     * @return {hue: *, sat: *, light: *}
     */
    static hsv2hsl(hsv) {
        let light = hsv.val - (hsv.val * hsv.sat) / 2;

        let sat;
        if (light === 0 || light === 1) {
            sat = 0;
        } else {
            sat = (hsv.val - light) / Math.min(light, 1 - light);
        }

        return {hue: hsv.hue, sat: sat, light: light};
    }

    static rgb2hsv(rgb) {
        let max = Math.max(rgb.r, rgb.g, rgb.a);
        let min = Math.min(rgb.r, rgb.g, rgb.a);

        //Hue
        let hue;
        if (max === min) {
            hue = 0;
        } else if (max === rgb.r) {
            hue = 60 * (rgb.g - rgb.b) / (max - min);
        } else if (max === rgb.g) {
            hue = 60 * (2 + (rgb.b - rgb.r) / (max - min));
        } else {
            //b is max
            hue = 60 * (2 + (rgb.r - rgb.g) / (max - min));
        }

        if (hue < 0) hue += 360;

        //Sat
        let sat;
        if (max === 0) {
            sat = 0;
        } else {
            sat = (max - min) / max;
        }

        return {hue: hue, sat: sat, val: max};
    }

    /**
     * Converts hsva to hex color
     * hue ranging from 0 to 359
     * r, g, b, a ranging from 0 to 1
     * @param rgba in format {r, g, b, a}
     * @return hex as string without #
     */
    static rgba2hex(rgba) {
        return this.comp2Hex(rgba.r) + this.comp2Hex(rgba.g) + this.comp2Hex(rgba.b) + this.comp2Hex(rgba.a);
    }

    /**
     * Converts hsv to rgb color
     * hue ranging from 0 to 359
     * sat, val, r, g, b ranging from 0 to 1
     * @param hsv in format {hue, sat, val}
     * @return {r: *, g: *, b: *}
     */
    static hsv2rgb(hsv) {
        let r = this.hsv2rgbHelper(5, hsv);
        let g = this.hsv2rgbHelper(3, hsv);
        let b = this.hsv2rgbHelper(1, hsv);

        return {r: r, g: g, b: b};
    }

    /**
     * helper function for converting hsv to rgb
     * @param n
     * @param hsv
     * @returns {number}
     */
    static hsv2rgbHelper(n, hsv) {
        let k = (n + (hsv.hue / 60)) % 6;

        return hsv.val - (hsv.val * hsv.sat * Math.max(Math.min(k, 4 - k, 1), 0));
    }

    static hex2rgba(hex) {
        if (hex.length !== 8) {
            hex = this.extendHex(hex);
        }

        if (hex != null) {
            //Convert to floats
            let r = this.comp2Float(hex.substr(0, 2));
            let g = this.comp2Float(hex.substr(2, 2));
            let b = this.comp2Float(hex.substr(4, 2));
            let a = this.comp2Float(hex.substr(6, 2));

            return {r: r, g: g, b: b, a: a};
        }
    }

    static extendHex(hex) {
        if (hex.length === 3 || hex.length === 4 ||
            hex.length === 6 || hex.length === 8) {
            let rHex = "";
            let gHex = "";
            let bHex = "";
            let aHex = "";

            //Parse all valid hex lengths in css
            if (hex.length === 3 || hex.length === 4) {
                rHex = hex.substr(0, 1);
                rHex += rHex;
                gHex = hex.substr(1, 1);
                gHex += gHex;
                bHex = hex.substr(2, 1);
                bHex += bHex;

                if (hex.length === 3) {
                    aHex = "ff";
                } else {
                    aHex = hex.substr(3, 2);
                    aHex += aHex;
                }
            } else if (hex.length === 6 || hex.length === 8) {
                rHex = hex.substr(0, 2);
                gHex = hex.substr(2, 2);
                bHex = hex.substr(4, 2);
                if (hex.length === 6) {
                    aHex = "ff";
                } else {
                    aHex = hex.substr(6, 2);
                }
            }

            return rHex + gHex + bHex + aHex;
        } else {
            return null;
        }
    }

    /**
     * Converts value ranging from 0 - 1 in hex
     * @param c
     */
    static comp2Hex(c) {
        let hex = Math.floor(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    static comp2Float(c) {
        return parseInt(c, 16) / 255;
    }
}