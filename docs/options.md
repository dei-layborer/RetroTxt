# RetroTxt - Options

The Options dialogue lets you select a wide variety of font, colour and size combinations that RetroTxt will use when theming text in the browser. As well as several behaviour configurations, to automate the execution of RetroTxt when it encounters text files.

In Chrome, Brave and Edge, you launch the Options dialogue by right-clicking the RetroTxt toolbar button and selecting **Options**.

![Line height selection](assets/retrotxt_toolbar_button_chrome.png)

With Firefox the Options dialogue is accessed from the Extensions tab.
To do this, in a new tab, enter the address `about:addons` and select **Extensions**.
Then click the Options button under the RetroTxt listing.

- [Fonts](#fonts)
- [Display](#display)
- - [Colour pair](#pair)
- - [Custom colour values](#custom)
- - [Line height](#line-height)
- - [Centre align text](#center-text)
- - [ANSI 80 column wrap](#column-wrap)
- - [ANSI iCE colors](#ice-colors)
- - [Smear block characters](#smear-blocks)
- - [DOS control glyphs](#dos-glyphs)
- - [Background scanlines](#scanlines)
- - [Text render](#text-render)
- [Config](#config)
- - [Information header](#info-header)
- - [Apply RetroTxt to any text files hosted on these websites](#websites)
- - [Apply RetroTxt to any local text files](#local)
- - [Apply RetroTxt to any downloaded text files](#downloads)
- - [API permissions granted](#api)

<a id="fonts"></a>

# Fonts

![Font options selection](assets/options_fonts.png)

RetroTxt has 25 different monospaced font choices to apply to text. Some fonts have `⇆` wide and `⇅` tall variants.
Those listed in the left pane are IBM PC, IBM PS/2 and Microsoft DOS system fonts while the ones on the right belong to other home computer systems.

The _Browser_ **Monospace** _fixed-width_ selection uses a monospace font configured by the browser. This font selection is selectable within the browser under the _font_ settings.

![Chrome browser fixed-width font selection](assets/chrome_fixed-width_font.png)

<a id="display"></a>

# Display

![Display behaviour checks](assets/options_display_behavior.png)

<a id="pair"></a>

## Colour pair

![Colour pair](assets/options_colour_pair.png)

The Colour pair menu allows you to apply colour to text and a background theme to all characters handled by RetroTxt. These pairs are also base colours for colourising ANSI text.

The ordered choices are in three categories. **Systems** are recreations of ancient computer operating systems.
**Dark** and **Light** correspond to colours used on either a black (Dark) or white (Light) background.

The RGB values of these colour pairs are in the source code `\css\text-colors.css`

- **MS-DOS** uses VGA grey text on black.
- **Windows** is themed on the `notepad.exe` program and uses black text on white.
- **Apple II** uses the Apple home computer for inspiration.
- **Amiga** based on the Commodore Amiga Workbench with white text on grey.
- **Atari ST** uses the Atari TOS operating system colour pair black text on white.
- **C-64** based on the Commodore 64 boot screen with a light on a dark blue colour pair.

![Font options selection](assets/theme_ms-dos.png) ![Font options selection](assets/theme_windows.png) ![Font options selection](assets/theme_amiga.png) ![Font options selection](assets/theme_appleii.png) ![Font options selection](assets/theme_c64.png) ![Font options selection](assets/theme_atari-st.png)

<a id="custom"></a>

## Custom colour values

Allows you to supply both a foreground and background colour value for the Color pair which must be **Other** > **Custom**. The
values given can either be a **hex**, **RGB**, **HSL** or **keyword** value.

- **Hex** values must begin with a `#` hashtag, i.e `#000000`
- **RGB** values must be in the `RGB()` notation, i.e `rgb(0,0,0)`
- **HSL** values must be in the `HSL()` notation, i.e `hsl(0,0%,0%)`
- **Keyword** value must be a [valid CSS keyword](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords), i.e `white`

<a id="line-height"></a>

## Line height

![Line height selection](assets/options_line_height.png)

Line height lets you add padding to each line of text. The amount of padding used is dependent on the size of the font.
A **25%** line height would introduce padding 1/4 of the height of the font.
A **1x** (100%) value would pad the same height as the font in use.

<a id="ice-colors"></a>

## ANSI iCE colors

Default ANSI offers 16 static foreground colours, eight blinking foreground colours and eight background colours.

The _iCE Color mode_ also called the _non-blink mode_, removes the eight blinking colours and replaces them with a new eight backgrounds to offer 16 static foreground and 16 background colours.

<a id="smear-blocks"></a>

## Smear block characters

_This option is only revealed on the Windows operating system._

Due to Windows font smoothing, browsers display vertical line artefacts when showing block characters in sequences. This option implements a `text-shadow: 1px` property to all block characters `◘░▒▓█▄▐▌▀■` in an attempt to correct this at the expense of additional memory usage.

<a id="dos-glyphs"></a>

## DOS control glyphs

The PC/MS-DOS _Code Page 437_ is not entirely standards compliant as it uses C0 characters usually reserved for common formatting controls to display character glyphs.
As such, these characters are never shown but enabling this option will reveal these glyphs in the text document.

◘ <small>_= backspace_</small>
○ <small>_= tab_</small>
♪ <small>_= carriage return_</small>
→ <small>_= end of file_</small>
⌂ <small>_= delete_</small>

<a id="scanlines"></a>

## Background scanlines

Apply a subtle scan line effect to the backdrop of the page. The result is more pronounced on light backgrounds and ignores the text.

<a id="text-render"></a>

## Text render

### Normal

Lets the host operating system or browser handle the font smoothing.

![Normal text render](assets/text_render_normal.png)

### Shadowed

Apply a subtle shadow effect on each character.

![Shadowed text render](assets/text_render_shadowed.png)

<a id="config"></a>

# Config

![Execution behaviour checks](assets/options_execution_behavior.png)

<a id="websites"></a>

<a id="info-header"></a>

## Information header

When styling text RetroTxt injects a text header detailing the document metadata and font information.
You can hover the mouse over its text for a brief description of each value.

![Example text & font information header](assets/options_header_example.png)

`▲ ▼`

The up triangle will hide the information header while the down triangle will display it.

`640x544`

These are the _width_ x _length_ values.
The width is the number of pixels used from left to right.
The length is the number of pixels used from top to bottom.

`26.2kB`

Size values are the number of characters contained in the text measured as a decimal unit.

`CP1252`

These values identify the document character encoding set by the browser.

`CP437`

The secondary character encoding used to display the document.
Character encoding is a complicated subject and the execution not always precise.
If you encounter a page that is not showing the expected characters, you can transcode the document to apply a different set of characters and its technical name will be displayed here.

- **CP437** IBM/MS-DOS Code Page 437
- **CP1252** Code Page 1252 commonly used in legacy Microsoft Windows systems
- **ISO8859-1** ISO-8859 Part 1: Latin alphabet No. 1 alternatively known as ECMA-94
- **ISO8859-5** ISO-8859 Part 5: Latin alphabet No. 5
- **ISO8859-15** ISO-8859 Part 15: Latin alphabet No. 9
- **UTF-8** Universal Coded Character Set 8-bit
- **US-ASCII** Plain text, alternatively known as ASA X3.4, ANSI X3.4, ECMA-6, ISO/IEC 646

`VGA8`

The font name in use.

### Additional information may include

`ANSI`

A value that shows unique controls or functions embedded in the text, ANSI art uses ANSI control sequences, while ASCII art doesn't use any other sequences.

- **ANSI** ECMA-48/ANSI X3.64 presentation control and cursor functions
- **PCBoard** PCBoard BBS text colourisation
- **Wildcat!** Wildcat! BBS text colourisation

`1 unknown control found`

Highlights any errors or warnings encountered when parsing ANSI encoded text.

[SAUCE metadata](http://www.acid.org/info/sauce/sauce.htm) may also be in the header.
_Standard Architecture for Universal Comment Extensions_ is often found in ANSI art but can be attached to any document and allows the author to include titles, dates, comments and affiliations.

<a id="center-text"></a>

## Centre align text

This toggle positions the text document from the left-top margin to the centre of the display.

<a id="column-wrap"></a>

## ANSI 80 column wrap

Enabled by default, this enforces an 80 column (characters) width limit for all ANSI files, unless [SAUCE](http://www.acid.org/info/sauce/sauce.htm) width information exists.

Legacy artworks often expect an 80x25 character terminal screen and don't include proper newline characters or positioning information.

## Apply RetroTxt to any text files hosted on these websites

If check the WebExtension runs in the background and applies RetroTxt to all text files served by websites listed in the textbox.
You can add additional sites to this list by including their domain name appended by a semicolon, for example.

- [Defacto2](https://defacto2.net) `defacto2.net;`
- [Gutenberg.org](https://www.gutenberg.org) `gutenberg.org;`
- [Scene.org](https://www.scene.org) `scene.org;`

`defacto2.net;gutenberg.org;scene.org;`

Erasing the textbox content will reset the website list to the RetroTxt defaults.

<a id="local"></a>

## Apply RetroTxt to any local text files

Web browsers can load and display documents stored in a computer file system using the [`file:///`](file:///) protocol.
With this option checked the WebExtension runs in the background.
It applies RetroTxt to all text files that are served using the [`file:///`](file:///) protocol, allowing you to use RetroTxt as an offline NFO, ANSI and ASCII viewer.

<a id="downloads"></a>

## Apply RetroTxt to any downloaded text files

With this option, the WebExtension will monitor all your file downloads to attempt to apply RetroTxt to all saved text.
It is the browser that determines which files are binary or text so the results could be wrong.

Firefox does not support the feature.

<a id="api"></a>

## API permissions granted

A complete list of all the API features that RetroTxt has permission to access. Please read the [privacy policy](privacy) for the information obtained and why.

## [Page and toolbar menus](menus)