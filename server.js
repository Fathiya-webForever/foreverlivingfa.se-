const express = require('express');
const stripe = require('stripe')('your-secret-key-here'); // Replace with your Stripe secret key
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

app.post('/create-checkout-session', async (req, res) => {
    const { customerName, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'sek',
                product_data: {
                    name: 'Money Purchase',
                    description: `Purchase of ${amount} SEK`,
                },
                unit_amount: amount * 100, // Amount in cents
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://your-domain.com/success',
        cancel_url: 'https://your-domain.com/cancel',
    });

    res.json({ id: session.id });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'buy-money.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));