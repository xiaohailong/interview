import Mustache from "mustache";
import CleanCSS from "clean-css";
import Terser from "terser";
import ComponentItem from "@/objects/ComponentItem";
import objects from "@/utils/objects";
import strings from "@/utils/strings";
import Attribute from "@/objects/Attribute";
import RawPage from "@/objects/RawPage";
import templates from "@/templates";
import { SITE_BASE_STYLES } from "@/utils/constants";

// do not escape strings
Mustache.escape = function(text: string): string {
  return text;
};

interface CanvasUtils {
  newComponent: (name: string) => ComponentItem | null;
  findInComponents: (
    components: ComponentItem[],
    id: string
  ) => ComponentItem | null;
  deleteFromComponents: (
    components: ComponentItem[],
    id: string
  ) => ComponentItem | null;
  vueComponentForComponent: (component: ComponentItem) => string;
  renderAllStyles: (components: ComponentItem[]) => string[];
  renderAllScripts: (components: ComponentItem[]) => string[];
  getRenderProps: (components: ComponentItem, includeSlot: boolean) => object;
  renderPage: (components: ComponentItem[]) => RawPage;
  getPageHtml: (title: string, page: RawPage) => string;
  getTrackActions: (components: ComponentItem[] | null) => string[];
}

const canvasUtils: CanvasUtils = {
  newComponent(name): ComponentItem | null {
    if (!name || !templates[name]) return null;
    const t = objects.clone(templates[name]);
    t.id = `${t.name}_${strings.random()}`;
    return t;
  },
  findInComponents(components, id): ComponentItem | null {
    if (!id) return null;

    for (let i = 0, len = components.length; i < len; i++) {
      let parent = components[i];
      if (parent.id === id) {
        return parent;
      }

      let child;
      if (
        parent.children &&
        (child = this.findInComponents(parent.children, id))
      ) {
        return child;
      }
    }

    return null;
  },
  deleteFromComponents(components, id): ComponentItem | null {
    if (!id) return null;
    for (let i = 0, len = components.length; i < len; i++) {
      const component = components[i];

      if (component.id === id) {
        return components.splice(i, 1)[0];
      }

      let c;
      if (
        component.children &&
        (c = this.deleteFromComponents(component.children, id))
      ) {
        return c;
      }
    }

    return null;
  },
  vueComponentForComponent({ version, name }: ComponentItem): string {
    switch (version) {
      case 1:
        switch (name) {
          case "Form":
            return "v1-form-render";
          case "Phone":
            return "v1-phone-render";
          case "Picture":
            return "v1-picture-render";
          case "Text":
            return "v1-text-render";
          case "WhatsApp":
          case "WhtasApp": // TODO: remove this
            return "v1-whats-app-render";
          case "DoubleColumn":
            return "v1-double-column-render";
          case "Album":
            return "v1-album-render";
        }
    }

    return "";
  },
  getRenderProps(component, includeSlot): object {
    const obj = Object.create(null);
    obj["id"] = component.id;

    if (component.attributes && component.attributes.length > 0) {
      component.attributes.forEach(function(attr: Attribute) {
        obj[attr.name] = attr.value;
      });
    }

    if (includeSlot && component.slots && component.slots.length > 0) {
      component.slots.forEach(function(s: string) {
        obj[s] = [];
      });

      if (component.children && component.children.length > 0) {
        const _self = this;
        component.children.forEach(function(c: ComponentItem) {
          if (c.slot && obj[c.slot]) {
            const HTMLTemplate = c.HTMLTemplate;
            const props = _self.getRenderProps(c, includeSlot);
            Mustache.parse(HTMLTemplate);
            const slot = Mustache.render(HTMLTemplate, props);
            obj[c.slot].push(slot);
          }
        });
      }
    }

    return obj;
  },
  renderAllStyles(components): string[] {
    const styles: string[] = [];
    for (let i = 0, len = components.length; i < len; i++) {
      let c = components[i];
      if (c && c.id) {
        const props = this.getRenderProps(c, false);
        Mustache.parse(c.CSSTemplate);
        const style = Mustache.render(c.CSSTemplate, props);
        styles.push(style);

        if (c.children && c.children.length > 0) {
          const childrenStyles = this.renderAllStyles(c.children);
          styles.push(...childrenStyles);
        }
      }
    }

    return styles;
  },
  renderAllScripts(components): string[] {
    const scripts: string[] = [];
    for (let i = 0, len = components.length; i < len; i++) {
      let c = components[i];
      if (c && c.id) {
        if (c.JSTemplate) {
          const props = this.getRenderProps(c, false);
          Mustache.parse(c.JSTemplate);
          const script = Mustache.render(c.JSTemplate, props);
          scripts.push(script);
        }

        if (c.children && c.children.length > 0) {
          const childrenScripts = this.renderAllScripts(c.children);
          scripts.push(...childrenScripts);
        }
      }
    }

    return scripts;
  },
  renderPage(templates): RawPage {
    const renderedComponents: string[] = [];

    const _self = this;
    templates.forEach(function(t: ComponentItem) {
      const props = _self.getRenderProps(t, true);
      renderedComponents.push(Mustache.render(t.HTMLTemplate, props));
    });

    const styles = this.renderAllStyles(templates).join("");
    const scripts = this.renderAllScripts(templates).join("");

    let styleOutput, scriptsOutput;
    if (process.env.NODE_ENV === "production") {
      styleOutput = new CleanCSS().minify(styles).styles;
      scriptsOutput = Terser.minify(scripts).code;
    } else {
      styleOutput = styles;
      scriptsOutput = scripts;
    }

    // https://github.com/stevenvachon/normalize-html-whitespace
    return {
      html: renderedComponents.join("").replace(/[\f\n\r\t\v ]{2,}/g, ""),
      style: styleOutput,
      script: scriptsOutput || ""
    };
  },
  getPageHtml(title, page): string {
    const config = Object.assign({}, page, {
      title
    });

    const template = `
      <html lang="en">
        <head>
          <title>{{ title }}</title>
          <meta charset="utf-8">
          <meta http-equiv=X-UA-Compatible content="IE=edge">
          <meta name=viewport content="width=device-width,initial-scale=1">
          <link rel="stylesheet" href="${process.env.VUE_APP_NORMALIZE_URL}">
          <link rel="stylesheet" href="${process.env.VUE_APP_FONTS_URL}">
          <style type="text/css">
            ${SITE_BASE_STYLES}
          </style>
          <style type="text/css">
            {{ style }}
          </style>
        </head>
        <body>
          <div class="wrapper">
            {{{ html }}}
          </div>
          <script type="text/javascript">
            window.__O_IS_PREVIEW = true;
          </script>
          <script type="text/javascript">
            {{{ script }}}
          </script>
        </body>
      </html>
    `;

    return Mustache.render(template, config);
  },
  getTrackActions(components: ComponentItem[] | null): string[] {
    const actions = new Set<string>();

    if (!components || components.length <= 0) {
      return Array.from(actions);
    }

    for (let i = 0, len = components.length; i < len; i++) {
      const { name, children } = components[i];

      let action = "";
      switch (name) {
        case "Form":
          action = "submit_phone";
          break;
        case "Phone":
          action = "contact_phone";
          break;
        case "WhatsApp":
          action = "contact_whatsApp";
          break;
      }

      if (action) {
        actions.add(action);
      }

      if (children && children.length > 0) {
        const childrenActions = this.getTrackActions(children);

        for (let j = 0, cLen = childrenActions.length; j < cLen; j++) {
          const cAction = childrenActions[i];

          if (cAction) {
            actions.add(cAction);
          }
        }
      }
    }

    return Array.from(actions);
  }
};

export default canvasUtils;
