/**A type which matches all available formatters in this package. */
export type AnyFormatter = custom.BaseFormatter|DefaultFormatter|PropertyFormatter|TextFormatter|ObjectFormatter|ArrayFormatter|ObjectSwitchFormatter|SingleCommentFormatter|MultiCommentFormatter

export namespace custom {
    /**All valid variable types in a JSON file. */
    export type ValidJsonType = number|string|boolean|null|object|ValidJsonType[]

    /**## BaseFormatter `class`
     * The base of all formatters. This class can't be used directly, but needs to be extended from when creating custom formatters!
     */
    export abstract class BaseFormatter {
        /**The name of this variable. Used as key in objects. */
        readonly name: string
        /**The name of this variable for the error stack. */
        readonly errName: string
        /**Set this to `false` when this is a global variable or you don't want the key/name to be rendered. */
        showKey: boolean

        constructor(name:string|null){
            this.name = name ?? ""
            this.errName = name ?? "<unnamed>"
            this.showKey = !(name == null)
        }

        /**Parse a variable trough this formatter! Returns a JSON string like `JSON.stringify()` */
        abstract stringify(data:ValidJsonType,errFilename?:string,errStack?:string): string
        /**Generate an error stack for tracking the origin of the error. */
        protected generateErrStack(errFilename?:string,errStack?:string,errData?:ValidJsonType){
            try{
                return "FJS:STACK:"+(errFilename ?? "<unknown>")+"::>"+(errStack ?? "<no-stack>")+"<:: DATA: "+((typeof errData == "undefined") ? "undefined" : JSON.stringify(errData))
            }catch{
                return "FJS:STACK:STACKERROR:"
            }
        }
    }

    /**## BaseFormatterWithComment `class`
     * The base of all formatters with support for inline JSONC comments. This class can't be used directly, but needs to be extended from when creating custom formatters!
     */
    export abstract class BaseFormatterWithComment extends BaseFormatter {
        /**An optional comment shown after the property in JSONC files. Parsed by an ObjectFormatter or ArrayFormatter */
        comment: SingleCommentFormatter|MultiCommentFormatter|null

        constructor(name:string|null,comment?:SingleCommentFormatter|MultiCommentFormatter){
            super(name)
            this.comment = comment ?? null
        }
    }

    /**## ObjectSwitchData `interface`
     * The data for a single "object switch" in the `ObjectSwitchFormatter`!
     */
    export interface ObjectSwitchData {
        /**The key to match. */
        key:any,
        /**The value to match. */
        value:any,
        /**The formatter to use for the object when the key and value match! */
        formatter:ObjectFormatter
    }
}

/**## DefaultFormatter `class`
 * You can use this formatter when you don't know the contents of the variable!
 * 
 * It just uses the default `JSON.stringify` under the hood!
 */
export class DefaultFormatter extends custom.BaseFormatterWithComment {
    /**When enabled, objects & arrays will be rendered multiline instead of inline! */
    multiline: boolean
    /**The space or indentation for this object/array. 4 spaces by default. */
    space: string 

    constructor(name:string|null, multiline:boolean, space?:string, comment?:SingleCommentFormatter|MultiCommentFormatter){
        super(name,comment)
        this.multiline = multiline
        this.space = space ?? "    "
    }

    stringify(data:custom.ValidJsonType,errFilename?:string,errStack?:string){
        if (!errStack) errStack = "<root>"
        if (typeof data == "undefined") throw new Error(`FJS.PropertyFormatter:stringify() Property '${this.name}' is 'undefined' which is not allowed in JSON files! `+this.generateErrStack(errFilename,errStack+"."+this.errName,data))
        const key = this.showKey ? `"${this.name}":` : ""
        const value = JSON.stringify(data,null,(this.multiline ? this.space : undefined))
        return key+value
    }
}

/**## PropertyFormatter `class`
 * The formatter responsible for formatting `boolean`, `string`, `number` & `null` variables!
 */
export class PropertyFormatter extends custom.BaseFormatterWithComment {
    stringify(data:number|string|boolean|null,errFilename?:string,errStack?:string){
        if (!errStack) errStack = "<root>"
        if (typeof data == "undefined") throw new Error(`FJS.PropertyFormatter:stringify() Property '${this.name}' is 'undefined' which is not allowed in JSON files! `+this.generateErrStack(errFilename,errStack+"."+this.errName,data))
        const key = this.showKey ? `"${this.name}":` : ""
        const value = JSON.stringify(data)
        return key+value
    }
}

/**## TextFormatter `class`
 * The formatter responsible for adding custom text between properties in an object!
 */
export class TextFormatter extends custom.BaseFormatter {
    /**The text to write on this row. */
    text: string

    constructor(text?:string){
        super(null)
        this.text = text ?? ""
    }

    stringify(data:null,errFilename?:string,errStack?:string): string {
        if (!errStack) errStack = "<root>"
        return this.text
    }
}

/**## SingleCommentFormatter `class`
 * A formatter to add a single-line comment (`// this is a comment`) to JSONC files
 * 
 * Warning: This comment is only supported within multi-line objects/arrays!
 */
export class SingleCommentFormatter extends custom.BaseFormatter {
    /**The comment to write on this row. */
    comment: string

    constructor(comment:string){
        super(null)
        this.comment = comment ?? ""
    }

    stringify(data:null,errFilename?:string,errStack?:string): string {
        if (!errStack) errStack = "<root>"
        return "//"+this.comment
    }
}


/**## MultiCommentFormatter `class`
 * A formatter to add a multi-line comment (`/* this is a multi-line comment *\/`) to JSONC files
 */
export class MultiCommentFormatter extends custom.BaseFormatter {
    /**The comment to write on this row. */
    comment: string

    constructor(comment:string){
        super(null)
        this.comment = comment ?? ""
    }

    stringify(data:null,errFilename?:string,errStack?:string): string {
        if (!errStack) errStack = "<root>"
        const rows = this.comment.split("\n")
        if (rows.length < 2) return "/* "+(rows.shift() ?? "")+" */"
        else{
            
            return "/*\n * "+rows.join("\n * ")+"\n */"
        }
        
    }
}

/**## ObjectFormatter `class`
 * The formatter responsible for formatting `object` variables!
 */
export class ObjectFormatter extends custom.BaseFormatterWithComment {
    /**When enabled, the object will be rendered multiline instead of inline! */
    multiline: boolean
    /**A collection of all the child-formatters in this object. */
    children: custom.BaseFormatter[]
    /**When enabled, the object will still be rendered multiline when it's empty! */
    multilineWhenEmpty: boolean
    /**The space or indentation for this object. 4 spaces by default. */
    space: string 

    constructor(name:string|null, multiline:boolean, children:custom.BaseFormatter[], multilineWhenEmpty?:boolean, space?:string, comment?:SingleCommentFormatter|MultiCommentFormatter){
        super(name,comment)
        this.multiline = multiline
        this.children = children
        this.multilineWhenEmpty = multilineWhenEmpty ?? false
        this.space = space ?? "    "
    }

    stringify(data:Record<any,custom.ValidJsonType>,errFilename?:string,errStack?:string): string {
        if (!errStack) errStack = "<root>"
        if (typeof data !== "object") throw new Error("FJS.ObjectFormatter:stringify() Provided 'data' parameter is not an object! "+this.generateErrStack(errFilename,errStack+"."+this.errName,data))
        const children = this.children.map((child,index) => {
            
            const comma = (this.children.length == index+1) ? "" : ","
            if (child instanceof TextFormatter || child instanceof SingleCommentFormatter || child instanceof MultiCommentFormatter) return this.#indentWithoutFirst(child.stringify(null,errFilename,errStack+"."+this.errName))
            
            if (typeof data[child.name] == "undefined") throw new Error(`FJS.ObjectFormatter:stringify() Object property '${child.name}' is 'undefined' which is not allowed in JSON files! `+this.generateErrStack(errFilename,errStack+"."+this.errName+"."+child.errName,data))
            
            if (child instanceof custom.BaseFormatterWithComment){
                //formatter supports inline comments
                const comment = (child.comment) ? " "+child.comment.stringify(null,errFilename,errStack+"."+this.errName+"."+child.errName) : ""
                return this.#indentWithoutFirst(child.stringify(data[child.name],errFilename,errStack+"."+this.errName)+comma+comment)
            }

            //default child rendering
            return this.#indentWithoutFirst(child.stringify(data[child.name],errFilename,errStack+"."+this.errName)+comma)
        })
        const key = this.showKey ? `"${this.name}":` : "" 
        const renderMultiline = this.multiline && (children.length > 0 || this.multilineWhenEmpty)
        const value = renderMultiline ? `{\n${this.space}${children.join(`\n${this.space}`)}\n}` : `{${children.join("")}}`
        return key+value
    }
    /**Private function for indenting all lines except the first row. */
    #indentWithoutFirst(text:string){
        return text.split("\n").map((row,index) => {
            if (index == 0) return row
            else return this.space+row
        }).join("\n")
    }
}

/**## ArrayFormatter `class`
 * The formatter responsible for formatting `array` variables!
 */
export class ArrayFormatter extends custom.BaseFormatterWithComment {
    /**When enabled, the array will be rendered multiline instead of inline! */
    multiline: boolean
    /**The formatter that will be executed on all variables in the array. */
    property: custom.BaseFormatter
    /**When enabled, the object will still be rendered multiline when it's empty! */
    multilineWhenEmpty: boolean
    /**The space or indentation for this array. 4 spaces by default. */
    space: string 

    constructor(name:string|null, multiline:boolean, property:custom.BaseFormatter, multilineWhenEmpty?:boolean, space?:string, comment?:SingleCommentFormatter|MultiCommentFormatter){
        super(name,comment)
        this.multiline = multiline
        this.property = property
        this.multilineWhenEmpty = multilineWhenEmpty ?? false
        this.space = space ?? "    "
    }

    stringify(data:custom.ValidJsonType[],errFilename?:string,errStack?:string): string {
        if (!errStack) errStack = "<root>"
        if (!Array.isArray(data)) throw new Error("FJS.ArrayFormatter:stringify() Provided 'data' parameter is not an array! "+this.generateErrStack(errFilename,errStack+"."+this.name,data))
        const children = data.map((child,index) => {
            const comma = (data.length == index+1) ? "" : ","
            if (typeof child == "undefined") throw new Error(`FJS.ArrayFormatter:stringify() Value #${index} of array is 'undefined' which is not allowed in JSON files! `+this.generateErrStack(errFilename,errStack+"."+this.errName+"."+index,child))
            
            if (this.property instanceof custom.BaseFormatterWithComment){
                //formatter supports inline comments
                const comment = (this.property.comment) ? " "+this.property.comment.stringify(null,errFilename,errStack+"."+this.errName+"."+index) : ""
                return this.#indentWithoutFirst(this.property.stringify(child,errFilename,errStack+"."+this.errName)+comma+comment)
            }
            
            //default child rendering
            return this.#indentWithoutFirst(this.property.stringify(child,errFilename,errStack+"."+this.errName)+comma)
        })

        const key = this.showKey ? `"${this.name}":` : "" 
        const renderMultiline = this.multiline && (children.length > 0 || this.multilineWhenEmpty)
        const value = renderMultiline ? `[\n${this.space}${children.join(`\n${this.space}`)}\n]` : `[${children.join("")}]`
        return key+value
    }
    /**Private function for indenting all lines except the first row. */
    #indentWithoutFirst(text:string){
        return text.split("\n").map((row,index) => {
            if (index == 0) return row
            else return this.space+row
        }).join("\n")
    }
}

/**## ObjectSwitchFormatter `class`
 * Use this utility class to switch `ObjectFormatter`'s based on a `key` and `value` match in the object.
 * 
 * This could be used in combination with an `ArrayFormatter` to allow different objects to exist in the same array!
 */
export class ObjectSwitchFormatter extends custom.BaseFormatterWithComment {
    /**A list of all available formatters to check for an object. */
    formatters: custom.ObjectSwitchData[]

    constructor(name:string|null, formatters:custom.ObjectSwitchData[], comment?:SingleCommentFormatter|MultiCommentFormatter){
        super(name,comment)
        this.formatters = formatters
    }

    stringify(data:Record<any,custom.ValidJsonType>,errFilename?:string,errStack?:string): string {
        if (!errStack) errStack = "<root>"
        if (typeof data !== "object") throw new Error("FJS.ObjectSwitchFormatter:stringify() Provided 'data' parameter is not an object! "+this.generateErrStack(errFilename,errStack+"."+this.errName,data))
        const result = this.formatters.find((formatter) => data[formatter.key] === formatter.value)
        if (!result) throw new Error("FJS.ObjectSwitchFormatter:stringify() No formatter matches the given object! "+this.generateErrStack(errFilename,errStack+"."+this.errName,data))
        const formatter = result.formatter
        
        return formatter.stringify(data,errFilename,errStack+"."+this.errName)
    }
}