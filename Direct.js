export default class DirectMeasurement {
  constructor(
    nums,
    smallestScale,
    coefficientN,
    type,
    range,
    diapason,
    calibration
  ) {
    this.nums = Array.isArray(nums) ? nums : [];
    this.smallestScale = isNaN(smallestScale) ? 0 : smallestScale;
    this.coefficientN = isNaN(coefficientN) ? 0 : coefficientN;
    this.type = type;
    this.coefficientInf = 1.96;
    this.confidenceLimit = 95;
    this.range = range;
    this.diapason = diapason;
    this.calibration = calibration;
  }
  #shorten(number, limit = this.range) {
    if (typeof number === "number") {
      return number.toFixed(limit);
    }
  }

  averageValue() {
    if (this.nums.length === 0) return 0;
    const sum = this.nums.reduce((prev, curr) => prev + curr, 0);
    return this.#shorten(sum / this.nums.length);
  }

  standardError() {
    if (this.nums.length === 0 || this.nums.length === 1) return 0;
    const numerator = this.nums.reduce((prev, curr) => {
      return prev + Math.pow(curr - this.averageValue(), 2);
    }, 0);
    const denominator = this.nums.length * (this.nums.length - 1);

    return this.#shorten(Math.sqrt(numerator / denominator));
  }

  deviceError() {
    if (this.type === "vernier") {
      return this.smallestScale;
    } else if (this.type === "electrical") {
      return (this.calibration / 100) * this.diapason;
    } else {
      return this.smallestScale / 2;
    }
  }

  randomError() {
    return this.#shorten(this.standardError() * this.coefficientN);
  }

  measurementError() {
    return this.#shorten((this.deviceError() / 3) * this.coefficientInf);
  }

  absoluteError() {
    return this.#shorten(
      Math.sqrt(
        Math.pow(this.measurementError(), 2) + Math.pow(this.randomError(), 2)
      )
    );
  }

  relativeError() {
    if (this.averageValue() === 0) return 0;
    return this.#shorten((this.absoluteError() / this.averageValue()) * 100);
  }

  confidenceLimitInt() {
    return this.#shorten(this.confidenceLimit * 0.01, 2);
  }

  calculate() {
    return `<b>x</b> = ${this.averageValue()} ± ${this.absoluteError()} [unit], <b>ε</b> = ${this.relativeError()}%, at <b>β</b> = ${this.confidenceLimitInt()}
    `;
  }
}
