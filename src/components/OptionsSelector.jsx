import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

export default function OptionSelector({index,variation, optionList,setOptionList}){

    const [admin,setAdmin] = useState(() =>{
        const saved = localStorage.getItem("admin-info");
        const initialValue = JSON.parse(saved);
        return initialValue || undefined;
    });

    const [options, setOptions] = useState();
    // console.log(index)
    const [option, setOption] =useState();

    useEffect(() =>{
        loadOptions()
        
    },[])
    // console.log(option);
    const loadOptions = () =>{
    
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/option/${variation.id}/options`,{
            headers: {
                'Authorization' : `Bearer ${admin.access_token}`
            }
            }).then(
                res => res.json()
            ).then(
                json => {
                  setOptions(json)
                  setOption(json.optionList[0]?.id)
                  setOptionList(cur =>json.optionList[0]?.id !==undefined? [...cur,json.optionList[0]?.id] : cur)
                }
        )    
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label>{variation?.name}</Form.Label>
            <Form.Select defaultValue={option} onChange={(e) => {
                setOptionList(cur => cur.filter(i => i!== option));
                setOptionList(cur =>[...cur, e.target.value]);
                setOption(e.target.value)
            }}>
                {
                    options!== undefined ? options.optionList.map((item) =>(
                        <option value={item.id}>{item.value}</option>
                    )) : <option value=""></option>
                }
            </Form.Select>
        </Form.Group>
    );


}