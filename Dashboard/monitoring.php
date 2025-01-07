<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cheeky - Smart Poultry Farm</title>
    <style>
        /* Reset some default styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Forte', sans-serif;
            background-color: #f4f4f4;
            line-height: 1.6;
            color: #000000;
        }
        

        header h1 {
            font-size: 70px;
            font-weight: 700;
            letter-spacing: 5px;
        }

        header p {
            font-size: 1.2rem;
            font-weight: 300;
            margin-top: 10px;
        }

        /* Navigation */
        nav {
            background-color: #FFD93E;
            display: flex;
            justify-content: center;
            padding: 7px 0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        nav a {
            color: white;
            padding: 14px 20px;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        nav a:hover {
            background-color: #1abc9c;
            border-radius: 4px;
        }
</style>
<script>
        window.onload = function () {
            var dps = []; // نقاط البيانات
            var errorDps = []; // نطاق الخطأ
            var xVal = 0;
            var yVal = 100; 
            var updateInterval = 1000; // التحديث كل ثانية
            var dataLength = 20; // عدد النقاط المرئية في الرسم

            // تعريف الرسم البياني
            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "Dynamic Data with Error Range"
                },
                axisY: {
                    title: "Value"
                },
                data: [
                    {
                        type: "line",
                        name: "Data",
                        markerType: "circle",
                        toolTipContent: "X: {x}, Y: {y}",
                        dataPoints: dps
                    },
                    {
                        type: "error",
                        name: "Error Range",
                        toolTipContent: "Error Range: {y[0]} - {y[1]}",
                        dataPoints: errorDps
                    }
                ]
            });

            // تحديث الرسم البياني
            function updateChart(count) {
                count = count || 1;

                for (var i = 0; i < count; i++) {
                    yVal = yVal + Math.round(Math.random() * 10 - 5); // تحديث عشوائي للقيمة
                    var errorMargin = Math.random() * 5; // تحديد هامش الخطأ
                    dps.push({ x: xVal, y: yVal });
                    errorDps.push({ x: xVal, y: [yVal - errorMargin, yVal + errorMargin] });
                    xVal++;
                }

                if (dps.length > dataLength) {
                    dps.shift();
                    errorDps.shift();
                }

                chart.render();
            }

            // استدعاء التحديث
            updateChart(dataLength); // التحديث الأولي
            setInterval(function () { updateChart(); }, updateInterval); // تحديث مستمر
        }
    </script>
</head>
<body>
<nav>
        <a href="#ola.html">Home</a>
        <a href="about.html">About Us</a>
        <a href="services.html">Services</a>
        <a href="contact.html">Contact</a>
        <a href="monitoring.php">Monitoring System</a>

    </nav>
<div id="chartContainer" style="height: 300px; width: 100%;"></div>
<script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</body>
</html>