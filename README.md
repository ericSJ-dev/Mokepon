# Description

This project is a game where you have a pet and use it to defeat an opponent. Your pet will have five attacks that you need to combine in the best way possible to win. You have three different pets to choose from, and your opponent will be another player on the map. This project was made using Node.js for the server, HTML and CSS for the design, and JavaScript for the logic functions.

Take a look at the code!

### Screenshots 
Here you choose your pet:

![mokeprincip](https://github.com/user-attachments/assets/d175d855-1d6d-471d-803b-fec30e405663)

Here is the map where you locate your pet and other players' pets:

![mokejueg](https://github.com/user-attachments/assets/bdac311a-108f-4e1f-9a03-4e50f1fb7c29)

Then we have the screens with the attacks where you choose them to play:

![atscren](https://github.com/user-attachments/assets/5fa55e7a-26d6-4c64-b231-32631105a7a3)

![atscreen2](https://github.com/user-attachments/assets/a6879826-6500-4109-b20c-6ed50fa7b021)

### Instructions

First of all, you'll need some basic tools to run this project:
* A code editor, i am currently using VS Code. Link: https://code.visualstudio.com/download
* The Java Development Kit (JDK) already installed on your computer. Link: https://www.oracle.com/co/java/technologies/downloads/#jdk24-windows
* Node.js already installed on your computer. Link: https://nodejs.org/en/download

To run the project you need to use the command line of your system or the one in your code editor.

* First, you have to locate the folder where you saved the project and go to that directory using the "cd" command followed by the path where you saved the project. For example:
```
cd /Users/YOU/mokepon
```

* Then, you need to install all the required packages from Node.js using "npm install"

```
npm install
```

* Now, you need to configure the "mokepón.js" file with your specifications, located in `js/mokepón.js` at lines 25 and 26 of the code:

```
let serverIp = "192.168.0.0"  
let serverPort = "8080"       
```

**You need to change the current IP and put yours, but you don't need to change the port unless necessary**

* After saving those changes, you have to run the server using:

```
node server.js
```

* After that you only need to open the file `index.html` in your browser.
* If you want to run it on other devices you need to connect the device to the same internet network, open the browser and type your network with the port like this example "yourIp:ThePort"

```
192.168.0.0:8080
```
