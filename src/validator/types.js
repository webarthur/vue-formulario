import formats from './formats'

// From: https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
export default {

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