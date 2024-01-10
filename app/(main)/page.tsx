/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '../../types/types';
import { ChartData, ChartOptions } from 'chart.js';
import { useClients } from '../../demo/hook/DataFetcher';
import { calculateSalesDifference, calculateSalesDifferenceMonth, getTotalSalesCurrentMonthDataset, getTotalSalesLastMonthDataset, getTotalSalesLastWeekDataset, getTotalSalesThisWeekDataset, getTotalThisMonthPayments, getTotalThisWeekPayments, getTotalThisYearPayments, getTotalTodayPayments } from '../../demo/lib/calc';
import { formatNumberWithCommas } from '../../demo/lib/currency';

const lineData: ChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
        {
            label: 'Last Week Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'This Week Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const lineDataMonth: ChartData = {
    labels: generateDateLabels(1, 31), // Replace labels with generated date labels
    datasets: [
      {
        label: 'Last Month Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: '#2f4860',
        borderColor: '#2f4860',
        tension: 0.4
      },
      {
        label: 'This Month Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: '#00bb7e',
        borderColor: '#00bb7e',
        tension: 0.4
      }
    ]
  };
  
  // Helper function to generate date labels
  function generateDateLabels(startDay: number, endDay: number): string[] {
    const labels: string[] = [];
    for (let day = startDay; day <= endDay; day++) {
      labels.push(`Day ${day}`);
    }
    return labels;
  }

const Dashboard = () => {
    // const [products, setProducts] = useState<Demo.Product[]>([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    

  
   const [isLoading, setIsLoading, products, setProducts, loadProducts] = useClients()

const dailyPayments= getTotalTodayPayments(products)
const weeklyPayments= getTotalThisWeekPayments(products)
const monthlyPayments= getTotalThisMonthPayments(products)
const yearlyPayments= getTotalThisYearPayments(products)
const weeklyPaymentsDataset= getTotalSalesLastWeekDataset(products)
const thisweeklyPaymentsDataset=getTotalSalesThisWeekDataset(products)
const lastMonthPaymentsDataset=getTotalSalesLastMonthDataset(products)
const thisMonthPaymentsDataset=getTotalSalesCurrentMonthDataset(products)
console.log("dataset",thisMonthPaymentsDataset)

const {
    salesDifference,
    percentageChange,
    status,
    totalLastWeekSales,
    totalThisWeekSales,
  }= calculateSalesDifference(weeklyPaymentsDataset,thisweeklyPaymentsDataset)

  const {
    salesDifferenceMonth,
    percentageChangeMonth,
    statusMonth,
    totalLastWeekSalesMonth,
    totalThisWeekSalesMonth,
  }= calculateSalesDifferenceMonth(lastMonthPaymentsDataset,thisMonthPaymentsDataset)


 

  const positivePercentageChange = Math.abs(percentageChange);
  const positivePercentageChangeMonth = Math.abs(percentageChangeMonth);

  const comparisonStatement = (
    <p>
      You Have <span className={status === 'Rise' ? 'text-green-500' : 'text-red-500'}>{status}</span> of <span className="text-green-500 font-medium">{positivePercentageChange}%</span> which is <span className="text-green-500 font-medium">{formatNumberWithCommas(Math.abs(salesDifference))}{"/="}</span> This Week.
    </p>
  );
  const comparisonStatementMonth = (
    <p>
      You Have <span className={statusMonth === 'Rise' ? 'text-green-500' : 'text-red-500'}>{statusMonth}</span> of <span className="text-green-500 font-medium">{positivePercentageChangeMonth}%</span> which is <span className="text-green-500 font-medium">{formatNumberWithCommas(Math.abs(salesDifferenceMonth))}{"/="}</span> This Month.
    </p>
  );
  console.log(comparisonStatement);
  

const updatedLineData: ChartData = {
    ...lineData, // Spread the existing properties
    datasets: [
      {
        ...lineData.datasets[0], // Spread the existing dataset properties
        data: [...weeklyPaymentsDataset], // Update the data property for the first dataset
      },
      {
        ...lineData.datasets[1], // Spread the existing dataset properties
        data: [...thisweeklyPaymentsDataset], // Update the data property for the second dataset
      },
    ],
  };
  

  const updatedLineDataMoth: ChartData = {
    ...lineDataMonth, // Spread the existing properties
    datasets: [
      {
        ...lineDataMonth.datasets[0], // Spread the existing dataset properties
        data: [...lastMonthPaymentsDataset], // Update the data property for the first dataset
      },
      {
        ...lineDataMonth.datasets[1], // Spread the existing dataset properties
        data: [...thisMonthPaymentsDataset], // Update the data property for the second dataset
      },
    ],
  };


    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    // useEffect(() => {
    //     ProductService.getProductsSmall().then((data) => setProducts(data));
    // }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Today</span>
                            <div className="text-900 font-medium text-xl">{formatNumberWithCommas(dailyPayments)}{"/="}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{"Today's"} </span>
                    <span className="text-500"> Total Revenue</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">This Week</span>
                            <div className="text-900 font-medium text-xl">{formatNumberWithCommas(weeklyPayments)}{"/="}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{"This Week's"}</span>
                    <span className="text-500">Total Revenue</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">This Month</span>
                            <div className="text-900 font-medium text-xl">{formatNumberWithCommas(monthlyPayments)}{"/="}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{"This Month's"} </span>
                    <span className="text-500"> Total Revenue</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">This Year</span>
                            <div className="text-900 font-medium text-xl">{formatNumberWithCommas(yearlyPayments)}{"/="}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{"This Year's"} </span>
                    <span className="text-500"> Total Revenue</span>
                </div>
            </div>
           
           
            {/* <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Top 10 Customers of the week</h5>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                  
                        <Column field="f_name" header="Name" sortable style={{ width: '35%' }} />
                        <Column field="phone" header="Phone" sortable style={{ width: '35%' }} />
                        <Column field="service" header="Service" sortable style={{ width: '35%' }} />
                        <Column field="street" header="Street" sortable style={{ width: '35%' }} />
                        
                       
                    </DataTable>
                </div>
              
            </div> */}

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>{comparisonStatement}</h5>
                    <Chart type="line" data={updatedLineData} options={lineOptions} />
                </div>

               
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>{comparisonStatementMonth}</h5>
                    <Chart type="line" data={updatedLineDataMoth} options={lineOptions} />
                </div>

               
            </div>
        </div>
    );
};

export default Dashboard;
