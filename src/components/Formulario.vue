<script>
import validator from '../validator'

export default {

  props: {
    
    // Form data model
    modelValue: Object,
    
    // Flag for Validation component to find this component
    isFormulario: {
      type: Boolean,
      default: true
    },

    // Form data schema
    schema: {
      type: Object,
      default: {}
    }

  },

  setup (props, context) {
    if (!props.modelValue) {
      throw new Error('Formulario needs a v-model attribute')
    }

    const form = {

      data: props.modelValue,

      schema: props.schema,

      loading: false,
      
      dirty: false,
      
      valid: false,
      
      // errors: {},
      
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

      addError (path, message) {
        this.childRefs[path].value = {
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

      dirtyForm () {
        this.dirty = true
      },

      /**
     * Function to validate form
     * @param {object} e
     */
      async validateForm (e) {
        this.valid = true
        this.resetErrors()
        this.$forceUpdate()

        const valid = validator(this.schema, this.data)
        // Add error message to the <Validation> component
        for (const field of Object.keys(valid.errors)) {
          // Check if the <Validation> component has created
          if (!this.childRefs[field]) {
            console.warn('Formulario: There is no <Validation> component for ' + field)
            continue
          }
          this.valid = false
          this.childRefs[field].value = valid.errors[field]
          // console.log(this.childRefs[field])
        }

        // Trigger onSubmit function to work with loading variable
        if (this.valid) {
          this.loading = true
          this.$forceUpdate()
          try {
            if (context.attrs.onValidated) {
              await context.attrs.onValidated(this)
            }
            // context.emit('validated', this)
          }
          catch (e) {
            if (context.attrs.onError) {
              await context.attrs.onError(e, this)
            }
            else {
              throw e
            }
            // context.emit('error', e, this)
            // console.error(e)
          }
          this.loading = false
          this.$forceUpdate()
        }
      }

    }

    return form
  }

}
</script>

<template>
  <form @submit.prevent="validateForm" @change="dirtyForm">
    <slot />
  </form>
</template>
