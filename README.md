# Description
A Budibase Multiselect Picker for custom datasource like CSV/JSON or nested schema 

<img width="1365" alt="Screenshot 2024-09-01 at 9 12 01 PM" src="https://github.com/user-attachments/assets/6421cd48-e369-4b70-bdc4-8f1458f3ba21">

<img width="1365" alt="Screenshot 2024-09-01 at 9 11 50 PM" src="https://github.com/user-attachments/assets/87160dd1-79bd-4d39-a1d4-6a87192b46e4">

# Usage Instructions

### Example 1:

```JSON
[
  {
    "id":1,
    "name":"Alex"
  },
  {
    "id":2,
    "name":"Brian"
  }
]
```
These properties can be referenced in label or value inputs like `id` or `name`

### Example 2 [Nested Schema]:

```JSON
[
  {
    "id":1,
    "name":"Alex",
    "profile":{
      "employee_id":"1234",
      "legal_name":"Alex N"
    }
  },
  {
    "id":2,
    "name":"Brian",
    "profile":{
      "employee_id":"1235",
      "legal_name":"Brian P"
    }
  }
]
```
These properties can be referenced in label or value inputs like `profile.employee_id` or `profile.legal_name`

### Example 3 [Arrays in Schema]:

```JSON
[
  {
    "id":1,
    "name":"Alex",
    "profiles":[
      {
        "employee_id":"1234",
        "legal_name":"Alex N"
      },
      {
        "employee_id":"1234",
        "legal_name":"Alex N P"
      }
    ]
  },
  {
    "id":2,
    "name":"Brian",
    "profile":[
      {
        "employee_id":"1235",
        "legal_name":"Brian P"
      },
      {
        "employee_id":"1235",
        "legal_name":"Brian P F"
      }
    ]
  }
]
```
These properties can be referenced in label or value inputs like `profile.index__0.employee_id` or `profile.index__0.legal_name`



## Dev Instructions

To build your new  plugin run the following in your Budibase CLI:
```
budi plugins --build
```

You can also re-build everytime you make a change to your plugin with the command:
```
budi plugins --watch
```

Find out more about [Budibase](https://github.com/Budibase/budibase).

