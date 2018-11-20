
# GNOME Shell Extension: Outta Space

This GNOME Shell extension can be seen as a minimalistic extension
that enhances the GNOME Shell for space usage on smaller screens
(e.g. Laptop displays).

# Requirements

This GNOME Shell extension requires `gnome-shell` version `3.30+`
and `xprop` version `1.2.3+`. The `xprop` tool is required to
allow maximized windows to be displayed without window decorations.

# AUR Installation (Arch Linux)

```bash
trizen -S gnome-shell-extension-outta-space-git;
```


# Manual Installation (Arch Linux)

```bash
git clone https://github.com/cookiengineer/gnome-shell-extension-outta-space.git;

cd ./gnome-shell-extension-outta-space/package/arch;

makepkg -s;

sudo pacman -U gnome-shell-extension-outta-space-*.pkg.tar.xz;
```


# Development Help

Use the `[Alt]+[F2]` and `r` trick to restart the GNOME shell.

Sadly, looking glass (the `lg` GNOME command) is a major design
fail when it comes to debugging extensions, because its window
will stay on top and keep the focus, so you cannot do anything
while inspecting the GTK tree.

In order to work with the extension's source code, you can also symlink
the `/source` folder into your local shell extensions like so:

```bash
cd $HOME/.local/share/gnome-shell/extensions;

ln -s ~/Software/cookiengineer/gnome-shell-extension-outta-space/source outta-space@cookie.engineer;
```

Debugging Instructions:

1. Enable the `Outta Space` extension in `gnome-tweaks`.
2. Debug the extension by watching the output using `journalctl`.
3. Restart the `gnome-shell` after code changes via `[Alt]+[F2]` and `r`,
   the output in the "Debug Terminal session" will change on-the-fly.

```bash
journalctl /usr/bin/gnome-shell -f -o cat;
```


# License

GPL3

