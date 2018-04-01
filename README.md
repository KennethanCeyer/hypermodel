<h1 align="center">hypermodel</h1>

<p align="center">related model ui builder</p>

<p align="center"><a href="https://nodei.co/npm/formulize/"><img src="https://nodei.co/npm/formulize.png" alt="NPM"></a></p>

<p align="center">
    <a href="https://badge.fury.io/js/hypermodel"><img src="https://badge.fury.io/js/hypermodel.svg" alt="npm version"></a>
    <a href="https://github.com/KennethanCeyer/HyperModel/stargazers"><img src="https://img.shields.io/github/stars/KennethanCeyer/HyperModel.svg" alt="GitHub stars"></a>
    <a href="https://github.com/KennethanCeyer/hypermodel/blob/master/LICENSE"><img src="https://img.shields.io/github/license/KennethanCeyer/HyperModel.svg" alt="GitHub license"></a>
    <a href="https://gitter.im/KennethanCeyer/PIGNOSE?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img src="https://badges.gitter.im/Join%20Chat.svg" alt="Join the chat at https://gitter.im/KennethanCeyer/PIGNOSE"></a>
</p>


## Getting started

HyperModel helps you make related model design by jQuery.

You can drag and swap each of grids and properties.

[Check demo page](http://www.pigno.se/barn/PIGNOSE-HyperModel)

![Sample](http://www.pigno.se/barn/PIGNOSE-HyperModel/demo/images/screenshot_main.png)

## Example

```javascript
$('.hypermodel-container').hypermodel({
    time: {
        animate: 300,    // The line animation time when either window resize event be fired or user playing with drag&drop.
        frame: 3000      // The dash line's dash moving total seconds.
    },
    grad: 1,             // The gradient of line 0.1(curve), 10(straight).
    strokeSpeed: 500,    // How many dash line moves one second.
    strokeColor: 'rgba(192, 192, 192, .5)',     // Default line color (rgba, rgb, hash color).
    strokeDashColor: 'rgba(60, 180, 148, .65)', // Dash line color (rgba, rgb, hash color).
    strokeWidth: 1,      // Default line thickness (px).
    strokeDashWidth: 1,  // Dash line thickness (px).
    strokeDashWeight: 8, // Each of dash dottes's length (px).
    strokeDashMargin: 6  // Gap about each of dash line's dottes (px).
});
```

----

### License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
