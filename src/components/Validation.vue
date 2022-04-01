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

// Get <Formulario> component instance
let Formulario = getCurrentInstance().parent
while (!Formulario.props.isFormulario && Formulario.parent) {
  Formulario = Formulario.parent
}

if (!Formulario.props.isFormulario) {
  throw new Error('Validation needs a Formulario component as parent')
}
else {
  console.log('Formulario', Formulario)
  Formulario.ctx.childRefs[fieldName] = error
}

// Validate the input
function validate () {
  if (Formulario.parentError) {
    console.error(new Error('Validation fail because Validation component has no Formulatio parent.'))
    return
  }
  const valid = validator(
    { [fieldName]: Formulario.ctx.data[fieldName] },
    { [fieldName]: Formulario.ctx.schema[fieldName] }
  )
  error.value = !valid.valid ? valid.errors[fieldName] : {}
}

// Validate input event when it has an error
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