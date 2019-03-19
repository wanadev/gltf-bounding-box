const precise = {
    
  /**
   * @public
   * @param {Number} number
   * @param {String|Number} precision the precision to round up the number
   * @return {Number} the rounded number
   * 
   * If precision is not 0, the number is rounded using ceil to avoid having a bbox smaller than the actual object.
   */
  round(number, precision) {
    if (precision === 0) {
      return Math.round(number);
    }
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
        const roundedTempNumber = Math.ceil(tempNumber);
    return roundedTempNumber / factor;
  }
};

export default precise;
