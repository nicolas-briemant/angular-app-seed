![](https://raw.githubusercontent.com/tom-ripley/angular-app-automation/master/resources/icon-seed.png)

[![Build Status](https://travis-ci.org/tom-ripley/angular-app-seed.svg?branch=master)](https://travis-ci.org/tom-ripley/angular-app-seed)
[![Coverage Status](https://coveralls.io/repos/tom-ripley/angular-app-seed/badge.png)](https://coveralls.io/r/tom-ripley/angular-app-seed)
[![Dependency Status](https://david-dm.org/tom-ripley/angular-app-seed.png)](https://david-dm.org/tom-ripley/angular-app-seed)

Angular app seed. Sort of boilerplate that gets you effective faster.  
Use it as a starting point for your own project.

# Installation

I recommend to fork this repo ([see help here](https://help.github.com/articles/fork-a-repo)).

Then, install dependencies:
```shell
npm install
```

You may want to install [gulp](http://gulpjs.com/) as a global package:
```shell
npm install -g gulp
```

# Usage

Relies on [angular-app-automation](https://github.com/tom-ripley/angular-app-automation)
which provides a useful set of [tasks](https://github.com/tom-ripley/angular-app-automation#task-reference).  

You can start working within seconds with a vanilla development workflow:
```shell
gulp dev
```

Or with unit tests support:
```shell
gulp dev:unit
```

You also have a continuous integration workflow through [travis](https://travis-ci.org) and [coveralls](https://coveralls.io/).

# Conventions

I like working in a modular way.  
The project has an entry point that clearly requires needed modules.  
A module is like a small application that cover specific area of your project.  
Put common stuff in a common folder.

# License

The MIT License (MIT)

Copyright (c) 2014 Tom Ripley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
