import React, { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { FiDelete } from 'react-icons/fi'
import { BsFillPenFill } from 'react-icons/bs'

const App = () => {

  const [notes, setNotes] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch('http://localhost:5001/')
      .then(res => res.json())
      .then(data => {
        setNotes(data.notes)
      })
      .catch(err => console.log(err))
  }, [])

  function addNote() {
    fetch('http://localhost:5001/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: nanoid(), title, content })
        })
          .then(res => res.json())
          .then(data => {
            setNotes(data.notes)
          })
          .catch(err => console.log(err))
    
    setTitle('')
    setContent('')
  }

  return (
    <div className='flex flex-col gap-[10px] justify-center items-center p-[20px]'>
      <h1 className='text-[40px] mb-[30px]'>Notes</h1>
      <input type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} value={title} 
        className='border-2 border-gray-400 rounded-[5px] p-[5px]'
      />
      <textarea placeholder="Content" onChange={e => setContent(e.target.value)} value={content}
        className='border-2 border-gray-400 rounded-[5px] p-[5px]'
      />
      <button onClick={() => {
          if(!title || !content) return alert('Please add both title and content')
          addNote()
        }}
        className='bg-blue-500 text-white rounded-[5px] p-[5px] mt-[10px]'
      >
        Add Note
      </button>
      <div className='flex flex-wrap gap-[100px] mt-[50px]'>
        {notes && notes.map(note => (
          <div key={note.id} className='bg-red-200 h-[250px] w-[250px] flex flex-col gap-[20px] p-[15px] rounded-[15px] items-center flex-wrap'>
            <div className='flex items-center'>
              <h3 className='font-bold'>{note.title}</h3>
              <FiDelete 
                className='ml-[60px] cursor-pointer text-red-500'
                onClick={() => {
                  fetch(`http://localhost:5001/delete/${note.id}`, {
                    method: 'POST'
                  })
                    .then(res => res.json())
                    .then(data => {
                      setNotes(data)
                    })
                    .catch(err => console.log(err))
                }} />
              <BsFillPenFill
                className='ml-[20px] cursor-pointer text-blue-500'
                onClick={() => {
                  const title = prompt('Enter new title', note.title)
                  const content = prompt('Enter new content', note.content)
                  fetch(`http://localhost:5001/edit/${note.id}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content })
                  })
                    .then(res => res.json())
                    .then(data => {
                      setNotes(data)
                    })
                    .catch(err => console.log(err))
                }}
              />

            </div>
            <p className='overflow-y-scroll h-[170px]'>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App