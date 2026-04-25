<picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://apis.dj-dj.be/cdn/formatted-json-stringify/logo-dark.png">
   <source media="(prefers-color-scheme: light)" srcset="https://apis.dj-dj.be/cdn/formatted-json-stringify/logo.png">
   <img src="https://apis.dj-dj.be/cdn/formatted-json-stringify/logo.png" alt="Formatted Json Stringify" width="600px">
</picture>

[![discord](https://img.shields.io/badge/discord-join%20our%20server-5865F2.svg?style=flat-square&logo=discord)](https://discord.com/invite/26vT9wt3n3)  [![version](https://img.shields.io/badge/version-1.3.1-brightgreen.svg?style=flat-square)](https://github.com/DJj123dj/formatted-json-stringify/releases/tag/v1.3.1)  [![license](https://img.shields.io/badge/license-MIT-important.svg?style=flat-square)](https://github.com/DJj123dj/formatted-json-stringify/blob/main/LICENSE) [![stars](https://img.shields.io/github/stars/DJj123dj/formatted-json-stringify?color=yellow&label=stars&logo=github&style=flat-square)](https://www.github.com/DJj123dj/formatted-json-stringify)

### Formatted Json Stringify
Formatted Json Stringify is a small [npm package](https://www.npmjs.com/package/formatted-json-stringify) which upgrades `JSON.stringify()` with many new formatting tools! Add comments to JSON files, output multi-line & single-line JSON at the same time and so much more! If you're having trouble configuring the library, feel free to join our support server and we will help you further! 

### [Install it using npm!](https://www.npmjs.com/package/formatted-json-stringify)
```
npm i formatted-json-stringify
```

## 📌 Features
- ✏️ Supports JSONC comments
- ⚖️ Lightweight
- ✅ Typescript compatible
- ⚙️ Advanced customisability
- 📄 Create custom formatters
- ⭐️ Compact & multiline JSON work together

## 🛠️ Usage
```js
const fjs = require("formatted-json-stringify") //import fjs from "formatted-json-stringify"
const fs = require("fs")                        //import fs from "fs"

//Our JSON data sample
const sample = {
    property1:"this is the first property",
    property2:"this is the second property",
    property3:123,
    subObject:{
        sub_property_1:true,
        sub_property_2:false,
        sub_array:["abcd","efg","hijk","lmnop","qrst","uvw","xyz"]
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
        new fjs.SingleCommentFormatter("Hi there! I'm a comment!"),
        new fjs.ArrayFormatter("sub_array",false,new fjs.PropertyFormatter(null)),
    ]),
])

//and finally write the output to a json file
fs.writeFileSync("./test/output.json",formatter.stringify(sample))
```

### Expected Output:
```jsonc
{
    "property1":"this is the first property",
    "property2":"this is the second property",
    "property3":123,
    
    "subObject":{
        "sub_property_1":true,
        "sub_property_2":false,
        
        //Hi there! I'm a comment!
        "sub_array":["abcd","efg","hijk","lmnop","qrst","uvw","xyz","and thats the alphabet!"]
    }
}
```
> You can clearly see an empty newline between `property3` and `subObject`. This is also the case with the `sub_property_2`! 

You're also able to change if an array/object is rendered `inline` or `multiline`. For small arrays & objects, it's recommended to use the `inline` variant!


## 📦 Classes
When using Formatted Json Stringify you have access to the following classes.

|Class                   |Variable Type                          |Functionality                                                                                                                            |
|------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
|`PropertyFormatter`     |`boolean`, `string`, `number` & `null` |Format any [primitive](https://www.geeksforgeeks.org/primitive-and-non-primitive-data-types-in-javascript/) variable except `undefined`! |
|`ObjectFormatter`       |`object`                               |Format an `object` and customise how it's children/properties are formatted! **This supports multiple formatters for all children!**     |
|`ArrayFormatter`        |`array`                                |Format an `array` and customise how the values are formatted. **This supports 1 formatter for all children!**!                           |
|`TextFormatter`         |`/`                                    |Add an empty row or note between properties in an `object`!                                                                              |
|`SingleCommentFormatter`|`/`                                    |Add a single-line `//...` comment between 2 properties. Can also be used inside another formatter for inline comments.                   |
|`MultiCommentFormatter` |`/`                                    |Add a single-line `/*...*/` comment between 2 properties. Can also be used inside another formatter for inline comments.                 |
|`ObjectSwitchFormatter` |`object`                               |Use this utility class to switch `ObjectFormatter`'s based on a `key` and `value` match in the object.                                   |
|`DefaultFormatter`      |`any`                                  |Format any variable with unknown contents! This will just use the default `JSON.stringify()` method!                                     |

> There is also the abstract `BaseFormatter` class for creating a custom formatter!

### Configurable Options
Here, you can find a list of settings found on most formatters and what they will do.
|Option               |Availability                         |Type                 |Functionality                                                                                                         |
|---------------------|-------------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------|
|`name`               |All Formatters                       |`string\|null`       |When not `null`, it renders the property name or key. [Click here for an example!](#example-2-name-vs-without-name)   |
|`multiline`          |`ObjectFormatter` & `ArrayFormatter` |`boolean`            |When `true`, it renders the object or array `multiline`. [Click here for an example!](#example-1-multiline-vs-inline) |
|`space`              |`ObjectFormatter` & `ArrayFormatter` |`string\|undefined`  |Used as indentation when `multiline` is enabled. 4 spaces by default.                                                 |
|`multilineWhenEmpty` |`ObjectFormatter` & `ArrayFormatter` |`boolean\|undefined` |When enabled, `multiline` will still be used even if the object/array is empty.                                       |
|`text`               |`TextFormatter`                      |`string\|undefined`  |When used, insert custom text on this row. Can be used for comments. When not defined, it will just be an empty row.  |
|`children`           |`ObjectFormatter`                    |`BaseFormatter[]`    |A list of formatters which will define how all children/properties of the object are formatted.                       |
|`property`           |`ArrayFormatter`                     |`BaseFormatter`      |The formatter used to format the properties/values of this array.                                                     |
|`formatters`         |`ObjectSwitchFormatter`              |`ObjectSwitchData[]` |A list of `ObjectFormatter`'s to choose from, depending on a key-value match.                                         |
|`comment`            |All Formatters                       |`CommentFormatter`   |Specify an optional inline comment. It will be rendered after the JSON data.                                          |

## 📸 Example Usage
### Example 1: Multiline VS Inline
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

### Example 2: Name VS Without Name
> Here, we will compare what will happen when you set the `name` property to `null` or a `string`!

<table>
<tr>
<td>Name</td>
<td>Without Name</td>
</tr>
<tr>
<td>

```json
"thisIsTheName":{
    "property1":1,
    "property2":2,
    "property3":3
}
```

</td>
<td>

```json
{
    "property1":1,
    "property2":2,
    "property3":3
}
```

</td>
</tr>
</table>

The only place where you should disable the `name` is in the **first formatter** or in **array properties**!

### Example 3: Using Object Switch For Databases
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

### Example 4: Using The Default Formatter
> There will be some cases where you don't know the value/contents of a variable.
> This isn't that helpful when you need to know the entire structure of the JSON.
>
> Luckly there is a solution: Using the `DefaultFormatter`! It's just a wrapper around the default `JSON.stringify()`!

```js
const input = {
    property1:"this is the first property",
    property2:"this is the second property",
    property3:123,
    subObject:{
        sub_property_1:true,
        sub_property_2:false,
        sub_array:["abcd","efg","hijk","lmnop","qrst","uvw","xyz","and thats the alphabet!"]
    }
}

const formatter = new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("property1"),
    new fjs.PropertyFormatter("property2"),
    new fjs.PropertyFormatter("property3"),
    new fjs.TextFormatter(),
    
    //we don't know the contents of this object
    //but we still want to render it multiline/inline
    new fjs.DefaultFormatter("subObject",true)
```
**Expected Output:**
> You will automatically see that not only the object got rendered `multiline`, but the entire part including the array got rendered `multiline`!

```json
{
    "property1":"this is the first property",
    "property2":"this is the second property",
    "property3":123,
    
    "subObject":{
        "sub_property_1": true,
        "sub_property_2": false,
        "sub_array": [
            "abcd",
            "efg",
            "hijk",
            "lmnop",
            "qrst",
            "uvw",
            "xyz",
            "and thats the alphabet!"
        ]
    }
}
```

## ❤️ Sponsors
We don't have any sponsors yet! Would you like to do it?

## 🛠️ Contributors
|Role               |User (Discord/Github)|
|-------------------|-------------------|
|🖥️ Main Developer   |djj123dj           |

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
current version: _v1.3.1_
</br>changelog: [click here](https://www.github.com/DJj123dj/formatted-json-stringify/releases)
</br>support: [click here](https://discord.dj-dj.be/)

© 2026 - DJdj Development | [Website](https://www.dj-dj.be) | [Support Server](https://discord.dj-dj.be) | [Terms Of Service](https://www.dj-dj.be/terms)