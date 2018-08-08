const precise = {
    
	/**
     * @public
     * @param {Number} number
     * @param {String|Number} precision the precision to round up the number
     * @return {Number} the rounded number
     */
	round(number, precision) {
		var factor = Math.pow(10, precision);
		var tempNumber = number * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	}
};

export default precise;
