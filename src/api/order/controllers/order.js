'use strict';

/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports = createCoreController('api::order.order', ({ strapi }) =>  ({
    async startPayment(ctx){
      const { paymentAmount, email } = ctx.request.body.data;
      try{
        const paymentIntent = await stripe.paymentIntents.create({
          amount: (paymentAmount * 100).toFixed(0),
          receipt_email: email,
          currency: 'eur',
          payment_method_types: ['ideal'],
        })
        const orderDataRes = await super.create(ctx);
        return {clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id, orderDataRes};
      }catch(e) {
        return e;
      }
    },
    async updatePayment(ctx){
      const { paymentAmount, paymentId, customerEmail } = ctx.request.body;
      const paymentIntent = await stripe.paymentIntents.update(paymentId, {
        amount: (paymentAmount * 100).toFixed(0),
        receipt_email: customerEmail
      })
      console.log("ran update");
      return {clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id};
    }
}));
