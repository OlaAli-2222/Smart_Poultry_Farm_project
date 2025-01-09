const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // استيراد مكتبة CORS
const app = express();
const path = require('path');

app.use(cors()); // تمكين CORS للسماح بالوصول من كل المصادر
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pass@2222',
    database: 'smart_poultry_farm',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// واجهة API تستقبل بيانات الإدخال
app.post('/saveData', (req, res) => {
    const { temperature, humidity, co2, nh3 } = req.body;
    const query = `INSERT INTO sensors_data (Temperature, Humidity, CO2, NH3) VALUES (?, ?, ?, ?)`;
    db.query(query, [temperature, humidity, co2, nh3], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            res.status(500).send('Error inserting data');
            return;
        }
        res.status(200).send('Data saved successfully');
    });
});

// واجهة GET لعرض البيانات
app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM sensors_data', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

// تشغيل السيرفر
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
