<script setup>
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import validator from '../validator'

const error = ref({})
const props = defineProps({
  for: String,
  messageclass: String,
})

const fieldName = props.for

let instance = getCurrentInstance().parent
while (!instance.props.isFormulario && instance.parent) {
  instance = instance.parent
}

let Formulario
if (!instance.props.isFormulario) {
  console.error(new Error('Parent is not a Formulario component'))
  Formulario = { data: {}, schema: {}, parentError: true }
}
else {
  Formulario = instance.props.modelValue
  Formulario.childRefs[fieldName] = error
}

// Validate the input
function validate () {
  if (Formulario.parentError) {
    console.error(new Error('Validation fail because Validation component has no Formulatio parent.'))
    return
  }
  
  const data = { [fieldName]: Formulario.data[fieldName] }
  const schema = {
    [fieldName]: Formulario.schema[fieldName]
  }
  
  const valid = validator(schema, data)

  if (!valid.valid) {
    error.value = valid.errors[fieldName]
  }
  else {
    error.value = {}
  }
}

// Validate on input when has an error
function inputValidation () {
  if (Formulario.parentError) {
    console.error(new Error('Validation fail because Validation component has no Formulatio parent.'))
    return
  }

  if (error.value && error.value.message && !Array.isArray(Formulario.data[fieldName])) {
    validate()
  }
}
</script>

<template>
  <div @change="validate" @input="inputValidation" :class="{ 'input-error': error.message }">
    <slot />
    <div v-if="error.message" class="input-error-message">
      <small>{{error.message}}</small>
    </div>
  </div>
</template>

<style>
.input-error input,
.input-error select,
.input-error textarea {
  border: 1px solid #dc3545;
}
.input-error-message {
  color: #dc3545;
  font-size: .875em;
}
</style>