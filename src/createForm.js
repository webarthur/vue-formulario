import validator from './validator'

export default function (settings) {
  return {

    loading: false,
    
    dirty: false,
    
    valid: false,
    
    data: {},
    
    schema: {},
    
    errors: {},
    
    refs: {},

    childRefs: {},

    reset () {},

    resetErrors () {
      for (const field of Object.keys(this.schema)) {
        // Check if the <Validation> component has created
        if (!this.childRefs[field]) {
          continue
        }
        this.childRefs[field].value = {}
      }
    },

    onSubmit () {},

    errorHandler (e) {
      console.error(e)
      alert(e)
    },

    addError (path, message) {
      this.childRefs[path] = {
        message,
        path,
        kind: 'custom'
      }
      console.warn(path + ':', message);
    },

    validate () {
      const valid = validator(this.schema, this.data)

      // console.log('> valid', valid.errors)
    
      for (const field of Object.keys(valid.errors)) {
        // childRefs[field].value = valid.errors[field]
        if (this.refs[field]) {
          this.refs[field].value = valid.errors[field]
        }
      }
    
      // console.log('errors', errors)
    },

    errorHandler (err) {
      console.error(err)
      return void(0)
    },

    ...settings
  }
}