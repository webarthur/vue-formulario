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

    catch (e) {
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
      for (const field of Object.keys(valid.errors)) {
        // childRefs[field].value = valid.errors[field]
        if (this.refs[field]) {
          // this.refs[field].value = valid.errors[field]
          this.refs[field] = valid.errors[field]
        }
      }
    },

    ...settings
  }
}