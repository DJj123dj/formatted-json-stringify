//@ts-check
const fjs = require("../dist/index")
const fs = require("fs")

//our sample
const sample = {
    property1:"this is the first\n\tproperty hi",
    property2:"this is the second property",
    property3:123,
    subObject:{
        sub_property_1:true,
        sub_property_2:false,
        sub_array:[
            {id:"hey1",value:"ho"},
            {id:"hey2",value:"ho"},
            {id:"hey3",value:"ho"},
            {id:"hey4",value:"ho"},
        ]
    },
    testEmptyArray:[]
}

//create the formatter for our sample
const formatter = new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("property1"),
    new fjs.PropertyFormatter("property2"),
    new fjs.PropertyFormatter("property3"),
    new fjs.TextFormatter(), //let's add a space inbetween
    //new fjs.DefaultFormatter("subObject",true),
    new fjs.ArrayFormatter("testEmptyArray",true,new fjs.PropertyFormatter(null)),
    new fjs.ObjectFormatter("subObject",true,[
        new fjs.PropertyFormatter("sub_property_1"),
        new fjs.PropertyFormatter("sub_property_2"),
        new fjs.TextFormatter(), //let's add another space inbetween :)
        new fjs.ArrayFormatter("sub_array",true,new fjs.ObjectFormatter(null,false,[
            new fjs.PropertyFormatter("id"),
            new fjs.PropertyFormatter("value"),
        ],false)),
    ]),
])

//write the output to a json file
fs.writeFileSync("./test/output.json",formatter.stringify(sample,"output.json"))

/**
 
FJS:STACK:output.json::><root>.<unnamed>.property3<::

{
    "property1":"this is the first\n\tproperty hi",
    "property2":"this is the second property",
    "subObject":{
        "sub_property_1":true,
        "sub_property_2":false,
        "sub_array":[{"id":"hey1","value":"ho"},{"id":"hey2","value":"ho"},{"id":"hey3"},{"id":"hey4","value":"ho"}]
    },
    "testEmptyArray":[]
}


 */