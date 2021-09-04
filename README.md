# Vue Formulario

> Form validator with mongoose-like schema validator for [Vue 3](https://vuejs.org/).

- 🔑 Mogoose-like schema validation
- 💡 Validate on submit
- ⚡️ Validate while typing
- 🛠️ Custom formats and keywords
- :speech_balloon: Custom error messages

### Try it!

[See the live demo](https://webarthur.github.io/vue-formulario/)

### Install via NPM
```sh
$ npm install vue-formulario
```

### Install via CDN
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-formulario"></script>
<script>
  const app = Vue.createApp({
    data () {
      return {
        form: createForm({
          data: {
            name: '',
            email: ''
          },
          schema: {
            name: {
              type: String,
              required: true
            },
            email: {
              type: String,
              format: 'email',
              required: [true, 'Custom error message']
            }
          }
        })
      }
    }
  })
  app.use(Formulario)
  app.use(Validation)
  app.mount('#app')
</script>
```

### Register as Component
```js
import { Formulario, Validation } from 'vue-formulario'

export default {
  components: {
    Formulario,
    Validation
  }
}
```

### Quick example

```vue
<template>
  <Formulario v-model="form" @submit.prevent="submitForm">
    <Validation for="firstName">
      <label>First name</label>
      <input v-model="form.data.firstName" type="text">
    </Validation>
    <Validation for="lastName">
      <label>Last name</label>
      <input v-model="form.data.lastName" type="text">
    </Validation>
    <Validation for="email">
      <label>Email</label>
      <input v-model="form.data.email" type="text">
    </Validation>
  </Formulario>
</template>

<script>
import { Formulario, Validation, createForm } from 'vue-formulario'

export default {

  name: 'App',

  components: {
    Formulario,
    Validation
  },

  data () {
    return {
      form: createForm({
        data: {
          firstName: '',
          lastName: '',
          email: ''
        },
        schema: {
          firstName: {
            type: String,
            required: true
          },
          lastName: {
            type: String
            required: [true, 'Custom error message']
          },
          email: {
            type: String,
            format: 'email'
          }
        }
      })
    }
  }

}
</script>
```

## License

Vue Formulario is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

