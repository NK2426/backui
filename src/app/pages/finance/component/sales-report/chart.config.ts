
export const miniChartConfig = [{
    icon: 'bx bx-archive-in',
    title: 'Total Orders',
    value: '0'
},
{
    icon: 'bx bx-dollar',
    title: 'Total Amount(Rs)',
    value: '0'
}, {
    icon: 'bx bx-happy-heart-eyes',
    title: 'Confirmed Order(s)',
    value: '0'
}, {
    icon: 'bx bx-confused',
    title: 'Pending Order(s)',
    value: '0'
}];


export let columnChartInitialConfig: any = {
    series: [
        {
            name: "Confirmed",
            data: []
        },
        {
            name: "Pending",
            data: []
        }
    ],
    chart: {
        type: "bar",
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
    },
    xaxis: {
        categories: [
        ]
    },
    yaxis: {
        title: {
            text: "Total Orders"
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {

    }
};