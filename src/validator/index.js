import messages from './messages'
import formats from './formats'
import types from './types'

// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html
// https://github.com/Automattic/mongoose/blob/master/lib/schema/string.js
// https://github.com/Automattic/mongoose/blob/80245edf5aeab304411681035f7f4153dbd2b692/lib/error/messages.js

/**
 * Validate data against mongoose-like schema
 * @param {object} schema
 * @param {object} data
 */
const validate = function (schema, data) {
  const response = {
    valid: true,
    errors: {}
  }

  // For each schema key
  for (const path of Object.keys(schema)) {

    if (!schema[path] || !schema[path].type) {
      continue
    }

    const type = validate.getType(schema[path].type, path)

    if (type) {
      // For each key of schema entry
      for (const kindKey of Object.keys(schema[path])) {
        const kind = kindKey.toLowerCase()
        const setup = schema[path][kindKey]
  
        // Get keyword validator
        const validator = validate.types[type].keywords[kind]
        
        // Executes trim()
        if (type === 'String' && schema[path].trim && data[path]) {
          data[path] = data[path].trim()
        }
        
        // Get path value from data object
        const value = data[path]

        // When there is a validation function
        if (validator && typeof validator === 'function') {
          // Validate data against schema
          if (!validator(value, Array.isArray(setup) ? setup[0] : setup)) {
            const message = validate.getErrorMessage(type, kind, path, value, setup)

            response.valid = false,
            response.errors[path] = { kind, path, message, value }

            // Skip full validation when required fails
            if (kind === 'required') {
              break
            }
          }
        }
      }
    }

  }

  return response
}

validate.messages = messages
validate.formats = formats
validate.types = types

validate.addKeyword = function (keyword, type, fn) {
  validate.types[type][keyword] = fn
}

validate.addFormat = function (name, re) {
  validate.formats[name] = re
}

validate.getErrorMessage = function (type, kind, path, value, setup) {
  const message = Array.isArray(setup) && setup[1]
    || messages[type][kind]
    || messages.general[kind]
    || messages.general.default
  return message
          .replace(/{PATH}/, path)
          .replace(/{VALUE}/, value)
}

// Find the type
validate.getType = function (type, path) {
  for (const typeName of Object.keys(validate.types)) {
    if (validate.types[typeName].test && validate.types[typeName].test(type)) {
      return typeName
    }
  }
  // Throw a warning: type not found
  console.warn('Validation: type "' + type + '" not found for "' + path + '"')
}

export default validate