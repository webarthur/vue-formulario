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

const instance = getCurrentInstance()
if (!instance.parent.ctx.isFormulario) {
  console.error(new Error('Parent is not a Formulario component'))
}

const Formulario = instance.parent.ctx
// console.log(Formulario)

Formulario.childRefs[fieldName] = error

function validate () {
  const data = { [fieldName]: Formulario.data[fieldName] }
  const schema = {
    [fieldName]: Formulario.schema[fieldName]
  }
  
  const valid = validator(schema, data)

  if (!valid.valid) {
    console.log('valid.errors', valid.errors)
    error.value = valid.errors[fieldName]
  }
  else {
    error.value = {}
  }
  console.log(Formulario.childRefs)
}

// Validate on input when has an error
function inputValidate () {
  if (error.value && error.value.message && !Array.isArray(Formulario.data[fieldName])) {
    validate()
  }
}
</script>

<template>
  <div @change="validate" @input="inputValidate" :class="{ 'input-error': error.message }">
    <slot />
    <div v-if="error.message" class="input-error-message">
      <small>{{error.message}}</small>
    </div>
  </div>
</template>

<style>
.input-error input {
  border: 1px solid #dc3545;
}
.input-error-message {
  color: #dc3545;
  font-size: .875em;
}
</style>