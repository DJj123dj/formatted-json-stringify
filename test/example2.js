//@ts-check
const fjs = require("../dist/index")
const fs = require("fs")

//our sample
const sample = [
    {type:"simple",key:"sample-key-1",value:"hello world!"},
    {type:"simple",key:"sample-key-2",value:"hello mars!"},
    {type:"complex",module:"1",category:2,key:"sample-key-3",value:"hello venus!"},
    {type:"complex",module:"1",category:2,key:"sample-key-4",value:"hello sun!"}
]

//create the formatter for our sample
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

//write the output to a json file
fs.writeFileSync("./test/output.json",formatter.stringify(sample))