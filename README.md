# web-moocher
Web page data mooch

# Usage

  for Table

```javascript
const Mooch = require('web-moocher');

const mock = new Mooch('data');

mock.init({
  url: 'www.example.com',
});

mock.getTable({
  selector: '#table-id',
  fields: {
    count: 3, // if you dont want all field, you must define column.length
    sort: ['Name', 'Surname'], // fields what you want
    limit: 10,
    skip: 3,
  },
}).then((res) => {
  // ... Response (res is typeof Json Object)
  console.log(res);
}).catch((err) => {
  // ... Error
});
````
  

