import { useEffect, useState } from "react";


export default function OptionsList({item}){
    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });
    console.log(item.id)
    const [options, setOptions] = useState();
    console.log(options);
    useEffect(
        () =>{
           loadOptions()
        },[]
    )
    const loadOptions = () =>{
    
         fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/${item.id}`,{
    
            }).then(
                res => res.json()
            ).then(
                json => {
                  setOptions(options)
                }
        ) 
    }

    
    return(
        <div className="d-flex flex-column">
            {
                options !== undefined ? options.map((option) => (
                    <p>{option.value}</p>
                )) : <div></div>
            }
        </div>
    );
}