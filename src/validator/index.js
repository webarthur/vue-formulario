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

    const type = validate.getType(schema[path].type)
    const value = data[path]

    // console.log('validate', path, type, value)

    if (type) {
      // For each key of schema entry
      for (const kindKey of Object.keys(schema[path])) {
        const kind = kindKey.toLowerCase()
        const setup = schema[path][kindKey]
  
        // Get keyword validator
        const validator = validate.types[type].keywords[kind]
        
        // if there is a validation function
        if (validator && typeof validator === 'function') {
          if (!validator(value, setup[0] || setup)) {
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
  const message = setup[1] || messages[type][kind] || messages.general[kind] || messages.general.default
  return message
          .replace(/{PATH}/, path)
          .replace(/{VALUE}/, value)
}

// Find the type
validate.getType = function (type) {
  for (const typeName of Object.keys(validate.types)) {
    if (validate.types[typeName].test && validate.types[typeName].test(type)) {
      return typeName
    }
    else {
      // add error: type not found
    }
  }
}

validate.types = {

  String: {
    test: (type) => type === String || typeof type === 'string' && type.toLowerCase() === 'string',
    keywords: {
      required: v => (v instanceof String || typeof v === 'string') && v.length,
      type: (v, value) => (v instanceof String || typeof v === 'string' || typeof v === 'undefined'),
      maxlength: (v, value) => v === null || v.length <= value,
      minlength: (v, value) => v === null || v.length >= value,
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

}

export default validate