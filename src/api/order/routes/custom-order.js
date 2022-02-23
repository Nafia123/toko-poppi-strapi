module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/payment",
      handler: "order.startPayment",
    },
    {
      method: "POST",
      path: "/orders/mail",
      handler: "order.sendConfirmEmail",
    },
  ]
}
