const express = require('express');
const app = express();

// ليتمكن التطبيق من معالجة البيانات بصيغة JSON
app.use(express.json());

// إنشاء نقطة نهاية (endpoint) لتعامل مع الطلبات
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello from Smart Poultry Farm API!',
    });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
