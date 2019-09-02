export class Utils {

    static clamp(value, min, max) {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        return value;
    }

    static to255(float) {
        return Math.floor(float * 255);
    }
}