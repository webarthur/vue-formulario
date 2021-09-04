<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from 'vue'
import Formulario from './components/Formulario.vue'
import Validation from './components/Validation.vue'
import createForm from './createForm.js'

const form = ref(createForm({
  data: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    zip: null,
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
      match: [/^[a-z\d]*$/, 'Type only characterers and numbers '],
      required: [true, 'Your username is required.']
    },
    email: {
      type: 'string',
      format: ['email', 'The email format is invalid.'],
      required: [true, 'Your email is required.']
    },
  }
}))
</script>

<template>
  <div class="container">
    <div class="row g-5">
      <div class="col-md-6">

        <h1>Vue Formulario</h1>
        <p>Here you can test the validation with Formulario.</p>
        
        <Formulario @submit.prevent v-model="form">
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

            <div class="col-md-8">
              <label for="country" class="form-label">Country</label>
              <select class="form-select" id="country">
                <option value="">Choose...</option>
                <option>Brazil</option>
                <option>United States</option>
              </select>
              <div class="invalid-feedback">
                Please select a valid country.
              </div>
            </div>

            <div class="col-md-4">
              <label for="zip" class="form-label">Zip</label>
              <input type="text" class="form-control" id="zip" placeholder="">
              <div class="invalid-feedback">
                Zip code required.
              </div>
            </div>
          </div>

          <hr class="my-4">

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="same-address">
            <label class="form-check-label" for="same-address">Shipping address is the same as my billing address</label>
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="save-info">
            <label class="form-check-label" for="save-info">Save this information for next time</label>
          </div>

          <hr class="my-4">

          <h4 class="mb-3">Payment</h4>

          <div class="my-3">
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
          </div>

          <hr class="my-4">

          <button class="w-100 btn btn-primary btn-lg" type="submit">Continue to signup</button>

        </Formulario>

      </div>
      <div class="col-md-6">
        <div>
          <pre><code>{{form}}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>