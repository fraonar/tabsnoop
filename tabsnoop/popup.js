// popup.js

let timeSpentChart; // Declare chart globally to update it

document.addEventListener('DOMContentLoaded', async () => {
    await renderChart();
    document.getElementById('clearData').addEventListener('click', clearAllData);
});

async function fetchDataAndAggregate() {
    const data = await chrome.storage.local.get(null); // Get all stored data
    const aggregatedData = {};
    let totalTimeToday = 0;

    const today = new Date().toDateString();

    for (const domain in data) {
        if (data.hasOwnProperty(domain)) {
            const domainData = data[domain];
            aggregatedData[domain] = domainData.totalTime;

            // Calculate total time for today
            domainData.visits.forEach(visit => {
                const visitStart = new Date(visit.start).toDateString();
                if (visitStart === today) {
                    totalTimeToday += (visit.end - visit.start);
                }
            });
        }
    }
    return { aggregatedData, totalTimeToday };
}

async function renderChart() {
    const { aggregatedData, totalTimeToday } = await fetchDataAndAggregate();

    const labels = Object.keys(aggregatedData);
    const dataValues = Object.values(aggregatedData);

    const siteList = document.getElementById('siteList');
    siteList.innerHTML = ''; // Clear previous list

    // Sort data for display
    const sortedSites = labels.map((label, index) => ({
        domain: label,
        time: dataValues[index]
    })).sort((a, b) => b.time - a.time);

    sortedSites.forEach(site => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${site.domain}</strong>: ${formatTime(site.time)}`;
        siteList.appendChild(li);
    });

    document.getElementById('totalTimeToday').textContent = formatTime(totalTimeToday);

    const ctx = document.getElementById('timeSpentChart').getContext('2d');

    if (timeSpentChart) {
        timeSpentChart.destroy(); // Destroy existing chart before creating a new one
    }

    timeSpentChart = new Chart(ctx, {
        type: 'bar', // Or 'pie'
        data: {
            labels: labels,
            datasets: [{
                label: 'Time Spent (milliseconds)',
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 126, 0.7)',
                    'rgba(117, 150, 185, 0.7)',
                    'rgba(205, 92, 92, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 126, 1)',
                    'rgba(117, 150, 185, 1)',
                    'rgba(205, 92, 92, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time Spent (milliseconds)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatTime(value); // Format y-axis labels
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatTime(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

async function clearAllData() {
    if (confirm("Are you sure you want to clear all stored data? This action cannot be undone.")) {
        await chrome.storage.local.clear();
        console.log("All TabSnoop data cleared.");
        await renderChart(); // Re-render chart with empty data
        document.getElementById('totalTimeToday').textContent = "00:00:00";
        document.getElementById('siteList').innerHTML = '<li>No data to display.</li>';
    }
}