$('.ui.form')
.form({
  fields: {
    login: {
        identifier:"login",
        rules: [
            {
                type: 'empty',
                prompt: "Fill 'login' field"
            }
        ]
    },
    password:{
        rules: [
            {
                type: 'empty',
                prompt: "Fill 'password' field"
            }
        ]
    }
  }
})
;