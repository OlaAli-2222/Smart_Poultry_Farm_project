document.addEventListener("DOMContentLoaded", function () {
    // دالة لإنشاء الرسم البياني نصف دائرة
    function createHalfPieChart(ctx, value, color) {
        new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [value, 100 - value],
                        backgroundColor: [color, "#eaeaea"],
                        borderWidth: 0
                    }
                ]
            },
            options: {
                rotation: -90,
                circumference: 180,
                plugins: { tooltip: false, legend: false },
                cutout: "50%"
            }
        });
    }

    // جلب البيانات من API عبر AJAX (Fetch)
    fetch('http://localhost:3000/api/data')
        .then(response => response.json())
        .then(data => {
            // جلب بيانات درجة الحرارة
            let tempData = data.map(item => item.Temperature);
            let timeLabels = data.map(item => item.timestamp);

            // رسم Line Chart للحرارة
            var ctxLine = document.getElementById('tempChart').getContext('2d');
            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [{
                        label: 'Temperature',
                        data: tempData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    }]
                }
            });

            // تحديث Half-Pie Chart للحرارة
            let currentTemp = tempData[tempData.length - 1];  // إحضار آخر درجة حرارة تم تخزينها
            const tempCtx = document.getElementById('tempHalfPie').getContext('2d');
            createHalfPieChart(tempCtx, currentTemp, currentTemp > 70 ? 'red' : 'green');
            
            // إظهار التحذير إذا كانت درجة الحرارة عالية
            const tempAlert = document.getElementById('temp-alert');
            if (currentTemp > 70) {
                tempAlert.style.display = 'block';
            } else {
                tempAlert.style.display = 'none';
            }
        })
        .catch(err => console.log('Error fetching data: ', err));

    // التبديل بين الوضع المظلم والوضع العادي
    const toggleModeBtn = document.createElement("button");
    toggleModeBtn.innerText = "Toggle Dark Mode";
    toggleModeBtn.classList.add("btn", "btn-secondary", "mb-3");
    document.body.insertBefore(toggleModeBtn, document.body.firstChild);

    toggleModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
