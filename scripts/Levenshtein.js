class Levenshtein {
    #str1;
    #str2;
    #matrix;
    /**
     * Calculates Levenshtein distance of the two strings.
     * @param {string} str1
     * @param {string} str2
     * @property distance
     * @property matrix
     * @function toString() returns distance calculation matrix in tile grid.
     * @function valueOf() returns this.distance
     */
    constructor(str1, str2) {
        this.#str1 = str1;
        this.#str2 = str2;
        this.#matrix = [];
        for (let i = 0; i <= this.#str1.length; i++) {
            this.matrix[i] = [];
        }
        this.distance = 0;
        this.calculate();
    }
    /**
     * @param {Array.<string>} strings
     */
    set strings(strings) {
        [this.#str1, this.#str2] = strings;
        this.#matrix = [];
        for (let i = 0; i <= this.#str1.length; i++) {
            this.#matrix[i] = [];
        }
        this.calculate();
    }
    /**
     * @returns {Array.<Array.<number>>} calculation matrix
     */
    get matrix() {
        return this.#matrix;
    }
    /**
     * @returns {number} distance
     */
    valueOf() {
        return this.distance;
    }
    /**
     * Returns string that shows Damerau-Levenshtein distance calculations matrix in tile grid.
     * @returns {string} string
     */
    toString() {
        let str1 = ' ' + this.#str1;
        let str2 = ' ' + this.#str2;
        let str = ''.padStart(4, ' ');
        for (let c of str2) {
            str += ' |' + c.padStart(4 - 2, ' ');
        }
        str += '\r\n';
        str += ''.padStart(4 + 1, '—') + ''.padStart(str2.length * 4, '+'.padEnd(4, '–')) + '\r\n';
        for (let i = 0; i < this.#matrix.length; i++) {
            str += str1[i].padStart(4, ' ');
            for (let j = 0; j < this.#matrix[i].length; j++) {
                str += ' |' + this.#matrix[i][j].toString(10).padStart(4 - 2, ' ');
            }
            str += '\r\n';
            str += ''.padStart(4 + 1, '—') + ''.padStart(str2.length * 4, '+'.padEnd(4, '–')) + '\r\n';
        }
        return str.substring(0, str.length - 2);
    }
    calculate() {
        for (let i = 0; i <= this.#str1.length; i++) {
            for (let j = 0; j <= this.#str2.length; j++) {
                this.#matrix[i][j] = this.D(i, j);
            }
        }
        this.distance = this.#matrix[this.#str1.length][this.#str2.length];
    }
    Matrix(i, j) {
        if (this.#matrix[i][j] == undefined) {
            this.#matrix[i][j] = this.D(i, j);
        }
        return this.#matrix[i][j];
    }
    D(i, j) {
        if (Math.min(i, j) == 0) {
            return Math.max(i, j);
        } else {
            let cost = +(this.#str1[i - 1] != this.#str2[j - 1]);
            return Math.min(
                this.Matrix(i - 1, j) + 1,
                this.Matrix(i, j - 1) + 1,
                this.Matrix(i - 1, j - 1) + cost
            )
        }
    }
}

/**
 * Calculate levenshtein distance between two strings.
 * @param {String} str1
 * @param {String} str2
 * @return {number} the levenshtein distance between two strings (>=0).
 */
function distance(str1, str2) {
    return new Levenshtein(str1, str2).distance;
}

/**
 * Selects the most similar string to original_string from target_strings.
 * @param {String} original_string
 * @param {Array.<String>} target_strings
 * @returns {{closest_string: String, distance: Number}} closest string and distance to it.
 */
function closest(original_string, target_strings) {
    let calculator = new Levenshtein(original_string, target_strings[0]);
    let result = { closest_string: target_strings[0], distance: calculator.distance };
    for (let i = 1; i < target_strings.length; i++) {
        let string = target_strings[i];
        calculator.strings = [original_string, string];
        let distance = calculator.distance;
        if (distance < result.distance) {
            result.closest_string = string;
            result.distance = distance;
        }
    }
    return result;
}

module.exports = {
    Levenshtein,
    distance,
    closest
}
