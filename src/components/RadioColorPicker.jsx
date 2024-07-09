import "../style/sass/color-picker.scss"

export default function RadioColorPicker({colors, setColorPicker}){

    

    return(
        <div className="d-flex">
            {
                colors?.map((color) =>(
                    <div  className="color-picker__item">
                        <input type="radio" id={color} className="color-picker__input" name="color-input"
                        value={color}
                        onChange={e => setColorPicker(e.target.value)}/>
                        <label for={color} className="color-picker__color color-picker__color" style={{background:color=="White"?"#f2f2f2":color}}></label>
                    </div>
                    
                ))
            }
        </div>
        
    );
}