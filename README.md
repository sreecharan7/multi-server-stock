# Stock Price Update Server using Node.js Pub/Sub Method

This project implements a real-time stock price update server using Node.js with a Pub/Sub (Publish/Subscribe) methodology between servers and publisher . The server subscribes to specific stocks and sends updates to connected clients when the price of these stocks changes. It utilizes Socket.IO for real-time communication between the server and clients.

## Features

- **Real-time Stock Price Updates**: The server fetches stock prices and updates subscribers in real-time.
- **Pub/Sub Methodology**: Utilizes a Pub/Sub pattern to efficiently manage subscriptions and updates between servers
- **Socket.IO Integration**: Enables real-time communication between the server and clients.
- **Scalable Architecture**: Designed for scalability, allowing for easy addition of more servers, stocks and clients.

![Sample Image](https://i.imgur.com/akkhLQF_d.webp?maxwidth=800&fidelity=grand)


## Requirements

- Node.js and redis installed on your machine
- or Docker


## Installation

1. **Clone the Repository**
    ```sh
    git clone https://github.com/sreecharan7/multi-server-stock
    ```

2. **Install NPM Packages**
    ```sh
    cd "stock market reciver"
    npm install
    cd ..
    cd "stock market sender"
    npm install
    ```

3. **Configure Environment Variables**
    Change the environment variables according to your requirements.
4. **Run the Project**
   in one terminal
    ```sh
    cd "stock market reciver" 
    node index.js
    ```
    in sencod terminal
   ```sh
    cd "stock market sender"
    node index.js
    ```

### For Docker

1. **Configure Docker Environment Variables**
    After cloning, change the environment variables needs

2. **Create Docker Volume**
    ```sh
    docker-compose up --build
    ```

### Enjoy the Website!

Visit [http://localhost:3000](http://localhost:3000) in your web browser to access the website.

for docker you can also acess at [http://localhost:3001](http://localhost:3001)


- in this publisher it is not connected to real time stock trader instead used a random genering stock fluctualtion
- you add more stocks at the /stock market sender/index.js (stockNames)
- stock name should be without spaces
