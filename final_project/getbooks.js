// for trail only

const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data; // Return the list of books
  } catch (error) {
    console.error('Error fetching books:', error.message);
    throw error;
  }
}

// Call the getBooks function
getBooks()
  .then(books => {
    console.log('List of books:', books);
  })
  .catch(error => {
    console.error('An error occurred:', error.message);
  });
