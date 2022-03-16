<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from 'vue'
import { Formulario, Validation, createForm } from '../main'

const form = ref(createForm({

  data: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    age: '',
    profession: '',
    knowledge: []
  },

  schema: {
    firstName: {
      type: 'string',
      required: [true, 'Valid first name is required.']
    },
    lastName: {
      type: 'string',
      required: [true, 'Valid last name is required.']
    },
    username: {
      type: 'string',
      match: [/^[a-z\d]*$/, 'Type only characters and numbers '],
      required: [true, 'Your username is required.']
    },
    email: {
      type: 'string',
      format: ['email', 'The email format is invalid.'],
      required: [true, 'Your email is required.']
    },
    age: {
      type: 'number',
      min: [1, 'You need to be older'],
      max: [120, 'You can\'t be that old.'],
      required: [true, 'Your age is required.']
    },
    profession: {
      type: 'string',
      format: ['objectid', 'This option is invalid.'],
      required: [true, 'Valid profession option is required.']
    },
    knowledge: {
      type: 'array',
      required: [true, 'Please, select at least one option.']
    },
    dynamicError: {
      type: 'string'
    }
  }

}))

async function submitForm () {
  console.log('Sending form...')

  // await a second to simulate a request
  await new Promise(resolve => setTimeout(resolve, 1000))
}

function errorHandler () {
  console.warn('>', error)
}
</script>

<template>
  <div class="container">
    <div class="row g-5">
      <div class="col-md-6">

        <h1>Vue Formulario</h1>
        <p>Here you can test the validation with Formulario.</p>

        <Formulario v-model="form" @validated="submitForm" @error="errorHandler">

          <div class="row g-3">

            <Validation for="firstName" class="col-sm-6">
              <label for="firstName" class="form-label">First name</label>
              <input v-model="form.data.firstName" type="text" class="form-control" id="firstName" placeholder="Arthur">
            </Validation>

            <Validation for="lastName" class="col-sm-6">
              <label for="lastName" class="form-label">Last name</label>
              <input v-model="form.data.lastName" type="text" class="form-control" id="lastName" placeholder="Ronconi">
              <div class="invalid-feedback">
                Valid last name is required.
              </div>
            </Validation>

            <Validation for="username" class="col-12">
              <label for="username" class="form-label">Username</label>
              <div class="input-group has-validation">
                <span class="input-group-text">@</span>
                <input v-model="form.data.username" type="text" class="form-control" id="username" placeholder="webarthur">
              </div>
            </Validation>

            <Validation for="email" class="col-12">
              <label for="email" class="form-label">Email <span class="text-muted">(Optional)</span></label>
              <input v-model="form.data.email" type="email" class="form-control" id="email" placeholder="you@example.com">
              <div class="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </Validation>

            <Validation for="profession" class="col-md-8">
              <label for="profession" class="form-label">Profession</label>
              <select v-model="form.data.profession" class="form-select" id="profession">
                <option value="">Choose...</option>
                <option value="61353fcc71337b5b94a209d6">Developer</option>
                <option value="61353fdb4bdd98ce41eb5e59">Designer</option>
                <option value="61353fe13c56d04d8aa976d7">Engeneer</option>
                <option value="61353fe5ef39f26ee3388784">Student</option>
                <option value="61353fe5ef39f26ee">(Wrong ObjectID format)</option>
              </select>
              <div class="invalid-feedback">
                Please select a valid profession.
              </div>
            </Validation>

            <Validation for="age" class="col-md-4">
              <label for="age" class="form-label">Age</label>
              <input v-model.number="form.data.age" type="number" class="form-control" id="age" placeholder="">
              <div class="invalid-feedback">
                Age code required.
              </div>
            </Validation>
            
          </div>

          <hr class="my-4">

          <Validation for="knowledge" class="row g-3">

            <div class="col-md-4">
              <div class="form-check">
                <input v-model="form.data.knowledge" value="HTML" type="checkbox" class="form-check-input" id="HTML">
                <label class="form-check-label" for="HTML">HTML</label>
              </div>

              <div class="form-check">
                <input v-model="form.data.knowledge" value="CSS" type="checkbox" class="form-check-input" id="CSS">
                <label class="form-check-label" for="CSS">CSS</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-check">
                <input v-model="form.data.knowledge" value="JavaScript" type="checkbox" class="form-check-input" id="JavaScript">
                <label class="form-check-label" for="JavaScript">JavaScript</label>
              </div>

              <div class="form-check">
                <input v-model="form.data.knowledge" value="Vue" type="checkbox" class="form-check-input" id="Vue">
                <label class="form-check-label" for="Vue">Vue</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-check">
                <input v-model="form.data.knowledge" value="Bootstrap" type="checkbox" class="form-check-input" id="Bootstrap">
                <label class="form-check-label" for="Bootstrap">Bootstrap</label>
              </div>

              <!-- <div class="form-check">
                <input v-model="form.data.knowledge" value="CSS" type="checkbox" class="form-check-input" id="CSS">
                <label class="form-check-label" for="CSS">CSS</label>
              </div> -->
            </div>

          </Validation>

          <!-- <hr class="my-4"> -->

          <!-- <h4 class="mb-3">Payment</h4> -->

          <!-- <div class="my-3">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked="">
              <label class="form-check-label" for="credit">Credit card</label>
            </div>
            <div class="form-check">
              <input id="debit" name="paymentMethod" type="radio" class="form-check-input">
              <label class="form-check-label" for="debit">Debit card</label>
            </div>
            <div class="form-check">
              <input id="paypal" name="paymentMethod" type="radio" class="form-check-input">
              <label class="form-check-label" for="paypal">PayPal</label>
            </div>
          </div>

          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-name" class="form-label">Name on card</label>
              <input type="text" class="form-control" id="cc-name" placeholder="">
              <small class="text-muted">Full name as displayed on card</small>
              <div class="invalid-feedback">
                Name on card is required
              </div>
            </div>

            <div class="col-md-6">
              <label for="cc-number" class="form-label">Credit card number</label>
              <input type="text" class="form-control" id="cc-number" placeholder="">
              <div class="invalid-feedback">
                Credit card number is required
              </div>
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration</label>
              <input type="text" class="form-control" id="cc-expiration" placeholder="">
              <div class="invalid-feedback">
                Expiration date required
              </div>
            </div>

            <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="">
              <div class="invalid-feedback">
                Security code required
              </div>
            </div>
          </div> -->

          <hr class="my-4">

          <button class="w-100 btn btn-primary btn-lg" type="submit" :disabled="form.loading">Submit</button>

          <p v-if="form.loading" class="mt-3 text-center">Sending...</p>

          <hr class="my-4">

          <Validation for="dynamicError">
            <button @click="form.addError('dynamicError', 'Show message error!')" class="w-100 btn btn-secondary btn-lg" type="button">Add dynamic error message</button>
          </Validation>

        </Formulario>

      </div>
      <div class="col-md-6">
        <div class="bg-light p-3 rounded small">
          <pre><code>{{form}}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  color: #2c3e50;
  margin-top: 60px;
}
</style>
