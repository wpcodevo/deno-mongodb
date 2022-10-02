#  Authentication with Bcrypt, JWT, and Cookies in Deno

To demonstrate how JWT authentication works in Deno, we'll build an API that runs on an Oak middleware server and uses a MongoDB database. Then, we'll add an authentication guard where only users with a valid JSON Web Token will be able to access the protected routes. Also, we'll make the passwords secure by hashing them with the Bcrypt library.

![ Authentication with Bcrypt, JWT, and Cookies in Deno](https://codevoweb.com/wp-content/uploads/2022/09/Authentication-with-Bcrypt-JWT-and-Cookies-in-Deno.webp)

## Topics Covered

- Setup the API Project
- Create the Database Model with MongoDB
- Create the Validation Schemas with Zod
- Load the Environment Variables in Deno
- Create Utility Functions
    - Function to Sign and Verify the JSON Web Token
    - Function to Hash and Verify the Passwords
    - Function to Omit Fields from an Object
- Create the API Route Controllers
    - Register User Controller
    - Login User Controller
    - Logout User Controller
    - Request Authenticated User's Profile Controller
- Create the Middleware Guard
- Create the API Routes
- Add the Routes to the Deno Application

Read the entire article here: [https://codevoweb.com/authentication-with-bcrypt-jwt-and-cookies-in-deno](https://codevoweb.com/authentication-with-bcrypt-jwt-and-cookies-in-deno)

Articles in this Series:

### 1. How to Setup and Use MongoDB with Deno

[How to Setup and Use MongoDB with Deno](https://codevoweb.com/setup-and-use-mongodb-with-deno)

### 2. How to Set up Deno RESTful CRUD Project with MongoDB

[How to Set up Deno RESTful CRUD Project with MongoDB](https://codevoweb.com/setup-deno-restful-crud-project-with-mongodb)

### 3. Authentication with Bcrypt, JWT, and Cookies in Deno

[Authentication with Bcrypt, JWT, and Cookies in Deno](https://codevoweb.com/authentication-with-bcrypt-jwt-and-cookies-in-deno)

### 4. Build a Complete Deno CRUD RESTful API with MongoDB

[Build a Complete Deno CRUD RESTful API with MongoDB](https://codevoweb.com/deno-crud-restful-api-with-mongodb)
