# birdapi
Express API for the bird database in Mongo
Our bird database has a collection of birds, users and comments. The bird collection has information about birds: name, family, photo URL, etc. The user collection is pretty straight-forward. It has an email and name. Users can leave a comment on the bird page. These comments are available in the comments collection.

There are two APIs to access the bird database: admin API and public API. Admin API allows to create, edit and delete bird details. The public API displays the bird details to all users, both anonymous as well as registered users. Registered users have the option to perform two operations. They can mark a bird as seen. (The app is for bird lovers. And they like to mark birds as seen). And sometimes, registered users want to leave a comment on the bird page.

### More explanation of the API is available in my [blog post](https://vijayt.com/post/build-an-express-api-for-mongo-database/).
