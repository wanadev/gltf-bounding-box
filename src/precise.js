const precise = {
    
  /**
   * @public
   * @param {Number} number
   * @param {String|Number} precision the precision to round up the number
   * @return {Number} the rounded number
   */
  round(number, precision) {
    return precise._operation(Math.round, number, precision);
  },

  ceil(number, precision = 0) {
    return precise._operation(Math.ceil, number, precision);
  },

  _operation(operation, number, precision = 0) {
    if (precision === 0) {
      return operation(number);
    }
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = operation(tempNumber);
    return roundedTempNumber / factor;
  }
};

export default precise;
