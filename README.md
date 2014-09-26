![](https://raw.githubusercontent.com/tom-ripley/angular-app-automation/master/resources/icon-seed.png)

[![Dependency Status](https://david-dm.org/tom-ripley/angular-app-seed.png)](https://david-dm.org/tom-ripley/angular-app-seed)

Angular app seed. Sort of boilerplate that get you effective faster.  
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

Relies on [angular-app-automation](https://github.com/tom-ripley/angular-app-automation).  

You can start working within seconds:
```shell
gulp dev
```

With unit tests:
```shell
gulp dev:unit
```

# Conventions

I like working in a modular way.  
The project has an entry point that clearly requires needed modules.  
A module is like a small application that cover specific area of your project.  
Put common stuff in a common folder.

# Todo

- Configure travis and coveralls.

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
