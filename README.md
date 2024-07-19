<picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://apis.dj-dj.be/cdn/formatted-json-stringify/logo-dark.png">
   <source media="(prefers-color-scheme: light)" srcset="https://apis.dj-dj.be/cdn/formatted-json-stringify/logo.png">
   <img src="https://apis.dj-dj.be/cdn/formatted-json-stringify/logo.png" alt="Formatted Json Stringify" width="600px">
</picture>

[![discord](https://img.shields.io/badge/discord-join%20our%20server-5865F2.svg?style=flat-square&logo=discord)](https://discord.com/invite/26vT9wt3n3)  [![version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=flat-square)](https://github.com/DJj123dj/formatted-json-stringify/releases/tag/v1.0.0)  [![license](https://img.shields.io/badge/license-MIT-important.svg?style=flat-square)](https://github.com/DJj123dj/formatted-json-stringify/blob/main/LICENSE) [![stars](https://img.shields.io/github/stars/DJj123dj/formatted-json-stringify?color=yellow&label=stars&logo=github&style=flat-square)](https://www.github.com/DJj123dj/formatted-json-stringify)

### Formatted Json Stringify
Formatted Json Stringify is a small [npm package](https://www.npmjs.com/package/formatted-json-stringify) which allows you use an advanced & customisable version of the `JSON.stringify()`! If you're having trouble setting the bot up, feel free to join our support server and we will help you further! 

### [Install it using npm!](https://www.npmjs.com/package/formatted-json-stringify)
```
npm i formatted-json-stringify
```

## 📌 Features
- 📦 dependency free
- ⚖️ lightweight
- ✅ made with typescript
- ⚙️ advanced customisability
- 📄 support for custom formatters
- ⭐️ format json like you never did before!

## 🛠️ Usage
```js
const fjs = require("formatted-json-stringify")
const fs = require("fs")

//the sample we're gonna use
const sample = {
    property1:"this is the first property",
    property2:"this is the second property",
    property3:123,
    subObject:{
        sub_property_1:true,
        sub_property_2:false,
        sub_array:["abcd","efg","hijk","lmnop","qrst","uvw","xyz","and thats the alphabet!"]
    }
}

//let's create the formatter for our sample
const formatter = new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("property1"),
    new fjs.PropertyFormatter("property2"),
    new fjs.PropertyFormatter("property3"),
    new fjs.TextFormatter(), //let's add a space inbetween
    new fjs.ObjectFormatter("subObject",true,[
        new fjs.PropertyFormatter("sub_property_1"),
        new fjs.PropertyFormatter("sub_property_2"),
        new fjs.TextFormatter(), //let's add another space inbetween :)
        new fjs.ArrayFormatter("sub_array",false,new fjs.PropertyFormatter(null)),
    ]),
])

//and finally write the output to a json file
fs.writeFileSync("./test/output.json",formatter.stringify(sample))
```

### Expected Output:
```json
{
    "property1":"this is the first property",
    "property2":"this is the second property",
    "property3":123,
    
    "subObject":{
        "sub_property_1":true,
        "sub_property_2":false,
        
        "sub_array":["abcd","efg","hijk","lmnop","qrst","uvw","xyz","and thats the alphabet!"]
    }
}
```
> You can clearly see an empty newline between `property3` and `subObject`. This is also the case with the `sub_property_2`! 

You're also able to change if an array/object is rendered `inline` or `multiline`. For small arrays & objects, it's recommended to use the `inline` variant!


### Classes
While using Formatted Json Stringify you have access to the following classes:

|Class                   |Variable Type                          |Functionality                                                                                                                            |
|------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
|`PropertyFormatter`     |`boolean`, `string`, `number` & `null` |Format any [primitive](https://www.geeksforgeeks.org/primitive-and-non-primitive-data-types-in-javascript/) variable except `undefined`! |
|`ObjectFormatter`       |`object`                               |Format an `object` and customise how it's children/properties are formatted! **This supports multiple formatters for all children!**     |
|`ArrayFormatter`        |`array`                                |Format an `array` and customise how the values are formatted. **This supports 1 formatter for all children!**!                           |
|`TextFormatter`         |`/`                                    |Add an empty row or note between properties in an `object`!                                                                              |
|`ObjectSwitchFormatter` |`object`                               |Use this utility class to switch `ObjectFormatter`'s based on a `key` and `value` match in the object.                                   |

> There are more classes available, but these are only for advanced usage!

## 📸 Example Usage
### #1 Multiline VS Inline:
> Here, we will compare a `multiline` format vs an `inline` format. It's recommended to use the `multiline` format for large `objects` and `arrays`!


<table>
<tr>
<td>Inline (objects: inline, array: multiline)</td>
<td>Multiline (objects: multiline, array: multiline)</td>
</tr>
<tr>
<td>

```json
[
    {"key":"sample-key-1","value":"hello world!"},
    {"key":"sample-key-2","value":"hello mars!"},
    {"key":"sample-key-3","value":"hello venus!"},
    {"key":"sample-key-4","value":"hello sun!"}
]
```

</td>
<td>

```json
[
    {
        "key":"sample-key-1",
        "value":"hello world!"
    },
    {
        "key":"sample-key-2",
        "value":"hello mars!"
    },
    {
        "key":"sample-key-3",
        "value":"hello venus!"
    },
    {
        "key":"sample-key-4",
        "value":"hello sun!"
    }
]
```

</td>
</tr>
</table>

### #2 Using Object Switch For Databases:
> We're creating a database with 1 simple type and 1 complex type.
> The complex type is formatted `multiline` while the simple type is formatted `inline`!
```js
const input = [
    {type:"simple",key:"sample-key-1",value:"hello world!"},
    {type:"simple",key:"sample-key-2",value:"hello mars!"},
    {type:"complex",module:"1",category:2,key:"sample-key-3",value:"hello venus!"},
    {type:"complex",module:"1",category:2,key:"sample-key-4",value:"hello sun!"}
]

const formatter = new fjs.ArrayFormatter(null,true,
    new fjs.ObjectSwitchFormatter(null,[
        {key:"type",value:"simple",formatter:new fjs.ObjectFormatter(null,false,[
            new fjs.PropertyFormatter("key"),
            new fjs.PropertyFormatter("value")
        ])},
        {key:"type",value:"complex",formatter:new fjs.ObjectFormatter(null,true,[
            new fjs.PropertyFormatter("module"),
            new fjs.PropertyFormatter("category"),
            new fjs.PropertyFormatter("key"),
            new fjs.PropertyFormatter("value")
        ])},
    ])
)
```
**Expected Output:**
```json
[
    {"key":"sample-key-1","value":"hello world!"},
    {"key":"sample-key-2","value":"hello mars!"},
    {
        "module":"1",
        "category":2,
        "key":"sample-key-3",
        "value":"hello venus!"
    },
    {
        "module":"1",
        "category":2,
        "key":"sample-key-4",
        "value":"hello sun!"
    }
]
```

## 🩷 Sponsors
We don't have any sponsors yet! Would you like to do it?

## 🛠️ Contributors
### Official Team
|Role               |User (discord name)|
|-------------------|-------------------|
|🖥️ Lead Developer   |djj123dj           |

### Community
We don't have any community contributors yet!

## ⭐️ Star History
Please help us grow by giving a star! It would help us a lot!

<a href="https://star-history.com/#DJj123dj/formatted-json-stringify&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=DJj123dj/formatted-json-stringify&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=DJj123dj/formatted-json-stringify&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=DJj123dj/formatted-json-stringify&type=Date" />
 </picture>
</a>

## 📎 Links
current version: _v1.0.0_
</br>changelog: [click here](https://www.github.com/DJj123dj/discord-alt-detector/releases)
</br>support: [click here](https://discord.dj-dj.be/)

© 2024 - DJdj Development | [website](https://www.dj-dj.be) | [discord](https://discord.dj-dj.be) | [terms of service](https://www.dj-dj.be/terms)