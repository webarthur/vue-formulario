<script>
import validator from '../validator'

export default {

  props: {
    modelValue: Object,
    isFormulario: {
      type: Boolean,
      default: true
    },
  },

  setup (props, context) {
    const form = props.modelValue

    if (!form) {
      throw new Error('Formulario needs a v-model attribute')
    }

    const data = form.data
    const schema = form.schema
    const childRefs = props.modelValue.childRefs = {}

    /**
     * Function to validate form
     * @param {object} e
     */
    async function validateForm (e) {
      form.valid = true
      form.resetErrors()

      const valid = validator(schema, data)
      // Add error message to the <Validation> component
      for (const field of Object.keys(valid.errors)) {
        // Check if the <Validation> component has created
        if (!childRefs[field]) {
          console.warn('Formulario: There is no <Validation> component for ' + field)
          continue
        }
        form.valid = false
        childRefs[field].value = valid.errors[field]
        // console.log(childRefs[field])
      }

      // Trigger onSubmit function to work with loading variable
      if (form.valid) {
        form.loading = true
        try {
          if (typeof form.onSubmit === 'function') {
            await form.onSubmit()
          }
          context.emit('validated', form)
        }
        catch (e) {
          if (typeof form.catch === 'function') {
            form.catch(e)
          }
          context.emit('error', e, form)
          console.error(e)
        }
        form.loading = false
      }
    }

    /**
     * Function to dirty form
     */
    function dirtyForm () {
      form.dirty = true
    }

    return {
      data, schema, childRefs, validateForm, dirtyForm
    }
  }

}
</script>

<template>
  <form @submit.prevent="validateForm" @change="dirtyForm">
    <slot />
  </form>
</template>
