document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('bitcoin-chart').getContext('2d');
  const apiUrl = 'https://api.coindesk.com/v1/bpi/historical/close.json';

  const today = new Date();
  const todayStr = formatDate(today);

  const pastDays = [];
  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    pastDays.unshift(formatDate(date));
  }

  fetch(`${apiUrl}?start=${pastDays[0]}&end=${todayStr}`)
    .then(response => response.json())
    .then(data => {
      const labels = Object.keys(data.bpi);
      const prices = Object.values(data.bpi);

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Курс Bitcoin',
          data: prices,
          backgroundColor: 'rgba(255, 255, 255, 1)', // Set background color with opacity
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 2.2,
          lineTension: 0.4
        }]
      };

      const chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  family: 'Unbounded'
                }
              }
            }
          }
        }
      });

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const maxPriceIndex = prices.indexOf(maxPrice);
    const minPriceIndex = prices.indexOf(minPrice);
    const percentageDifference = ((maxPrice - minPrice) / minPrice) * 100;

    const statisticsList = document.getElementById('statistics-list');
    statisticsList.innerHTML = `
      <li>Максимальная цена (${labels[maxPriceIndex]}): ${Math.floor(maxPrice)}$</li>
      <li>Минимальная цена (${labels[minPriceIndex]}): ${Math.floor(minPrice)}$</li>
      <li>Процентная разница (min-max): ${percentageDifference.toFixed(2)}%</li>
    `;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
