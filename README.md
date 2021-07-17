# Strapi - EditorJS plugin

A plugin for [Strapi Headless CMS](https://github.com/strapi/strapi) that provides EditorJS as default WYSIWYG editor

### ⏳ Installation

```bash
npm i strapi-plugin-k-editorjs@latest --save
```

After successful installation the **EditorJS** should appear as default WYSIWYG editor. Enjoy 🎉

### 🖐 Requirements

Complete installation requirements are exact same as for Strapi itself and can be found in the documentation
under <a href="https://strapi.io/documentation/v3.x/installation/cli.html#step-1-make-sure-requirements-are-met">
Installation Requirements</a>.

**Supported Strapi versions**:

- Strapi v3.6.5 (recently tested)
- Strapi v3.x

(This plugin may work with the older Strapi versions, but these are not tested nor officially supported at this time.)

Also, you've to configure API permissions for this plugin to be able to work with image block. [How to configure image plugin](#configure_image_plugin)

## Supported blocks

- [Paragraph](https://github.com/editor-js/paragraph)
- [Header](https://github.com/editor-js/header)
- [Quote](https://github.com/editor-js/quote)
- [Delimiter](https://github.com/editor-js/delimiter)
- [List](https://github.com/editor-js/nested-list)
- [Checklist](https://github.com/editor-js/checklist)
- [Embed](https://github.com/editor-js/embed)
- [Table](https://github.com/editor-js/table)
- [Code](https://github.com/editor-js/code)
- [Image](https://github.com/editor-js/image) ([How to configure image plugin](#configure_image_plugin))
- MediaLibrary (Custom block for Strapi MediaLibrary)

## <a name="configure_image_plugin"></a>How to configure Image block to work properly

EditorJS Image plugins requires API to be able to upload images. This Strapi plugin contains this API. By default, authenticated users won't be able to use this API. So you've to give permissions to authenticated users.

To do this:
1. Open administration panel
1. Go to Settings
1. Go to Roles page of Users & Permissions plugin and start edit permissions for Authenticated role
1. Find permissions for EditorJS in permissions list and choose "Select all"
1. Save changes

## Contributing

Feel free to fork and make a Pull Request to this plugin project. All the input is warmly welcome!

## Community support

For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
For additional help, you can use one of these channels to ask a question:

- [GitHub](https://github.com/Koptelnya/strapi-plugin-k-editorjs/issues) (Bug reports, Contributions, Questions and
  Discussions)

## License

[MIT](LICENSE)
