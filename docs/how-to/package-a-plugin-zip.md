# Package a plugin zip

Build an installable production copy of Tainacan for another WordPress site.

From the repository root:

```sh
make package
```

The command takes a few minutes. The plugin tree is built inside the builder
container and only `dist/tainacan.zip` is written to the host. Inside the zip
the plugin file is `tainacan/tainacan.php`, which is the layout WordPress
accepts on upload.

`dist/` is gitignored. Upload `dist/tainacan.zip` through Plugins → Add New →
Upload Plugin.

The same command leaves minified assets in `tainacan/src`. Run `make assets`
when you go back to development builds. Development Composer packages are
restored in `tainacan/src/vendor` before the command finishes.
