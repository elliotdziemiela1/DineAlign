import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

export default function SearchDiets () {
    const { query } = useParams();
    return (
    <div>   
        <h1>{query}</h1>
    </div>
    )
    
}