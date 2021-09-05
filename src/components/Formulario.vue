<script>
import { ref } from 'vue'
import createForm from '../createForm'
import validator from '../validator'

export default {
  
  props: {
    data: Object,
    schema: Object,
    // settings: Object,
    // status: Object,
    modelValue: Object,
    isFormulario: Boolean,
  },

  setup (props) {
    // const props = defineProps({
    //   data: Object,
    //   schema: Object,
    //   // settings: Object,
    //   status: Object,
    //   modelValue: Object,
    // })

    let data
    let schema
    // let setup

    if (props.modelValue) {
      data = props.modelValue.data
      schema = props.modelValue.schema
      // status = props.modelValue.status
    }
    else {
      // setup = createForm({
      //   data: props.data,
      //   schema: props.schema,
      //   status: props.status,
      // })
      data = props.data
      schema = props.schema
      // status = props.status
    }

    const childRefs = props.modelValue.childRefs = {}

    const isFormulario = true

    // Save validation component references here
    // const errors = ref({})

    function validateForm () {

      // Reset errors
      for (const field of Object.keys(schema)) {
        // Check if the <Validation> component has created
        if (!childRefs[field]) {
          continue
        }
        childRefs[field].value = {}
      }

      const valid = validator(schema, data)
      // console.log('> valid', valid.errors)

      // Add error message to the <Validation> component
      for (const field of Object.keys(valid.errors)) {
        // Check if the <Validation> component has created
        if (!childRefs[field]) {
          continue
        }
      childRefs[field].value = valid.errors[field]
      }
    }
    
    return {
      data, schema, childRefs, isFormulario, validateForm
      // , status
    }
  }
  
}
</script>

<template>
  <form @submit="validateForm">
    <slot />
  </form>
</template>
