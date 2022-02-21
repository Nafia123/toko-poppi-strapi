module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/payment",
      handler: "order.startPayment",
    },
    {
      method: "PUT",
      path: "/orders/payment",
      handler: "order.updatePayment",
    },
  ]
}
