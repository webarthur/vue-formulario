<script setup>
import validator from '../validator'
import { useAttrs, ref } from 'vue'

const attrs = useAttrs() // Access component's attributes

const props = defineProps({
  // Form data model
  modelValue: {
    type: Object,
    required: true,
  },

  // Flag for Validation component to find this component
  isFormulario: {
    type: Boolean,
    default: true,
  },

  // Form data schema
  schema: {
    type: Object,
    default: () => ({}),
  },
})

if (!props.modelValue) {
  throw new Error('Formulario needs a v-model attribute.')
}

const form = {
  data: props.modelValue, // Data object for the form
  schema: props.schema,   // Validation schema for the form data
  loading: ref(false),    // Ref for loading status of the form
  dirty: false,   // Flag to indicate if the form has been modified
  valid: false,   // Flag to indicate if the form data is valid
  refs: {},       // Object to store refs for form fields
  childRefs: {},  // Object to store refs for validation components

  // Function to reset the form
  reset () {},

  // Function to reset validation errors
  resetErrors () {
    Object.keys(this.schema).forEach(field => {
      if (this.childRefs[field]) {
        this.childRefs[field].value = {}
      }
    })
  },

  // Function to add a validation error
  addError (path, message) {
    this.childRefs[path].value = { message, path, kind: 'custom' }
    console.warn(path + ':', message)
  },

  // Function to validate the form data
  validate () {
    const valid = validator(this.schema, this.data)
    Object.keys(valid.errors).forEach(field => {
      if (this.refs[field]) {
        this.refs[field] = valid.errors[field]
      }
    })
  },

  // Function to set the dirty flag for the form
  dirtyForm () {
    this.dirty = true
  },

  // Function to handle form validation
  async validateForm (e) {
    this.valid = true
    this.resetErrors()

    const valid = validator(this.schema, this.data)
    for (const field of Object.keys(valid.errors)) {
      if (!this.childRefs[field]) {
        console.warn('Formulario: There is no <Validation> component for ' + field)
        continue
      }
      this.valid = false
      this.childRefs[field].value = valid.errors[field]
    }

    if (this.valid) {
      this.loading.value = true
      try {
        if (attrs.onValidated) {
          await attrs.onValidated(this)
        }
      }
      catch (e) {
        if (attrs.onError) {
          await attrs.onError(e, this)
        }
        else {
          throw e
        }
      }
      this.loading.value = false
    }
  }

}

defineExpose({ ...form }) // Expose form object to the component
</script>

<template>
  <form 
    @submit.prevent="form.validateForm"
    @change="form.dirtyForm">
    <slot />
  </form>
</template>
