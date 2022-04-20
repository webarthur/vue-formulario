import messages from './messages'
import formats from './formats'

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

    if (!schema[path]) {
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
        if (type === 'String' && setup.trim && data[path]) {
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

validate.types = {

  String: {
    test: (type) => type === String || typeof type === 'string' && type.toLowerCase() === 'string',
    keywords: {
      trim: () => true, // just to avoid throw an error
      required: v => (v instanceof String || typeof v === 'string') && v.length,
      type: v => (v instanceof String || typeof v === 'string' || typeof v === 'undefined'),
      maxlength: (v, value) => v === null || v === undefined || v.length <= value,
      minlength: (v, value) => v === null || v === undefined || v.length >= value,
      match: (v, re) => !re || ((v != null && v !== '') ? re.test(v) : true),
      enum: (v, value) => undefined === v || ~value.indexOf(v),
      format: (v, format) => !format || !formats[format] || ((v != null && v !== '') ? formats[format].test(v) : true),
    },
  },

  Number: {
    test: (type) => type === Number || typeof type === 'string' && type.toLowerCase() === 'number',
    keywords: {
      required: v => (v instanceof Number || typeof v === 'number'),
      min: (v, value) => v === null || v >= value,
      max: (v, value) => v === null || v <= value,
      enum: (v, value) => undefined === v || ~value.indexOf(v),
    }
  },

  Array: {
    test: (type) => type === Array || typeof type === 'string' && type.toLowerCase() === 'array',
    keywords: {
      required: v => (v instanceof Array || Array.isArray(v)) && v.length > 0,
      // min: (v, value) => v === null || v >= value,
      // max: (v, value) => v === null || v <= value,
    }
  },

  Date: {
    test: (type) => type === Date || typeof type === 'string' && type.toLowerCase() === 'date',
    keywords: {
      required: v => (v instanceof Date),
      // min: (v, value) => v === null || v >= value,
      // max: (v, value) => v === null || v <= value,
    }
  },

  // Object: {

  // }

}

export default validate