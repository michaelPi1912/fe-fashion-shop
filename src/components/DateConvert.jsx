export default function DateConvert({date}){
    
    const dateConvert = new Date(date);


    return (
        <div  style={{}}>
            {
                date === null?<p></p>:
                <div>{dateConvert.getDate()}/{dateConvert.getMonth() + 1}/{dateConvert.getFullYear()} {dateConvert.getHours()}:{dateConvert.getUTCMinutes() <10? '0'+dateConvert.getMinutes(): dateConvert.getMinutes()}:{dateConvert.getSeconds() <10?'0'+dateConvert.getSeconds(): dateConvert.getSeconds()}</div>

            }
        </div>
    );
}