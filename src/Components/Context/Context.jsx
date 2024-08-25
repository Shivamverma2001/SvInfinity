import { createContext, useState } from "react";
import run from "../../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{

    const[input,setInput] = useState("");
    const[recentPrompt,setRecentPrompt] = useState("");
    const[prevPrompts,setPrevPrompts] = useState([]);
    const[showResult, setShowResult] = useState(false);
    const[loading,setLoading] = useState(false);
    const[resultData,setResultData] = useState("");

    const delayParam = (index, nextWord) => {
        setTimeout(function(){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }

    const onSent = async (prompt) =>{
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
        const response = await run(input);
        let responesArray = response.split("**");
        let newResponse="";
        for(let i=0;i<responesArray.length;i++){
            if(i===0 || i%2!==1){
                newResponse+=responesArray[i];
            }else{
                newResponse+="<b>"+responesArray[i]+"</b>";
            }
        }
        newResponse=newResponse.split("*").join("</br>")
        let newResponseArray = newResponse.split(" ");
        for(let i=0;i<newResponse.length;i++){
            const nextWord=newResponseArray[i];
            delayParam(i,nextWord+" ");
        }
        setLoading(false);
        setInput("");
    }
    
    const contextValue ={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    };
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;