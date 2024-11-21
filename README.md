
# Train Lighting Simulator

This project is developed as part of the OAMK DIN22SP group for the company **Teknoware** based in **Oulu, Finland**. The project aims to simulate industrial communication protocols (e.g., CIP, TRDP) for controlling lighting systems in trains.

## Purpose

The purpose of this project is to develop a web-based simulator that helps in testing and simulating the lighting control scenarios in trains. It emulates communication between the Central Train Computer (CTC) and Remote Device (RD) through different industrial protocols, allowing operators to control and monitor train lighting systems.

## Features

- **Protocol Simulator**: Simulates communication between the CTC and RD using different protocols (CIP, TRDP).
- **Dynamic UI**: The UI changes based on the protocol selected by the user.
- **Lighting Control**: The system allows users to simulate lighting control commands for different areas (e.g., first-class, second-class).
- **Backend Communication**: The backend processes protocol-specific commands and sends simulated responses to the frontend.

## Author

- **Shovan Das**  
  Third-year IT student at OAMK, Finland  
  Project for **Teknoware**, Oulu, Finland

## Technologies Used

- **Frontend**: React, JavaScript, Bootstrap
- **Backend**: Node.js, Express
- **Protocols**: CIP, TRDP (as examples)

## Setup Instructions

### **Frontend**

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd train-lighting-simulator/frontend
   ```
   
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm start
   ```

4. **Access the application** at `http://localhost:3000`.

### **Backend**

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd train-lighting-simulator/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the backend server**:
   ```bash
   npm start
   ```

4. **Access the server** at `http://localhost:5000`.

## License

This project is licensed under the MIT License.

