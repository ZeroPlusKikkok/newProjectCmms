import { FormEvent, ChangeEvent, useState } from 'react'

const Form4 = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log('Form4 -->', formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} action="">
        <input type="text" name='username' onChange={handleChange} />
        <input type="email" name='email' onChange={handleChange} />
        <input type="password" name='password' onChange={handleChange} />
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Form4
