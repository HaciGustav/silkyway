const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const config = smtpTransport({
  service: "gmail",
  port: 587,
  secureConnection: true,
  auth: {
    user: "silkyway.enterprise@gmail.com",
    pass: "mjcl afri veba mqgk",
    // pass: process.env.GMAIL_APP_PASS,
  },
});

const transporter = nodemailer.createTransport(config);

const createPurchaseMail = (user, product) => {
  const mail = {
    from: "silkyway.enterprise@gmail.com", // sender address
    to: [user.email],
    subject: product.name,
    text: "Moustache Product ID: 123456",
    html: `
            <!DOCTYPE html>
                <html>
                <head>
                    <title>Thank You for Your Purchase!</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        border-bottom: 1px solid #eeeeee;
                    }
                    .header img {
                        max-width: 100px;
                        border-radius: 50%;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content h1 {
                        color: #333333;
                    }
                    .content p {
                        color: #666666;
                    }
                    .product {
                        display: flex;
                        padding: 10px 0;
                        border-bottom: 1px solid #eeeeee;
                    }
                    .product img {
                        max-width: 100px;
                        margin-right: 20px;
                    }
                    .product-details {
                        flex: 1;
                    }
                    .product-details h3 {
                        margin: 0;
                        color: #333333;
                    }
                    .product-details p {
                        margin: 5px 0;
                        color: #666666;
                    }
                    a{
                        color:#fff;
                        text-decoration:none;
                    }
                    .cta-button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        background-color: #28a745;
                        color: #ffffff;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                      }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        color: #999999;
                        font-size: 12px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <img src="https://github.com/HaciGustav/silkyway/blob/main/public/pics/logo.jpg?raw=true" alt="Company Logo" />
                    </div>
                    <div class="content">
                        <h1>Thank You for Your Purchase, ${user.name}!</h1>
                        <p>
                        We are pleased to confirm your order. Below are the details of your
                        purchase:
                        </p>

                        <div class="product">
                        <img src="https://www.realmenrealstyle.com/wp-content/uploads/2023/07/Moustache-Types-For-Men-Grooming-Style-and-Celebrity-Icons.jpg" alt="Product Image?raw=true" />
                        <div class="product-details">
                            <h3>${product.name}</h3>
                            <p>Quantity: ${product.quantity}</p>
                            <p>Price: ${product.price * product.quantity}$</p>
                        </div>
                        </div>
                        <a href="https://silkyway.vercel.app" target="_blank" class="cta-button">Go to Shop</a>

                        <!-- Repeat the product section as needed for additional products -->

                        <p>
                        If you have any questions or need further assistance, please do not
                        hesitate to contact our customer support.
                        </p>
                        <p>Best regards,<br />The Silkyway Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Silkyway. All rights reserved.</p>
                        <p>Middle of Nowhere</p>
                    </div>
                    </div>
                </body>
                </html>

            
            `, // html body
  };

  return mail;
};

const sendPurchaseMail = async () => {
  const prod = { name: "Beautiful Moustache", price: 15, quantity: 10 };
  const user = { name: "John Doe", email: "gustavelebon1941@gmail.com" };

  const mail = createPurchaseMail(user, prod);
  transporter
    .sendMail(mail)
    .then((info) => console.log("MAIL_INFO =====>", info))
    .catch((err) => console.log(err));
};

module.exports = { sendPurchaseMail };
