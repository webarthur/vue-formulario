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

Formulario.childRefs[fieldName] = error

function changeValidation () {
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
  if (error.value && error.value.message && !Array.isArray(Formulario.data[fieldName])) {
    validate()
  }
}
</script>

<template>
  <div @change="changeValidation" @input="inputValidation" :class="{ 'input-error': error.message }">
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