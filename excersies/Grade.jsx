import React, { useState } from "react";

const Grade = () => {
  const [input,setinput]=useState(0);
  const[result,setResult]=useState("");
   function handleChange(e) {
        setinput(e.target.value);
    }
  const handleClick =() =>{
    if (input >= 90) { 
      setResult("O");
}

else if ((input >= 80 && input <90)) {
  setResult ("A");
} 
else if ((input >= 70 && input <80)) {
  setResult ("B");
} 
else if ((input >= 60 && input <70) ) {
  setResult ("C");
} 
else if ((input >= 50 && input <60)){
  setResult("D");
}
else {

   setResult("Fail")
}
  }
  return(
  <div>
    <label>Enter Mark</label>
            <input value={input} type="number" onChange={handleChange} />
    <button onClick={handleClick}>submit</button>
    <div><p> Result</p><span>{result}</span></div>

    
  </div>
  )
}

export default Grade;
