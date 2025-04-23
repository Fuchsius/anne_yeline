User Endpoints
POST /api/users/register - Register a new user
POST /api/users/login - User login
GET /api/users - Get all users (likely admin only)
GET /api/users/:id - Get user by ID
GET /api/users/email/:email - Get user by email
PUT /api/users/:id - Update user
PUT /api/users/:id/status - Update user status
PUT /api/users/:id/password - Update user password
PUT /api/users/:id/profile - Update profile image
PUT /api/users/:id/role - Update user role
DELETE /api/users/:id - Delete user
DELETE /api/users/:id/profile-image - Delete profile image
Product Endpoints (implied from the code)
GET /api/products - Get all products
GET /api/products/:id - Get product by ID
POST /api/products - Create a product
PUT /api/products/:id - Update a product
DELETE /api/products/:id - Delete a product
POST /api/products/:id/images - Add product image
Category Endpoints (implied)
GET /api/categories - Get all categories
GET /api/categories/:id - Get category by ID
POST /api/categories - Create a category
PUT /api/categories/:id - Update a category
DELETE /api/categories/:id - Delete a category