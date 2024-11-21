
# Train Lighting Simulator - Backend

This is the backend for the Train Lighting Simulator. It simulates communication between 
the Central Train Computer (CTC) and the Remote Device (RD) for protocol-based lighting control.

## Features
- Serves protocol configuration JSON files to the frontend.
- Handles incoming requests for protocol commands and simulates responses.
- Configurable endpoints for multiple protocols (e.g., CIP, TRDP).

## Setup Instructions

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn

2. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd train-lighting-simulator/backend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Server**
   ```bash
   npm start
   ```
   The backend server will start at `http://localhost:5000`.

5. **API Endpoints**
   - `GET /protocol-configs/:protocol`: Serves protocol configuration JSON files.
   - `POST /api/send-message`: Simulates message exchange and provides responses.

6. **Environment Variables**
   Create a `.env` file in the backend directory for configuration:
   ```env
   PORT=5000
   ```

---

## File Structure
```
backend/
  protocol-configs/
    CIP.json
    TRDP.json
  src/
    routes/
    server.js
```

## License
This project is licensed under the OAMK License.
