//Checks if site is not in production, loads .env file

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


// Importing Libraies installed using npm
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
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img/product' }); 
const shortid = require('shortid');
const axios = require('axios');
const cheerio = require('cheerio')
const excel = require('exceljs');



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

app.use((req, res, next) => {
  res.locals.error_messages = req.flash('error_messages');
  next();
});

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




//cart available in all routes

app.use((req, res, next) => {
  res.locals.cartItemCount = 0;
  next();
});

//user avaiable in all routes

app.use((req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        res.locals.user = user; // Add user to res.locals
        next();
      })
      .catch(error => {
        console.log(error);
        next();
      });
  } else {
    res.locals.user = null; // Set user to null in res.locals
    next();
  }
});


//Stock price available in all routes

app.get('/stock-price', function(req, res){
  axios.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MBG.DE&apikey=' + process.env.MERCEDES_STOCK_API_KEY)
  .then(response => {
      if(response.data["Global Quote"]) {
          let data = {
              price: response.data["Global Quote"]["05. price"],
              changePercent: response.data["Global Quote"]["10. change percent"]
          };
          res.send(data);
      } else {
          throw new Error('Global Quote not present in API response');
      }
  })
  .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching stock price.');
  });
});

//ACCOUNT

app.get('/account', (req, res) => {
  if (req.session && req.session.userId) { // Check if user is logged in with database ID 
      User.findById(req.session.userId)
          .populate('orders')
          .exec((err, user) => {
              if (err) {
                  console.log(err);
                  res.redirect('/login'); //If error, redirect to login page
              } else {
                const userLoggedInMessage = 'You have been logged in';  
                res.render('pages/account', { user: user, orders: user.orders, message: userLoggedInMessage }); // login and pass user and orders as variables
                  
              }
          });
  } else {
      res.redirect('/login');
  }
});

app.post('/account', async (req, res) => {
  try {
      const user = await User.findById(req.session.userId); //find user ID & update user details
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;

      if (req.body.password) { //hash new password
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
          const admin = await Admin.findOne({ username: username }); //checks for admin logged in
          if (!admin) {
            return res.render('pages/admin-login', { errors: ['Incorrect username or password'] });
          }
          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
            return res.render('pages/admin-login', { errors: ['Incorrect username or password'] });
          }
          req.session.adminId = admin._id; // if correct creds, login 
          res.redirect('/admin');
        } catch (e) {
          console.log(e);
          res.redirect('/admin-login');
        }
      });

// ADMIN - ADD A PRODUCT & VIEW ORDERS

app.get('/admin', (req, res) => {
  if (req.session && req.session.adminId) {
    Admin.findById(req.session.adminId, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        Order.find({}, (err, orders) => {
          if (err) {
            console.log(err);
            res.redirect('/');
          } else {
            Car.find({}, (err, cars) => {
              if (err) {
                console.log(err);
                res.redirect('/');
              } else {
                res.render('pages/admin', { user: user, orders: orders, cars: cars });
              }
            });
          }
        });
      }
    });
  } else {
    res.redirect('/admin-login');
  }
});


app.get('/admin/download-orders', (req, res) => {
  if (req.session && req.session.adminId) {
    Admin.findById(req.session.adminId, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect('/admin');
      } else {
        Order.find({}, (err, orders) => {
          if (err) {
            console.log(err);
            res.redirect('/admin');
          } else {
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('Orders');

            worksheet.columns = [
              { header: 'Order Number', key: 'orderNumber', width: 15 },
              { header: 'First Name', key: 'firstName', width: 15 },
              { header: 'Last Name', key: 'lastName', width: 15 },
              { header: 'Email', key: 'email', width: 20 },
              { header: 'Eircode', key: 'zip', width: 10 },
              { header: 'Total Price', key: 'total', width: 15 },
              { header: 'Tracking Number', key: 'trackingNumber', width: 15 },
              { header: 'Products', key: 'products', width: 30 },
            ];

            orders.forEach((order) => {
              const products = order.cartItems.map((item) => item.name).join(', ');
              worksheet.addRow({
                orderNumber: order.orderNumber,
                firstName: order.firstName,
                lastName: order.lastName,
                email: order.email,
                zip: order.zip,
                total: order.total,
                trackingNumber: order.trackingNumber,
                products: products,
              });
            });

            res.setHeader(
              'Content-Type',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
              'Content-Disposition',
              'attachment; filename=order-list.xlsx'
            );

            workbook.xlsx.write(res)
              .then(() => {
                res.end();
              })
              .catch((err) => {
                console.log(err);
                res.redirect('/admin');
              });
          }
        });
      }
    });
  } else {
    res.redirect('/admin-login');
  }
});

app.post('/admin', upload.single('image'), (req, res) => {
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


app.post('/admin/delete-product', (req, res) => {
  if (req.session && req.session.adminId) {
    const productId = req.body._id;

    Car.deleteOne({ _id: productId }, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/admin');
      }
    });
  } else {
    res.redirect('/admin-login');
  }
});


// CART ITEM COUNTER



app.use((req, res, next) => {
  const cart = req.session.cart; //retrieve cart from session 
  let cartItemCount = 0; //variable to keep track of total
  if (cart) {
    for (const productId of Object.keys(cart)) { //iterate number of items in cart
      cartItemCount += cart[productId];
    }
  }
  res.locals.cartItemCount = req.session.cart ? Object.keys(req.session.cart).length : 0; //assign total value and make it accessible to all views
  next();
});




// CATEGORY

app.get('/category', (req, res) => {
    Car.find({},function(err, cars){ //retieve all products from the DB
        res.render('pages/category', {
            carsList: cars //object to hold car array 
        })
    })
   });
   
// Route to handle filtering requests
router.get('/cars', async (req, res) => {
  const category = req.query.category; // Get the selected category from the query parameter
  const cars = await Car.find({ category: category }); // Get the cars that match the selected category
  res.json(cars); // Send the filtered cars as a JSON response
});
   




/// CART

app.get('/cart', async (req, res) => {
  const user = User.findById(req.session.userId)
  const cartItems = []; //create empty cart
  const productIds = req.session.cart ? Object.keys(req.session.cart) : [];
  for (const productId of productIds) { //retieve items from cart
    const product = await Car.findById(productId); //fetch details from DB
    const quantity = req.session.cart[productId]; //fetch quantity
    cartItems.push({ product, quantity });
  }
  res.render('pages/cart', { cartItems, user });

});

app.post('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id; //retrieve product IDs from URL

  Car.findById(productId, function(err, product) { //fetch details from DB
    if (err) {
      return res.redirect('/');
    }

    if (!req.session.cart) { // Initialize cart in session if it doesn't exist
      req.session.cart = [];
    }

    // Check if product already exists in cart
    const existingProductIndex = req.session.cart.findIndex(p => p.id === product.id);

    if (existingProductIndex > -1) {
      // Increment quantity of the existing product
      req.session.cart[existingProductIndex].quantity++;
    } else {
      // Add product to the cart with quantity 1
      req.session.cart.push({
        id: product.id,
        name: product.productName,
        quantity: 1
      });
    }
    
    res.redirect('/');
  });
});




// ADD TO CART / REMOVE FROM CART 

app.post('/add-to-cart', (req, res) => {
  const productId = req.body.productId;
  if (!req.session.cart) { //check if user has a cart
    req.session.cart = {};
  }
  if (!req.session.cart[productId]) { //check if product is already in cart
    req.session.cart[productId] = 1; //if not make cart 1
  } else {
    req.session.cart[productId]++; //if there is already an item in the cart, add the new one
  }
  req.flash('message', 'Added to cart');
  res.redirect('/');
});

app.post('/remove-from-cart', (req, res) => {
  const productId = req.body.productId;
  if (req.session.cart && req.session.cart[productId]) { //check if cart exists
    req.session.cart[productId]--;
    if (req.session.cart[productId] === 0) { //empty cart
      delete req.session.cart[productId];
    }
  }
  res.sendStatus(200);
});


// CHECKOUT

app.post('/checkout', (req, res) => {
  
  let itemNames = req.body['cartItems[][name]']; // Extract cart item related fields from the body
  let itemPrices = req.body['cartItems[][price]'];
  let itemQuantities = req.body['cartItems[][quantity]'];
  const firstName = req.session.firstName;
  const lastName = req.session.lastName;
  const email = req.session.email;

  
  if (!Array.isArray(itemNames)) { // check if its an array (single product issue)
    itemNames = [itemNames];
    itemPrices = [itemPrices];
    itemQuantities = [itemQuantities];
  }

  
  const cartItems = itemNames.map((name, i) => ({ //create an array
    name: name,
    price: itemPrices[i],
    quantity: itemQuantities[i],
  }));

  const shippingCost = req.body.shipping;
  const subtotal = req.body.subtotal;
  const total = parseFloat(shippingCost) + parseFloat(subtotal);

  res.render('pages/checkout', { subtotal, shippingCost, total, cartItems, cartItemCount: cartItems.length, firstName, lastName, email });
});


app.post('/charge', function(req, res) {
  console.log('Starting /charge route...'); // Add initial logging statement
  
  var total = req.body.total;
  console.log('Total:', total); // Log total

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
      console.log('Stripe charge created successfully.'); // Log successful charge

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
        orderNumber: shortid.generate(), //randomly generate order and tracking number
        trackingNumber: shortid.generate(),
        total: req.body.total,
        subtotal: req.body.subtotal,
        shippingCost: req.body.shippingCost,
        userId: req.session.userId,
        cartItems: [] // Initialize products array
      });
      console.log('New order created:', newOrder); // Log new order

      let cartItems = req.body['cartItems[]'];
      if (!Array.isArray(cartItems)) {
      cartItems = [cartItems];
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mercedesfuturestore@gmail.com',
          pass: process.env.GMAIL_PASSWORD
        }
      });
      function sendOrderConfirmationEmail(userEmail, order) {
        const mailOptions = {
          from: 'mercedesfuturestore@gmail.com',
          to: userEmail,
          subject: 'Order Confirmation',
          html: `
            <h1>Thank you for your order!</h1>
            <p>Your order details:</p>
            <ul>
              <li>Order Number: ${order.orderNumber}</li>
              <li>First Name: ${order.firstName}</li>
              <li>Last Name: ${order.lastName}</li>
              <li>Email: ${order.email}</li>
              <li>Total: ${order.total}</li>
              <li>Email: ${order.trackingNumber}</li>
            </ul>
            <p>Welcome to the future.</p>
          `
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
      
cartItems.forEach((name) => {
  newOrder.cartItems.push({ name });

});

      console.log('Products added to order:', newOrder.cartItems); // Log products

      newOrder.validate(function(error) {
        if (error) {
          console.error('Order validation failed:', error); // Log validation error
          const errors = Object.values(error.errors).map((err) => err.message);
          req.flash('error_messages', errors);
          res.redirect('/checkout'); 
        } else {
          console.log('Order validation successful.'); // Log successful validation

          User.findByIdAndUpdate(req.session.userId, { $push: { orders: newOrder._id } }, function(err, user) {
            if (err) {
              console.error('Error updating user orders:', err);
              res.status(500).send('Error updating user orders');
            } else {
              console.log('User orders updated successfully.'); // Log successful user update

              newOrder.save((err, savedOrder) => {
                if (err) {
                  console.error('Order creation failed:', err);
                  res.status(500).send('Error saving order');
                } else {
                  console.log('Order saved successfully:', savedOrder); // Log successful order save
                  req.session.order = savedOrder;
                  sendOrderConfirmationEmail(req.body.email, savedOrder);
                  res.redirect('/confirmation');
                }
              });
            }
          });
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
    res.redirect('/checkout'); 
  }
});



// CONTACT

app.get('/contact', function(req, res)  {
    res.render('pages/contact');
    });


app.post('/submit-form', (req, res) => { // Define route to handle form submission
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
            carsList: cars,
            message: req.flash('message')
        })
    })
})

// LOGIN

app.get('/login', (req, res) => {

    if (res.locals.user) res.redirect('/'); //checks for log in details
    res.render('pages/login');
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
          const user = await User.findOne({ email: email }); //Check DB for email
          if (!user) {
            return res.render('pages/login', { errors: ['Incorrect email or password'] });
          }
          const isMatch = await bcrypt.compare(password, user.password); //Check DB for password
          if (!isMatch) {
            return res.render('pages/login', { errors: ['Incorrect email or password'] });
          }
          req.session.userId = user._id;
          req.session.firstName = user.firstName; //pass first name so it can be displayed in the nav bar 
          req.session.lastName = user.lastName;
          req.session.email = user.email;
          res.redirect('/account');
        } catch (e) {
          console.log(e);
          res.redirect('/login');
        }
      });

  
// PREOWNED

// Donedeal



app.get('/preowned', async (req, res) => { //Send Get Req to Donedeal
  const url = 'https://www.donedeal.ie/cars/Mercedes-Benz';

  const { data } = await axios.get(url);
  const $ = cheerio.load(data); //Use cheerio for parsing and querying 

  const cars = []; //create empty array
  $('li.Listings__Desktop-sc-1igquny-3').each((i, elem) => { //top level class to pull HTML 

    const title = $(elem).find('.Card__Body-sc-1v41pi0-8 .Card__Title-sc-1v41pi0-4').text().trim();
    const price = $(elem).find('.Card__InfoText-sc-1v41pi0-13').text().trim().replace(/(€)/g, function (match, p1, offset) { //take price and break up full price and ppm
      return offset > 0 ? " / " + p1 : p1;
    });
    const details = $(elem).find('.Card__KeyInfoList-sc-1v41pi0-6 li'); //Split the details as there was no specific class for each
    const year = $(details).eq(0).text().trim();
    const fuelType = $(details).eq(1).text().trim();
    const mileage = $(details).eq(2).text().trim();
    const timePosted = $(details).eq(3).text().trim();
    const location = $(details).eq(4).text().trim();
    const link = $(elem).find('a.Link__SLinkButton-sc-9jmsfg-0').attr('href'); //get link to page


    cars.push({ title, price, year, fuelType, mileage, timePosted, location, link });

  });

  res.render('pages/preowned', { cars: cars });
});

//Carzone

app.get('/preownedcarzone', async (req, res) => {
  const carzoneUrl = 'https://www.carzone.ie/used-cars/mercedes-benz';

  const carzoneData = await axios.get(carzoneUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }
  });
  const $carzone = cheerio.load(carzoneData.data);

  const carzoneCars = [];
  $carzone('stock-summary-item_ngcontent-cz-web-c137').each((i, elem) => {

    const title = _$(elem).find('h3.t-plum').text().trim();
    const price = _$(elem).find('.cz-price span.ng-star-inserted span').text().trim();
    const details = _$(elem).find('.stock-summary_features_details strong').text().trim().split("•");
    const year = details[0].trim();
    const mileage = details[1].trim();
    const fuelType = details[2].trim();
    const link = _$(elem).find('a.no-decoration').attr('href');

    // Note that not all information is available in the Carzone listings
    carzoneCars.push({ title, price, year, fuelType, mileage, link, source: 'Carzone' });
  });

  res.render('pages/preownedcarzone', { carzoneCars: carzoneCars });
});


// REGISTER

app.get('/registration', (req, res) => {
    res.render('pages/registration');
    });

app.post("/registration", async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) // hash pw using bcrypt
        let users = new User({ //create new user 
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword  
        });
    
    users.validate(function(error) { // validate entries (rules in schema)
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
    const query = req.query.q; // Extract search query
  
    if (!query) {
      res.render('pages/search', { results: [] });
      return;
    }
  
    const regex = new RegExp(escapeRegex(query), 'gi'); //get rid of special character 
  
    Car.find({ productName: regex }, (err, searchResults) => { // search product names
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

module.exports = router;


