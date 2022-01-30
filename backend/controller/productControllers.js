const Product = require("../models/Product");
const stripe = require("stripe")("sk_test_51KNXCBIIQnKtwtkJfcKhn0J8UsNrNg8ufX1feQ2TG1Q0EnlN0Jz8dAgPpForjGfh1qjYb8TjV9fvdQ9C4lQ8kfbr00ua43dQrp");
const { uuid } = require('uuidv4');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const checkoutWithCard = async (req, res) => {
	console.log("Request:", req.body);
  
	let error;
	let status;
	try {
	  const { product, token } = req.body;
  
	  const customer = await stripe.customers.create({
		email: token.email,
		source: token.id
	  });
  
	  const idempotency_key = uuid();
	  const charge = await stripe.charges.create(
		{
		  amount: product.price * 100,
		  currency: "usd",
		  customer: customer.id,
		  receipt_email: token.email,
		  description: `Purchased the books`,
		  shipping: {
			name: token.card.name,
			address: {
			  line1: token.card.address_line1,
			  line2: token.card.address_line2,
			  city: token.card.address_city,
			  country: token.card.address_country,
			  postal_code: token.card.address_zip
			}
		  }
		},
		{
		  idempotency_key
		}
	  );
	  console.log("Charge:", { charge });
	  status = "success";
	} catch (error) {
	  console.error("Error:", error);
	  status = "failure";
	}
  
	res.json({ error, status });
  };

module.exports = {
  getProducts,
  getProductById,
  checkoutWithCard,
};
