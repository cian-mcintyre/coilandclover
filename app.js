if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


// Importing Libraies that we installed using npm
const express = require("express")
const bcrypt = require("bcrypt") 
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const secret = 'mysecretstring';
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/users');
const Admin = require('./models/admins');
const Car = require('./models/cars');
const Order = require('./models/orders');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img/product' }); 



//app.use(bodyParser.urlencoded({ extended: true }));


// MONGODB CONNECTION

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {useNewUrlParser: true}, {useUnifiedTopology:true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => next(err)); 


//PASSPORT

initializePassport(
    passport,
    email => User.find(user => user.email === email),
    id => User.find(user => user.id === id)
    )

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: secret,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}))
app.use(passport.initialize()) 
app.use(passport.session('connect.sid'))
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({ extended: true }));

// VIEW ENGINE

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

//SET PUBLIC FOLDER

app.use('/public', express.static('public'));


app.use(express.json())

/////////////// SET ROUTES /////////////////////

//user avaiable in all routes

app.use((req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(error);
        next();
      });
  } else {
    res.locals.user = null;
    next();
  }
});

//cart available in all routes

app.use((req, res, next) => {
  res.locals.cartItemCount = 0;
  next();
});


//Stock price available in all routes

app.get('/stock-price', function(req, res){
  const axios = require('axios');

  axios.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DAI.DE&apikey=' + process.env.MERCEDES_STOCK_API_KEY)
  .then(response => {
      let data = {
          price: response.data["Global Quote"]["05. price"],
          changePercent: response.data["Global Quote"]["10. change percent"]
      };
      res.send(data);
  })
  .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching stock price.');
  });
});

//ACCOUNT

app.get('/account', (req, res) => {
    if (req.session && req.session.userId) {
        User.findById(req.session.userId, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            res.render('pages/account', { user: user });
          }
        });
      } else {
        res.redirect('/login');
      }
    });

app.post('/account', async (req, res) => {
try {
    const user = await User.findById(req.session.userId);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();

    req.flash('success', 'Your details have been updated successfully.');
    res.redirect('/account');
} catch (e) {
    console.log(e);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/account');
    }
  });

//ADMIN ACCESS

app.get('/admin-login', (req, res) => {

    if (res.locals.admin) res.redirect('/');
    res.render('pages/admin-login');
    });

    app.post('/admin-login', async (req, res) => {
        const { username, password } = req.body;
        try {
          const admin = await Admin.findOne({ username: username });
          if (!admin) {
            // username not found in database
            return res.render('pages/admin-login', { errors: ['Incorrect username or password'] });
          }
          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
            // password doesn't match
            return res.render('pages/admin-login', { errors: ['Incorrect username or password'] });
          }
          req.session.adminId = admin._id;
          res.redirect('/admin');
        } catch (e) {
          console.log(e);
          res.redirect('/admin-login');
        }
      });

// ADMIN - ADD A PRODUCT
app.get('/admin',  (req, res) => {
    if (req.session && req.session.adminId) {
        Admin.findById(req.session.adminId, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            res.render('pages/admin', { user: user });
          }
        });
      } else {
        res.redirect('/admin-login');
      }
    });

    app.post("/admin", upload.single('image'), function(req, res){
      let newCar = new Car({
          productName: req.body.productName,
          category: req.body.category,
          colour: req.body.colour,
          Quantity: req.body.Quantity,
          Price: req.body.Price,
          image: req.file ? req.file.filename : ''
      });
      
      newCar.save();
      res.redirect('/');
  });

// CART ITEM COUNTER



app.use((req, res, next) => {
  const cart = req.session.cart;
  let cartItemCount = 0;
  if (cart) {
    for (const productId of Object.keys(cart)) {
      cartItemCount += cart[productId];
    }
  }
  res.locals.cartItemCount = req.session.cart ? Object.keys(req.session.cart).length : 0;
  next();
});

// ADD TO CART
app.post('/add-to-cart', (req, res) => {
  const productId = req.body.productId;
  if (!req.session.cart) {
    req.session.cart = {};
  }
  if (!req.session.cart[productId]) {
    req.session.cart[productId] = 1;
  } else {
    req.session.cart[productId]++;
  }
  res.redirect('/');
});

app.post('/remove-from-cart', (req, res) => {
  const productId = req.body.productId;
  if (req.session.cart && req.session.cart[productId]) {
    req.session.cart[productId]--;
    if (req.session.cart[productId] === 0) {
      delete req.session.cart[productId];
    }
  }
  res.sendStatus(200);
});


/// CART

app.get('/cart', async (req, res) => {
  const cartItems = [];
  const productIds = req.session.cart ? Object.keys(req.session.cart) : [];
  for (const productId of productIds) {
    const product = await Car.findById(productId);
    const quantity = req.session.cart[productId];
    cartItems.push({ product, quantity });
  }
  res.render('pages/cart', { cartItems });
});

router.post('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart; // Store the cart in session variable
    res.redirect('/');
  });
});



// CATEGORY

app.get('/category', (req, res) => {
    Car.find({},function(err, cars){
        res.render('pages/category', {
            carsList: cars
        })
    })
   });




   
// Route to handle filtering requests
router.get('/cars', async (req, res) => {
  const category = req.query.category; // Get the selected category from the query parameter
  const cars = await Car.find({ category: category }); // Get the cars that match the selected category
  res.json(cars); // Send the filtered cars as a JSON response
});
   
module.exports = router;

// CHECKOUT


app.get('/checkout', (req, res) => {


  // Calculate total
  let cartItems = req.session.cart || [];
  const shippingCost = req.query.shipping;
  const subtotal = req.query.subtotal;
  const total = parseFloat(shippingCost) + parseFloat(subtotal);

  // Render checkout page with all necessary variables
  res.render('pages/checkout', { cartItems, subtotal, shippingCost, total });
});

const shortid = require('shortid');

app.post('/charge', function(req, res) {
  var total = req.body.total; // retrieve total value from form data
  stripe.charges.create({
    amount: total,
    currency: 'eur',
    source: req.body.stripeToken,
    description: 'Mercedes Sale'
  }, function(err, charge) {
    if (err) {
      console.error('Stripe charge creation failed:', err);
      res.status(500).send('An error occurred while processing the payment');
    } else {
      // Payment successful, now we can create the order.
      let newOrder = new Order({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        number: req.body.number,
        email: req.body.email,
        add1: req.body.add1,
        add2: req.body.add2,
        city: req.body.city,
        zip: req.body.zip,
        createAccount: req.body.selector === "on",
        message: req.body.message,
        orderNumber: shortid.generate(),
        trackingNumber: shortid.generate(),
        total: req.body.total,
        subtotal: req.body.subtotal,
        shippingCost: req.body.shippingCost,
        products: []
      });
      
      if (req.body.cartItem) {
        req.body.cartItem.forEach(function(item) {
          let parts = item.split('|');
          newOrder.products.push({
            name: parts[0],
            price: parts[1],
            quantity: parts[2] // Adjust this according to your logic.
          });
        });
      }
      
      // Save the order
      newOrder.save((err, savedOrder) => {
        if (err) {
          console.error('Order creation failed:', err);
          res.status(500).send('Error saving order');
        } else {
          req.session.order = savedOrder; // Save order to session
          res.redirect('/confirmation');
        }
    });
    }
  });
});




  



// COMING SOON

app.get('/coming-soon', (req, res) => {
        res.render('pages/coming-soon');
        });

// CONFIRMATION

app.get('/confirmation', function(req, res) {
  if (req.session.order) {
    res.render('pages/confirmation', { order: req.session.order });
    delete req.session.order; // Clear the order from the session
  } else {
    res.redirect('/checkout'); // No order to confirm, redirect to checkout
  }
});



// CONTACT

app.get('/contact', function(req, res)  {
    res.render('pages/contact');
    });

// Define route to handle form submission
app.post('/submit-form', (req, res) => {
  // Get form data
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', 
    port: 587, 
    secure: false, 
    auth: {
      user: 'web@mercedes.ie',
      pass: '123456',
    },
  });

  // Compose email message
  const mailOptions = {
    from: 'Mercedes website <web@mercedes.ie>',
    to: 'info@mercedes.test',
    subject: 'New message from ' + name + ': ' + subject,
    text: 'From: ' + name + '\nEmail: ' + email + '\n\n' + message,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred while sending the message');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Message sent successfully');
    }
  });
});


 // HOME

app.get('/', (req,res) =>{
    Car.find({},function(err, cars){
        res.render('pages/index', {
            carsList: cars
        })
    })
})

// LOGIN

app.get('/login', (req, res) => {

    if (res.locals.user) res.redirect('/');
    res.render('pages/login');
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            // email not found in database
            return res.render('pages/login', { errors: ['Incorrect email or password'] });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            // password doesn't match
            return res.render('pages/login', { errors: ['Incorrect email or password'] });
          }
          req.session.userId = user._id;
          req.session.firstName = user.firstName;
          res.redirect('/account');
        } catch (e) {
          console.log(e);
          res.redirect('/login');
        }
      });



// PREOWNED

app.get('/preowned', (req, res) => {
  res.render('pages/preowned');
  });


  
  


// REGISTER

app.get('/registration', (req, res) => {
    res.render('pages/registration');
    });

app.post("/registration", async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let users = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword  
        });
    
    users.validate(function(error) {
        if (error) {
            const errors = Object.values(error.errors).map((err) => err.message);
            res.render('pages/registration', { errors });
        } else {
    users.save();
    res.redirect("/login")
        }
    });
            
    } catch (e) {
        console.log(e);
        res.redirect("/registration")
    }
})





// SEARCH

app.get('/search', (req, res) => {
    const query = req.query.q;
  
    if (!query) {
      res.render('pages/search', { results: [] });
      return;
    }
  
    const regex = new RegExp(escapeRegex(query), 'gi');
  
    Car.find({ productName: regex }, (err, searchResults) => {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        res.render('pages/search', { results: searchResults });
      }
    });
  });
  
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

// PRODUCT PAGES

app.get('/single-product-eqa', (req, res) => {
    res.render('pages/single-product-eqa');
    });

app.get('/single-product-eqe', (req, res) => {
    res.render('pages/single-product-eqe');
    });

app.get('/single-product-sl', (req, res) => {
    res.render('pages/single-product-sl');
    });


app.get('/single-product-cla', (req, res) => {
    res.render('pages/single-product-cla');
    });


       //logout 
  app.get('/logout', function (req, res) {
    res.clearCookie('connect.sid');
    res.redirect('/');
    });

    //END ROUTES

 
// ERROR HANDLING

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

    
    

// INIT SERVER

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));


