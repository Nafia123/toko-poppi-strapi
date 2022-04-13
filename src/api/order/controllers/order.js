'use strict';

/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const stripe = require('stripe')(process.env.STRIPE_KEY);
const emailTemplate = require('../../../../public/Email-template');

const emailTemplateEN = {
  subject: 'Thank you for your order. Toko Poppi',
  text: `Dear <%= fullName %>,
  Thank you for your order.
  Your orderNumber is <%= orderNumber %>`,
  html: emailTemplate.template

}

const emailTemplateNL = {
  subject: 'Toko Poppi maaltijd bestelling',
  text: `Beste <%= fullName %>,
  Dankuwel voor uw bestelling.
  U bestelnummer is <%= orderNumber %>`,
  html: emailTemplate.template
}

module.exports = createCoreController('api::order.order', ({ strapi }) =>  ({
    async sendConfirmEmail(ctx){
      const { locale, attributes: {customerInformation: { fullName, email}, orderContent, orderNumber, paymentAmount}} = ctx.request.body;
      orderContent.forEach(order => console.log(order.price));
      console.log();
      try{
        await strapi.plugins['email'].services.email.sendTemplatedEmail({
            to: email,
          }, (locale === 'nl-NL' ? emailTemplateNL : emailTemplateEN),
          {
            email,
            fullName,
            orderNumber,
            paymentAmount,
            orderContent
          }
        );
      }catch (e){
        console.log(e);
      }
      return { status: 200 };
    },
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
