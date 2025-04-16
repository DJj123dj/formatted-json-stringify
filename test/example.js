//@ts-check
const fjs = require("../dist/index")
const fs = require("fs")

//our sample
const sample = {
    property1:"this is the first\n\tproperty",
    property2:"this is the second property",
    property3:123,
    subObject:{
        sub_property_1:true,
        sub_property_2:false,
        sub_array:["abcd","efg","hijk","lmnop","qrst","uvw","xyz","and thats the alphabet!"]
    },
    testEmptyArray:[]
}

//create the formatter for our sample
const formatter = new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("property1"),
    new fjs.PropertyFormatter("property2"),
    new fjs.PropertyFormatter("property3"),
    new fjs.TextFormatter(), //let's add a space inbetween
    new fjs.DefaultFormatter("subObject",true),
    new fjs.ArrayFormatter("testEmptyArray",true,new fjs.PropertyFormatter(null))
    //new fjs.ObjectFormatter("subObject",true,[
    //    new fjs.PropertyFormatter("sub_property_1"),
    //    new fjs.PropertyFormatter("sub_property_2"),
    //    new fjs.TextFormatter(), //let's add another space inbetween :)
    //    new fjs.ArrayFormatter("sub_array",false,new fjs.PropertyFormatter(null)),
    //]),
])

//write the output to a json file
fs.writeFileSync("./test/output.json",formatter.stringify(sample))