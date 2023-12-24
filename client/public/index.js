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
    // style object is optional
    style: {
      // customize field attributes (optional)
      variables: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif", // applies to all payment fields text
        fontSizeBase: "0.9375rem", // applies to input, placeholder, and dropdown text values
        fontSizeM: "0.93rem", // the payment fields title description
        textColor: "#2c2e2f", // applies payment fields title description, input, and dropdown text
        colorTextPlaceholder: "#2c2e2f", // applies to the placeholder text
        colorBackground: "#fff", // background color of the input and dropdown fields
        colorDanger: "#d20000", // applies to the invalid field border and validation text
        borderRadius: "0.2rem", // for the input and dropdown fields
        borderColor: "#dfe1e5", // for the input and dropdown fields
        borderWidth: "1px", // for the input and dropdown fields
        borderFocusColor: "black", // color for the invalid field border and validation text
        // spacingUnit: "10px", // spacing between multiple input fields, mybank has one input field
      },

      // set custom rules to apply to fields classes (optional)
      // see https://www.w3schools.com/css/css_syntax.asp fore more on selectors and declarations
      rules: {
        ".Input": {}, // overwrite properties for the input fields
        ".Input:hover": {}, // applies to the input field on mouse hover
        ".Input:focus": { // applies to the focused input field
          color: 'blue',
          boxShadow: '0px 2px 4px rgb(0 0 0 / 50%), 0px 1px 6px rgb(0 0 0 / 25%)',
        },
        ".Input:active": {}, // applies when input fields are clicked
        ".Input--invalid": {}, // applies to input fields when invalid input is entered
        ".Label": {}, // overwrite properties for the input field labels
      },
    },

    fields: {
      // fields prefill info (optional)
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
