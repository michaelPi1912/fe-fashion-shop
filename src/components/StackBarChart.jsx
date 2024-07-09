import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, 
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    scales
} from "chart.js";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

export default function StackedBarChart({labels,cash, paypal}){
    
    const data = {
        labels: labels,
        datasets: [
            {label : 'Cash',
                data: cash,
                backgroundColor :"Blue"
            },
            {label : 'PayPal',
                data: paypal,
                backgroundColor :"Red"
            },
        ]
    }
    const options = {
        scales:{
            x:{
                stacked: true
            },
            y:{
                stacked: true
            }
        }
    }
    
    
    return(
        <div>
            <Bar data={data} options={options} >
            </Bar>
        </div>
    );
}