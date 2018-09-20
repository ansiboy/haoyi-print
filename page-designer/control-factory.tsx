namespace jueying {

    let customControlTypes: { [key: string]: React.ComponentClass<any> | string } = {}
    let allInstance: { [key: string]: Control<any, any> } = {};

    export class ControlFactory {

        private static getControlType(componentName: string): Promise<React.ComponentClass<any>> {
            return new Promise<React.ComponentClass<any>>((resolve, reject) => {
                let controlType = customControlTypes[componentName];
                if (typeof controlType != 'string') {
                    resolve(controlType);
                    return;
                }

                let controlPath = controlType;
                requirejs([controlPath],
                    (exports2: any) => {
                        let controlType: React.ComponentClass = exports2['default'];
                        if (controlType == null)
                            throw new Error(`Default export of file '${controlPath}' is null.`);

                        (controlType as any)['componentName'] = componentName;
                        customControlTypes[componentName] = controlType;
                        resolve(controlType);
                    },
                    (err: Error) => reject(err)
                )
            })
        }

        private static exportElement(element: React.ReactElement<any>): ElementData {
            let controlType = element.type;
            console.assert(controlType != null, `Element type is null.`);

            let id = element.props.id as string;
            let name = typeof controlType == 'function' ? this.getComponentNameByType(controlType) : controlType;
            let data = this.trimProps(element.props);

            if (name == null)
                throw new Error('Can not get component name')

            let childElements: Array<React.ReactElement<any>> | null = null;
            if (element.props.children) {
                childElements = Array.isArray(element.props.children) ?
                    element.props.children : [element.props.children];
            }

            let result: ElementData = { type: name, props: { id }, children: [] };
            result.props = data;

            if (childElements) {
                result.children = childElements.map(o => this.exportElement(o));
            }
            return result;
        }

        private static getComponentNameByType(type: React.ComponentClass<any> | React.StatelessComponent<any>) {
            for (let key in customControlTypes) {
                if (customControlTypes[key] == type)
                    return key;
            }

            return null;
        }

        private static trimProps(props: any) {
            let data: { [key: string]: any } = {};
            let skipFields = ['id', 'componentName', 'key', 'ref', 'children'];
            for (let key in props) {
                let isSkipField = skipFields.indexOf(key) >= 0;
                if (key[0] == '_' || isSkipField) {
                    continue;
                }
                data[key] = props[key];
            }
            return data;
        }

        static create(args: ElementData, designer?: PageDesigner): React.ReactElement<any> | null {
            try {
                let c = customControlTypes[args.type];

                let type: string | React.ComponentClass = args.type;
                let componentName = args.type;
                let controlType = customControlTypes[componentName];
                if (controlType) {
                    type = controlType;
                }

                let children = args.children ? args.children.map(o => this.create(o, designer)) : null;

                return React.createElement(DesignerContext.Consumer, { key: guid(), children: null as any },
                    (context: DesignerContextValue) => {
                        let props = {}
                        try {
                            props = JSON.parse(JSON.stringify(args.props));
                        }
                        catch (e) {
                            debugger;
                        }
                        return React.createElement(type, props, children);
                    }
                );
            }
            catch (e) {
                console.error(e);
                return null;
            }

        }



        static register(controlType: React.ComponentClass<any>): void
        static register(controlName: string, controlType: React.ComponentClass<any>): void
        static register(controlName: string, controlPath: string): void
        static register(controlName: any, controlType?: React.ComponentClass<any> | string): void {
            if (controlType == null && typeof controlName == 'function') {
                controlType = controlName;
                controlName = (controlType as React.ComponentClass<any>).name;
                (controlType as any)['componentName'] = controlName;
            }

            if (!controlName)
                throw Errors.argumentNull('controlName');

            if (!controlType)
                throw Errors.argumentNull('controlType');

            customControlTypes[controlName] = controlType;
        }

        static loadAllTypes() {
            let ps = new Array<Promise<any>>();
            for (let key in customControlTypes) {
                if (typeof customControlTypes[key] == 'string') {
                    ps.push(this.getControlType(key));
                }
            }

            return Promise.all(ps);
        }

        static createElement(control: Control<any, any>, type: string | React.ComponentClass<any>,
            props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]) {
            if (control != null && control.isDesignMode != null)
                return ControlFactory.createDesignTimeElement(control, type, props, ...children);

            return ControlFactory.createRuntimeElement(control, type, props, ...children);
        }

        static createDesignTimeElement(control: Control<any, any>, type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]) {
            props = props || {};

            if (props.id != null)
                props.key = props.id;

            if (type == 'a' && (props as any).href) {
                (props as any).href = 'javascript:';
            }
            else if (type == 'input' || type == 'button') {
                delete props.onClick;
                (props as any).readOnly = true;
            }
            return React.createElement(type, props, ...children)
        }

        private static createRuntimeElement(instance: Control<any, any>, type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]) {
            if (props != null && props.id != null)
                props.key = props.id;

            return React.createElement(type, props, ...children);
        }
    }


}