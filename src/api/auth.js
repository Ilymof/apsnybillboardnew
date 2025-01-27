'use strict'
const { pipe } = require('../lib/pipe.js')
const AuthValidator = require('../validators/AuthValidator.js')
const { option } = require('../lib/option.js')
const { either } = require('../lib/either.js')
const checkRequestBody = (body) => {
	return body !== undefined ? option.Some(body) : option.None();
};

module.exports = {
	async login(data) {
		return pipe(
			checkRequestBody,
			(body) => body.fold(
				() => either.Left('Request body is undefined'),
				(body) => AuthValidator.login(body)
			),
			(data) => {
				data.fold(
					(error) => console.log(error),
					(value) => console.log(value)
				)
			}
		)(data)
	}
}