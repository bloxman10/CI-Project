const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Serve static files from root folder
app.use(express.static(__dirname));

const USERS_FILE = "./users.json";

function readUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ✅ Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (!username || !password) {
        return res.status(400).json({ message: "Fill all fields" });
    }

    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }

    users[username] = password;
    writeUsers(users);

    res.json({ message: "Registered successfully" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users[username] !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
