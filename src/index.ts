


export namespace custom {
    /**All valid variable types in a JSON file. */
    export type ValidJsonType = number|string|boolean|null|object|ValidJsonType[]

    /**## BaseFormatter `class`
     * The base of all formatters. This class can't be used directly, but needs to be extended from when creating custom formatters!
     */
    export class BaseFormatter {
        /**The name of this variable. Used as key in objects. */
        name: string
        /**Set this to `false` when this is a global variable or you don't want the key/name to be rendered. */
        showKey: boolean

        constructor(name:string|null){
            this.name = name ?? ""
            this.showKey = !(name == null)
        }

        /**Parse a variable trough this formatter! Returns a JSON string like `JSON.stringify()` */
        stringify(data:ValidJsonType): string {
            throw new Error("FJS.BaseFormatter: Tried to use uninplemented stringify() function!")
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
export class DefaultFormatter extends custom.BaseFormatter {
    /**When enabled, objects & arrays will be rendered multiline instead of inline! */
    multiline: boolean
    /**The space or indentation for this object/array. 4 spaces by default. */
    space: string 

    constructor(name:string|null, multiline:boolean, space?:string){
        super(name)
        this.multiline = multiline
        this.space = space ?? "    "
    }

    stringify(data:custom.ValidJsonType){
        if (typeof data == "undefined") throw new Error(`FJS.PropertyFormatter: Property '${this.name}' is 'undefined' which is not allowed in JSON files!`)
        const key = this.showKey ? `"${this.name}":` : ""
        const value = JSON.stringify(data,null,(this.multiline ? this.space : undefined))
        return key+value
    }
}

/**## PropertyFormatter `class`
 * The formatter responsible for formatting `boolean`, `string`, `number` & `null` variables!
 */
export class PropertyFormatter extends custom.BaseFormatter {
    stringify(data:number|string|boolean|null){
        if (typeof data == "undefined") throw new Error(`FJS.PropertyFormatter: Property '${this.name}' is 'undefined' which is not allowed in JSON files!`)
        const key = this.showKey ? `"${this.name}":` : ""
        const value = (typeof data == "string") ? `"${data}"` : String(data)
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

    stringify(): string {
        return this.text
    }
}

/**## ObjectFormatter `class`
 * The formatter responsible for formatting `object` variables!
 */
export class ObjectFormatter extends custom.BaseFormatter {
    /**When enabled, the object will be rendered multiline instead of inline! */
    multiline: boolean
    /**A collection of all the child-formatters in this object. */
    children: custom.BaseFormatter[]
    /**When enabled, the object will still be rendered multiline when it's empty! */
    multilineWhenEmpty: boolean
    /**The space or indentation for this object. 4 spaces by default. */
    space: string 

    constructor(name:string|null, multiline:boolean, children:custom.BaseFormatter[], multilineWhenEmpty?:boolean, space?:string){
        super(name)
        this.multiline = multiline
        this.children = children
        this.multilineWhenEmpty = multilineWhenEmpty ?? false
        this.space = space ?? "    "
    }

    stringify(data:object): string {
        const children = this.children.map((child,index) => {
            
            const comma = (this.children.length == index+1) ? "" : ","
            if (child instanceof TextFormatter) return this.#indentWithoutFirst(child.stringify())
            else{
                if (typeof data[child.name] == "undefined") throw new Error(`FJS.ObjectFormatter: Object property '${child.name}' is 'undefined' which is not allowed in JSON files!`)
                return this.#indentWithoutFirst(child.stringify(data[child.name])+comma)
            }
        })
        const key = this.showKey ? `"${this.name}":` : "" 
        const renderFirstMultiline = (children.length > 0 || this.multilineWhenEmpty)
        const value = this.multiline ? `{`+(renderFirstMultiline ? `\n${this.space}` : "")+`${children.join(`\n${this.space}`)}\n}` : `{${children.join("")}}`
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
export class ArrayFormatter extends custom.BaseFormatter {
    /**When enabled, the array will be rendered multiline instead of inline! */
    multiline: boolean
    /**The formatter that will be executed on all variables in the array. */
    property: custom.BaseFormatter
    /**When enabled, the object will still be rendered multiline when it's empty! */
    multilineWhenEmpty: boolean
    /**The space or indentation for this array. 4 spaces by default. */
    space: string 

    constructor(name:string|null, multiline:boolean, property:custom.BaseFormatter, multilineWhenEmpty?:boolean, space?:string){
        super(name)
        this.multiline = multiline
        this.property = property
        this.multilineWhenEmpty = multilineWhenEmpty ?? false
        this.space = space ?? "    "
    }

    stringify(data:custom.ValidJsonType[]): string {
        const children = data.map((child,index) => {
            if (typeof child == "undefined") throw new Error(`FJS.ArrayFormatter: Value #${index} of array is 'undefined' which is not allowed in JSON files!`)
            const comma = (data.length == index+1) ? "" : ","
            return this.#indentWithoutFirst(this.property.stringify(child)+comma)
        })

        const key = this.showKey ? `"${this.name}":` : "" 
        const renderFirstMultiline = (children.length > 0 || this.multilineWhenEmpty)
        const value = this.multiline ? `[`+(renderFirstMultiline ? `\n${this.space}` : "")+`${children.join(`\n${this.space}`)}\n]` : `[${children.join("")}]`
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
export class ObjectSwitchFormatter extends custom.BaseFormatter {
    /**A list of all available formatters to check for an object. */
    formatters: custom.ObjectSwitchData[]

    constructor(name:string|null, formatters:custom.ObjectSwitchData[]){
        super(name)
        this.formatters = formatters
    }

    stringify(data:object): string {
        const result = this.formatters.find((formatter) => data[formatter.key] === formatter.value)
        if (!result) throw new Error("FJS.ObjectSwitchFormatter: No formatter matches the given object!")
        const formatter = result.formatter
        
        return formatter.stringify(data)
    }
}