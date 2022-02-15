module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '9690e9460b0f80a39f388ecc8c76193f'),
  },
});
