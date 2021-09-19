<script>
import { ref } from 'vue'
import createForm from '../createForm'
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
    // FIX: this function is readonly
    // if (context.attrs.onSubmit) {
    //   const originalSubmit = context.attrs.onSubmit
    //   context.attrs.onSubmit = async function (event, ...args) {
    //     // Form.loading = true
    //     // await originalSubmit(event)
    //     // Form.loading = false
    //   }
    // }

    const Form = props.modelValue

    if (!Form) {
      throw new Error('Formulario needs the v-model attribute')
    }

    const data = Form.data
    const schema = Form.schema
    const childRefs = props.modelValue.childRefs = {}

    /**
     * Function to validate form
     * @param {object} e
     */
    async function validateForm (e) {
      // Reset errors
      // for (const field of Object.keys(schema)) {
      //   // Check if the <Validation> component has created
      //   if (!childRefs[field]) {
      //     continue
      //   }
      //   childRefs[field].value = {}
      // }

      Form.valid = true
      Form.resetErrors()

      const valid = validator(schema, data)

      // Add error message to the <Validation> component
      for (const field of Object.keys(valid.errors)) {
        // Check if the <Validation> component has created
        if (!childRefs[field]) {
          continue
        }
        Form.valid = false
        childRefs[field].value = valid.errors[field]
        // console.log(childRefs[field])
      }

      // Trigger onSubmit function to work with loading variable
      if (Form.valid && Form.onSubmit) {
        Form.loading = true
        try {
          await Form.onSubmit()
        }
        catch (e) {
          if (typeof Form.catch === 'function') {
            Form.catch(e)
          }
          console.error(e)
        }
        Form.loading = false
      }
    }

    /**
     * Function to dirty form
     */
    function dirtyForm () {
      Form.dirty = true
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
