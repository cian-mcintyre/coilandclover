# coilandclover (This was the name of the repo when it was a e-commerce site of St Patricks day themed snake accesories)

A Mercedes website of the future. Including the following pages: 

Front end
A responsive web-based user interface using HTML, CSS, Bootstrap, JavaScript and Node.js for the frontend. The site is a Mercedes website of the future featuring futuristic car models and prototypes.

Back end: 
The site uses nodes, express and MongoDB. It is hosted on Azure. The site uses several middleware configurations for Express, including session management, flash messages, body parsing, method override, and serving static files.

Programming functions: 

MongoDB integration
Product displays in loop 
Add to cart + Remove from cart
Stock price integration
Nav bar: Login name displayed
Nav Bar: Cart counter
Nav bar: Product search
Category page filter
Contact form submission
Maps API integration
Donegal ad scraper + filters/search 
Checkout with Stripe information and order validation
User Login with validation
User registration with validation
Account edit & order view
Logout
Admin access & Add a new product
Azure app service


Page descriptions:


- Nav bar: 
The nav bar directs the user around the site with custom integrations welcoming the user when they are logged in and showing a counter for the amount of items in the cart. 


- Homepage: 
The homepage has the products from the DB inserted in a loop, so that if a new product is added it appears in list of products. It also has an add to cart feature under each of the products and a stock price API connected in the footer. Included in the UI is some product caousels, hover overlays and countdown timers. 


- Category/Shop:
The Category page shows all products available for purchase in an array. Users can filter by type and colour. Add to cart is also available here.


- Product pages 
The Product pages gives an in depth look at the cars, such as the design features, safety features, interior highlights, and exterior highlight. 


- Coming soon 
The Coming Soon page shows the user which products will be available in the future. 


- Contact
The Contact page provides information on how to contact the Mercedes store in Dublin. There is a contact form which uses node mailer to send an email to Mercedes. The contact page also used the places API to show the location of the Dublin showrooms. 


- Preowned 
A web scraper that pull in live data from DoneDeal Mercedes cars. Using data tables for filtering and search. 


- Search 
The Search page, and search feature, allows the user to search for products available on the site.


- Checkout
The checkout page is where the user reviews their order totals and enter their billing information. Total shipping and product subtotals are passed from the cart page to the checkout page where they are shown as a total. They then can pay using a Stripe integration. When the payment is successful the order is validated and created in the DB. Currently the order has an order number and tracking number which are randomly generated using shortid. In reality these would be linked to a finance/postage system. 


- Cart
The Cart page shows the list of cars that the user has added to their cart. The use can use a remove middleware to remove an item from their cart. 


- Confirmation
The Confirmation page confirms an order once it has been placed. It shows the newly created tracking number and orderID 


- Register 
The Registration page allows users to register to the site. There is validation and error reporting for the name length, email validation and password security. The password is encrypted using bcrypt. 


- Login
The User Login page allows users to log in to the site. There is email and password validation used. 


- Account edit
The Account page is only accessible to logged in users and allows the user to change their details, such as name, email, or password. It also shows any orders they have placed. 


- Logout  
The user can logout and their session is deleted. 


- Admin Login
The Admin Login page allows only admins to log in.


- Add a product
The Admin page is accessible for admins only and allows admins to add cars to the site, including uploading a photo of the product. 


Main routes: 
/account route: It displays and updates user account details.
/add-to-cart and /remove-from-cart routes: They manage products in the shopping cart.
/cart route: It displays the cart items.
/checkout route: It handles the checkout process.
/charge route: It handles the payment process using Stripe.
/validate-order route: It validates the new order data.
/confirmation route: It confirms the order.
/ route: It displays the homepage with a list of cars.
/login route: It handles user login.
/registration route: It handles user registration.
/logout route: It handles user logout.




References: 

Images generated using Midjourney

Original UI using Karma Template: https://preview.colorlib.com/#karma 

Coding support from various google sites, Stack Overflow, ChatGPT. 

SoW: 

User:
User able to Register an account
User able to log in
User being able to register and log out 
User able to place an order and receive a tracking number
User able to browse by category/colour/type
User able to search for products
User being able to log in and see their order they placed

Admin:
Admin able to add a new product (Including picture upload) 
Functionality when an order has been placed (Maybe email get's sent?) or 'Orders' page for Admin  

Other:
Map feature showing Mercedes showrooms
Preowned section showing used cars from DoneDeal, CarZone etc
Better form validation for address and mobile numbers (Address search)
GDPR consideration for customer data (User is deleted if no order is placed in X time etc) 


Learnings: 
Simpler user journeys - The log in should be at the Add to cart stage, not at order stage.
Google pay implementation 
Use Stripe endpoints for order confirmation


To do:
Create testing plan
Ordered products not showing correctly
Price gauge for filters
Send email on receipt of payment
Country search 
Mobile phone autofill 
Shipping/tracking information
Carzone scraper wouldn't work
Add orders section for Admins where they can view all placed orders





