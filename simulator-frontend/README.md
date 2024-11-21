
# Train Lighting Simulator - Frontend

This is the frontend for the Train Lighting Simulator. It provides a graphical interface to simulate 
industrial communication protocols (e.g., CIP, TRDP) for controlling lighting in trains.

## Features
- Dynamic UI generation based on selected protocol (e.g., CIP, TRDP).
- Displays protocol-specific fields and messages using configuration JSON files.
- Sends control commands to the backend and displays responses.

## Setup Instructions

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn

2. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd train-lighting-simulator/frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Setup JSON Files**
   - Place protocol configuration JSON files (e.g., `CIP.json`, `TRDP.json`) in the `public/protocol-configs/` directory.

5. **Run the Development Server**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

6. **Build for Production**
   To create an optimized production build:
   ```bash
   npm run build
   ```

---

## File Structure
```
frontend/
  public/
    protocol-configs/
      CIP.json
      TRDP.json
  src/
    components/
    App.jsx
    index.jsx
```

## License
This project is licensed under the OAMK License.
