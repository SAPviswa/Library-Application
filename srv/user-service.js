const cds = require('@sap/cds');
const { Users } = cds.entities;

module.exports = cds.service.impl(async function () {
    this.on('signUp', async (req) => {
        const { username, email, password } = req.data;

        // Check if user already exists
        const existingUser = await SELECT.one.from(Users).where({ email });
        if (existingUser) {
            return 'User already exists';
        }

        // Hash the password (using a suitable hashing library)
        const hashedPassword = hashPassword(password);  // Implement hashPassword function

        // Create the user
        await INSERT.into(Users).entries({ ID: cds.utils.uuid(), username, email, password: hashedPassword });

        return 'User successfully signed up';
    });
});
