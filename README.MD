# Handlebars project prototype

## Introduction and purpose
This code can serve as a generic basic for rapid prototyping of static HTML sites. It tries to totally separate content from structure via the use of JSON data inside Handlebar templates. It should be very useful for prototypes that make extensive use of a component based design.

* Each component can be created in the code as a Handlebar partial with its own HTML structure, CSS and necessary content variables. It can than be reused on any page as often as needed.
* Each defined page is free to have any component in any order between its header and footer without making any assumptions. It will run through the json data to be built with maximum flexibility.
* Components can be nested and call each other, which can be useful for more complex sections like Sliders, accordions, etc.

## Where to find stuff

The project consists of two basic important folders: "app" and "dist"

In "app" you will find everything to create the prototype and change its content or configuration

In "dist" you will find the static generated HTML pages which can be looked at in any browser. Please not that no compability testing has been done for the purpose of this example code. The "dist" folder does not rely on the "app" folder in order to be presented and could be sent as a zip for example to anyone who needs check the output

## Status
The code shown here is an example only with no warranties and should be seen as work in progress. It is not feature complete, extensively tested or ready for any live page without further enhancements.

## Local development environment

1. Open Terminal
2. Enter the project directory

```
    cd ~/my/project/location
```

3. Install project dependencies using [NPM/NVM](https://github.com/creationix/nvm#install--update-script)

```
    npm i
```
4. Execute initial Gulp proccess
```
    gulp build
```
5. Execute Gulp local server. It will update it's output on project file changes.
```
    gulp
```
