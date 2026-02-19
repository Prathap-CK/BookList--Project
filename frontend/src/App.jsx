import {useEffect,useState} from "react";
import "./App.css";
function App(){
  const[books,setBooks]=useState([]);
  useEffect(()=>{
    fetch("http://localhost:3000/api/books")
    .then(res =>res.json())
    .then(data=>setBooks(data))
    .catch(err=>console.error(err));
  },[]);
  return(
    <div className="container">
      <h1 className="title">My Book Collection</h1>
      <div className="grid">
        {books.map(book=>(
          <div key={books.id} className="card">
            <img src={book.cover_url || "https://via.placeholder.com/150"} alt={book.title}/>
            <div className="card-content">
              <h3>{book.title}</h3>
              <p className ="author">by {book.author}></p>
               <p className="rating">⭐ {book.rating}</p>
            </div>
            </div>
        ))}
      </div>
    </div>

  );

}
export default App;