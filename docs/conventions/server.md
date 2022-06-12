## define model interfaces using Record, Raw, Create, Update

Record: interface that used by get functions  
Raw: interface that has same format with database table  
Create: interface that used by create function  
Update: interface that used by update function  
convertToRecord: convert record in Raw format to Record format
```
interface Record {
  id: number;
  value: number;
}

interface Raw {
  id: number;
  value: string;
}

interface Create {
  value: string;
}

interface Update {
  value: string;
}

```

# Use xxxUTC to store date which will be used for compare

```
// Bad
table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable()

// Good
table.specificType('createdAtUTC', 'CHAR(19)').notNullable()
```