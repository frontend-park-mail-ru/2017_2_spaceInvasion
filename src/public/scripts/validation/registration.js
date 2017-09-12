$('.ui.form').form({
    fields: {
        email: {
            identifier: 'email',
            rules: [
                {
                    type: 'empty',
                    prompt: "Fill 'Email' field"
                },
                {
                    type: 'email',
                    prompt: "Enter valid email"
                }
            ]
        },
        login: {
            identifier: "login",
            rules: [
                {
                    type: 'empty',
                    prompt: "Fill 'Login' field"
                }
            ]
        },
        password: {
            identifier: "password",
            rules: [
                {
                    type: 'empty',
                    prompt: "Fill 'Password' field"
                },
                {
                    type: 'minLength[8]',
                    prompt: "Minimum password length is 8"
                }
            ]
        },
        password2: {
            identifier: "password2",
            rules: [
                {
                    type: 'empty',
                    prompt: "Fill 'Repeat password' field"
                }, {
                    type: 'match[password]',
                    prompt: "Passwords don't match"
                }
            ]
        },
        agree: {
            identifier: "agree",
            rules: [
                {
                    type: "checked",
                    prompt: "Agree to the Terms and Conditions"
                }
            ]
        }
    }
});