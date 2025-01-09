// مثال لحفظ البيانات القادمة من Arduino (ESP32) عبر REST API إلى MySQL

const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');  // استيراد مكتبة للوصول للملفات
app.use(express.json()); // This is for parsing JSON data
app.use(express.static(path.join(__dirname, 'public')));


// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost', // اسم السيرفر إذا كنت تعمل على محلي
    user: 'root', // اسم المستخدم
    password: 'Pass@2222', // الباسورد الذي قمت بتعيينه
    database: 'smart_poultry_farm', // اسم القاعدة التي أنشأتها
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

    // استعلام إدخال البيانات
    const query = `INSERT INTO sensors_data (Temperature, Humidity, CO2, NH3)
                   VALUES (?, ?, ?, ?)`;
    db.query(query, [temperature, humidity, co2, nh3], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');
        res.status(200).send('Data saved successfully');
    });
});

// في السيرفر (API)
app.post('/saveData', (req, res) => {
    const { temperature, humidity, co2, nh3, api_key } = req.body;

    // التحقق من الـ API Key
    if(api_key !== "tPmAT5Ab3j7F9") {
        return res.status(403).send('Invalid API Key');
    }

    // قم بحفظ البيانات في قاعدة البيانات
    const query = `INSERT INTO sensors_data (Temperature, Humidity, CO2, NH3)
                   VALUES (?, ?, ?, ?)`;
    db.query(query, [temperature, humidity, co2, nh3], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');
        res.status(200).send('Data saved successfully');
    });
});


// تشغيل السيرفر
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});



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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Trail.html')); // المسار يجب أن يشير إلى الملف Trail.html
});


