
import React, { useState } from "react";

const Mark = () => {
  const [input,setinput]=useState(0);
  const [result,setResult]=useState("");
  

  function handleChange(e) {
        setinput(e.target.value);
    }
  const handleClick= () =>{
    switch (true) {
    case (input >= 90):
    setResult("O");
    break;
    
    case (input >= 80 && input <90):
    setResult("A");
    break;
    
    case (input >= 70 && input <80):
    setResult("B");
    break;
    
    case (input >= 60 && input <70):
    setResult("C");
    break;

        
    case (input >= 50 && input <60):
    setResult("C");
    break;

    default:
        setResult("fail")

}}
  return(
    <div>
        <label>Enter Mark</label>
            <input value={input} type="number" onChange={handleChange} />
    <button onClick={handleClick}>submit</button>
    <div><p> Result</p><span>{result}</span></div>

    
    </div>
  )
}

export default Mark;