let myChart = document.getElementById('myChart').getContext('2d');

let massPopChart = new Chart(myChart, {
    type:'bar',
    data:{
        labels:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets:[{
            label: 'Tickets',
            data: [
                1,
                ,
                5,
                9,
                1,
                2,
                3,
                8
            ],
            backgroundColor: '#d1d5db'
        }]
    },
    options:{},

})