/* eslint-disable consistent-return, new-cap, no-alert, no-console */

/* Paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render('#paypal-mark')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder() {
      return fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
              quantity: "YOUR_PRODUCT_QUANTITY",
            },
          ],
        }),
      })
      .then((response) => response.json())
      .then((order) => order.id);
    },
    onApprove(data, actions) {
      return fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal(
            "Order Captured!",
            `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
              data.purchase_units[0].payments.captures[0].amount.currency_code
            } ${data.purchase_units[0].payments.captures[0].amount.value}`,
            "success"
          );
        })
        .catch(console.error);
    },
  })
  .render('#paypal-btn')

/* Mybank */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.MYBANK,
  })
  .render('#mybank-mark')

paypal
  .PaymentFields({
    fundingSource: paypal.FUNDING.MYBANK,
    style: {
      base: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        lineHeight: '1.4',
        letterSpacing: '0.3',
      },
      input: {
        backgroundColor: 'white',
        fontSize: '16px',
        color: '#333',
        borderColor: '#dbdbdb',
        borderRadius: '4px',
        borderWidth: '1px',
        padding: '1rem',
      },
      invalid: {
        color: 'red',
      },
      active: {
        color: 'black',
      },
    },
    fields: {
      name: {
        value: ''
      },
    },
  })
  .render('#mybank-container')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.MYBANK,
    style: {
      label: 'pay',
    },
    createOrder() {
      return fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
              quantity: "YOUR_PRODUCT_QUANTITY",
            },
          ],
        }),
      })
      .then((response) => response.json())
      .then((order) => order.id);
    },
    onApprove(data, actions) {
      return fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          swal("Order Captured!", `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${data.purchase_units[0].payments.captures[0].amount.currency_code} ${data.purchase_units[0].payments.captures[0].amount.value}`, "success");
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      console.log(data)
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render('#mybank-btn')

/* radio buttons */
document.getElementById('mybank-container').style.display = 'none'
document.getElementById('mybank-btn').style.display = 'none'

// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.getElementById('mybank-container').style.display = 'none'
        document.getElementById('mybank-btn').style.display = 'none'

        document.getElementById('paypal-btn').style.display = 'block'

        break
      case 'mybank':
        document.getElementById('mybank-container').style.display = 'block'
        document.getElementById('mybank-btn').style.display = 'block'

        document.getElementById('paypal-btn').style.display = 'none'
        break

      default:
        break
    }
  })
})
