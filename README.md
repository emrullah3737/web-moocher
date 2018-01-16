# web-moocher
Web page data mooch

# Usage

  for Table

```javascript
const Mooch = require('web-moocher');

const mooch = new Mooch({
  slug: 'example',
  url: 'www.example.com',
});

mooch.getTable({
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
```
  for Table with using Cron
```javascript

mooch.getTablewithCron({
  selector: '#puantablosu',
  cron: {
    cronTime: '* * * * * *', // cron time 
    onTick: (data) => {
      // process that every tick
      console.log(data);
    },
    start: true, // default false
    timeZone: 'America/Los_Angeles', // default Europe/Istanbul
  },
  fields: {
    count: 3, // if you dont want all field, you must define column.length
    sort: ['Name', 'Surname'], // fields what you want
    limit: 10,
    skip: 3,
  },
}); // you can set 'start:true' or .start() at this statement


