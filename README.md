Learnings: 
Simpler user journeys - The log in should be at the Add to cart stage, not at order stage.
Google pay implementation 
Use Stripe endpoints for order confirmation


To do:
Ordered products not showing correctly
Price gauge for filters
Send email on receipt of payment
Country search 
Mobile phone autofill 
Shipping/tracking information
Carzone scraper wouldn't work
Add orders section for Admins where they can view all placed orders
Update Stripe






Brief:

Create an Information System for a selected domain of interest. 

You may use any back-end, including a DB developed in another module. 

You may use any front-end, including CLI, GUI, web and API, however API/web is strongly recommended

Describe the requirements of the information system, including users, data requirements, search, sorting, entry, update, validation, integrity, reporting etc.

Implement and test the Information System, and document your implementation thoroughly. Documentation should be developed in the same repository, in a text based format (NOT MS Word) such as README.md or .tex or .html

    GitHub/GitLab MUST be used for this project to develop both the artefact and documentation, and any code or material uploaded as a fait accompli will not be credited. Furthermore, any such code not attributed or presented contrary to its originating licence will be the subject of Academic Impropriety investigations
    Git will also be used to verify engagement and contribution, and failure to engage will result in a zero grade.
    You must attribute all code not written from scratch, either in accordance with its licence, if applicable, or if not, #taken from ...  failure to do so will result in a zero grade. A summary of code attributions must be included at the end of the documentation


You may use any programming language, however example programs will be presented in Python, with some front-end JS

There will be a presentation at the end of the Semester, with the Moderator present or sent recordings, in order to assist in grading the work


======================================================================


============REQUIREMENTS=================

Site requirements: 
Build an e-commerce site for a Mercedes showroom of the future. 


User requirements:
- User able to Register an account
- User able to log in
- User able to place an order and receive a tracking number
- User able to browse by category/colour/type
- User able to search for products
- User being able to log in and see their order they placed

Admin:
- Admin able to add a new product (Including picture upload) 
- Admin able to see all products placed on site
- Admin able to filter orders and export as an excel

Other:
- Map feature showing Mercedes showrooms
- Preowned section showing used cars from DoneDeal, CarZone etc
- Frontend and backend for validation for all forms
- Popup notifications for logging in, out, adding items to cart
- Site should be live on Azure/AWS/Google Cloud 



======================================================================


============SITE DESCRIPTION=================


# coilandclover (This was the name of the repo when it was a e-commerce site of St Patricks day themed snake accessories)


Site Title: A Mercedes webstore of the future.

========= Front end =========
A responsive web-based user interface using HTML, CSS, Bootstrap and JavaScript. The site is a Mercedes website of the future featuring futuristic car models and prototypes.

===========================

========= Back end =========
The site uses nodes, express and MongoDB. It is hosted on Azure. The site uses several middleware configurations for Express, including session management, flash messages, body parsing, method override, and serving static files.

The different schemas in the backend are:

Admin Credentials (username, password) 

Products (Unique ID, Name, image, category, colour, quantity in stock, Price, Page link)

Orders (Order Number, first name, last name, phone, email, address, shipping notes, products array, tracking number, Unique user ID)

Users (First name, last name, email, password)

===========================


The site includes the following pages: 


/////////// Homepage ///////////
The homepage is where users can see upcoming cars, new models, site information and all of the products. It also has an add to cart feature under each of the products and a stock price API connected in the footer. Included in the UI is some product carousels, hover overlays and countdown timers. 

Programming Functions: 
=========
The products are display in a loop from the MongoDB database using EJS

Each product has an 'Add to cart' button. When a user presses the button the program checks if the user already has a cart and if not it creates one using req.session.cart. If they already have a cart it adds to it. 
=========

=========
Stock price integration
The Stock price integration is available in all routes. We are using the Alphantage API to retrieve the Mercedes stock price using Axios and display it in the footer of every page. 
=========

/////////////////////////////////





/////////// Nav bar ///////////
The nav bar directs the user around the site with custom integrations welcoming the user when they are logged in and showing a counter for the amount of items in the cart. 

Programming functions:
=========
Nav bar: Login name displayed
When a user is logged in, their name is displayed in the nav bar of each page
=========

=========
Nav bar: Cart counter
The cart counter in the nav bar shows how many items are currently in the cart. The program retrieves the cart from the session and counts the number of items currently in the cart. It then assigns a total value that is available in all routes. 
=========

=========
Nav bar: Product search
The search bar allows the user to search for products on the site. The program extracts the search query, removes any special characters and then search the database for products with that name. 
=========

/////////////////////////////////




/////////// Category/Shop ///////////
The Category page shows all products available for purchase in an array. 

Programming Functions:
=========
Category page filter
The category page filter allows the user to filter the products in the database by colour and car type. 
=========

/////////////////////////////////




/////////// Product pages ///////////
The Product pages gives an in depth look at the cars, such as the design features, safety features, interior highlights, and exterior highlight. 

/////////////////////////////////




========= Coming soon =========
The Coming Soon page shows the user which products will be available in the future. 

===========================




/////////// Contact ///////////
The Contact page provides information on how to contact the Mercedes store in Dublin alongside a map.

Programming Functions:
=========
Contact form submission
Users can submit a contact form which sends their name, email, subject and message to an email address using Nodemailer
=========

=========
Maps API integration
The Google Map shows the location of each of the official Mercedes garages in Dublin using the Maps API. 
=========

/////////////////////////////////




/////////// Preowned ///////////
A web scraper that pull in live data from DoneDeal Mercedes cars. 

Programming Functions:
=========
Donedeal ad scraper + filters/search 
The Preowned section scrapes DoneDeal for recent Mercedes ads and displays them in a table. Cheerio middleware is used for parsing and querying the data which is then trimmed to only display the content required. DataTables is used to filter and search the table. 
=========

/////////////////////////////////




/////////// Checkout ///////////
The checkout page is where the user reviews their order totals and enter their billing information. 

Programming Functions:
=========
Total shipping and product subtotals are passed from the cart page to the checkout page where they are shown as a total. They then can pay using a Stripe integration. When the payment is successful the order is validated and created in the DB. Currently the order has an order number and tracking number which are randomly generated using shortid. In reality these would be linked to a finance/postage system. 

There is server side and front end live validation on the billing detail fields. 
=========

/////////////////////////////////





/////////// Cart ///////////
The Cart page shows the list of cars that the user has added to their cart. 

Programming Functions: 
=========
The productID and quantity is retrieved from the session data, the other details are fetched from the database. 

The user can us the remove middleware to remove an item from their cart. 
=========
/////////////////////////////////





/////////// Confirmation ///////////
The Confirmation page confirms an order once it has been placed. 

Programming Functions: 
=========
The tracking number and order number are passed to the order page and inserted. 
=========

/////////////////////////////////





/////////// Register ///////////
The Registration page allows users to register to the site so they can place an order. 

Programming Functions:
=========
The validation in the submission is as follows: 
First name: Must be 3 characters minimum
Last name: Must be 3 character minimum 
Email: Must be a valid email
Password: Must be 6 characters long

The password is then hashed using BCRYPT. 

There is front end and server side validation implemented so the user is also informed if they have entered incorrect details.
=========

/////////////////////////////////





/////////// Login ///////////
The User Login page allows users to log in to the site. There is email and password validation used. 

Programming Functions:
=========
User Login with validation
The user login program allows the user to access their account information. The program checks the entered queries and then searches for a match for those credentials in the database. The first name is passed to the session so it can be displayed in the nav bar. 

There is front end and server side validation implemented so the user is also informed if they have entered incorrect details.
=========

/////////////////////////////////





/////////// Account ///////////
The Account page is only accessible to logged in users and allows the user to change their details, such as name, email, or password. It also shows any orders they have placed. 

Programming Functions:
=========
Account edit & order view
The user can enter their updated details and save them to the database. The new password is hashed. 

=========

/////////////////////////////////





/////////// Logout ///////////
The user can logout and their session is deleted. 

Programming Functions: 
=========
A logout message is displayed on logout
=========

/////////////////////////////////





/////////// Admin Login ///////////
The Admin Login page allows only admins to log in. This is where the admin can see a list of all orders and add a new product to the database. 

Programming Functions:
=========
Admin access & Add a new product
The admin login checks the admin credentials against the database. If correct, they are redirected to the Add A Product page. 
The Add a product page checks that the Admin is logged in so the page cannot be accessed through the URL. The page also find all orders in the database and adds them to the page in a table. 
The admin can add a new product by entering: 
Car name
Category
Colour
Quantity
Price 
Image (The image is uploaded using the upload.single image middleware)


The admin can also see all orders, filter them and download them to a spreadsheet using the exceljs middleware
=========


/////////////////////////////////

======================================================================


============REFERENCES=================

Site images: All images are generated using Midjourney with custom prompts. 

Original UI using Karma Template: https://preview.colorlib.com/#karma 

All backend code was written by me with the support of google sites, Stack Overflow, ChatGPT and countless YouTube tutorials. This tutorial was particularly a big help: 
Programming with Mosh: https://www.youtube.com/watch?v=pKd0Rpw7O48&t=48s&ab_channel=ProgrammingwithMosh 

======================================================================





============TESTING PLAN=================

User Registration and Login:

Test user registration process:
- Verify that a user can successfully register with valid information.
- Verify that appropriate error messages are displayed for invalid or missing information.
- Verify that user credentials are correctly stored in the database.

Test user login process:
- Verify that a registered user can successfully log in with correct credentials.
- Verify that appropriate error messages are displayed for incorrect credentials or missing information.
- Verify that the user session is maintained throughout the website.


//////////////////////

Product Browsing and Search:

Test product listing:
- Verify that all products are properly displayed on the website.
- Verify that each product displays correct information such as name, price, and image.

Test product search functionality:
- Verify that the search bar returns relevant products based on keywords.
- Verify that the search results display accurate product information.

//////////////////////

Shopping Cart and Checkout:

Test adding products to the shopping cart:
- Verify that a user can add products to the cart and view the updated cart.
- Verify that the correct quantity and price are reflected in the cart.

Test updating and removing cart items:
- Verify that a user can remove items from the cart.

Test the checkout process:
- Verify that the user is redirected to the checkout page with the correct order summary.
- Verify that the user can enter their shipping and billing information.
- Verify that the user can proceed to payment and complete the transaction.
- Verify that the order is saved in the database with accurate details.

//////////////////////

User Account Management:

Test user profile page:
- Verify that the user can view and update their profile information.
- Verify that the updated information is correctly reflected in the database.

Test order history:
- Verify that the user can view their order history.
- Verify that each order displays accurate information.
- Verify that the user can see their order details in their account.

//////////////////////

Security and Error Handling:

Test input validation and error handling:
- Verify that appropriate error messages are displayed for invalid input.
- Verify that sensitive information is properly handled and not exposed.

Test session management and authentication:
- Verify that unauthorized users cannot access restricted pages or perform actions.
- Verify that sessions are properly managed and user authentication is enforced.

Test security measures:
- Verify that user passwords are securely hashed and stored in the database.

//////////////////////

Performance and Scalability:

Test website performance:
- Verify that the website loads quickly and efficiently.
- Test the website's response time under normal and heavy traffic conditions.

Test scalability:
- Simulate high traffic by sending concurrent requests to the website.
- Verify that the website can handle the load without performance degradation or crashes.

//////////////////////

Compatibility and Responsiveness:

Test cross-browser compatibility:
- Test the website on different browsers (Chrome, Firefox, Safari, Edge) to ensure consistent rendering and functionality.

Test mobile responsiveness:
- Test the website on various mobile devices and screen sizes to ensure proper display and usability.

//////////////////////

Integration and Third-Party Services:

Test integration with payment gateway:
- Verify that the payment gateway integration (Stripe) functions correctly.
- Test different payment scenarios (successful payment, declined payment, etc.).

Test database integration:
- Verify that data is correctly retrieved and stored in the MongoDB database.
- Test database queries and ensure data consistency.

//////////////////////

Accessibility:

Test website accessibility:
- Verify that the website meets accessibility standards (WCAG 2.1).

//////////////////////

Error Logging and Monitoring:

Test error logging and reporting:
- Verify that errors and exceptions are logged appropriately.

//////////////////////

Deployment and Environment Testing:

Test website deployment process:
- Verify that the website is deployed successfully to the production environment.
- Test the live website to ensure all functionalities work in the production environment.






