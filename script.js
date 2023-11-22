let data = [];

fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then((json) => {
        data = json;
        console.log(data);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });