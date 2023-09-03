import React, { useState } from 'react';
import { io } from "socket.io-client";

const App = () => {
  const socket = io("http://localhost:5000")

  const [list, setList] = useState([])
  console.log("🚀 ~ file: App.js:8 ~ App ~ list:", list)
  socket.emit('init')

  socket.on("sent", async (data) => {
    setList(data)
  })

  return (
    <>
      <ul>
        {(list || []).map((e, i) => {
          return (
            <li key={i} className='card'>
              <div>
                <span className='title'>name:</span>{e.message?.name || ""}
              </div>
              <div>
                <span className='title'>origin:</span>{e.message?.origin || ""}
              </div>
              <div>
                <span className='title'>destination:</span>{e.message?.destination || ""}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default App