import { useState } from 'react'
import '../styles/registration.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Registration(){
    const navigate = useNavigate()


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [user, setUser] = useState(null)
    const [success, setSuccess] = useState(false)

    const users = JSON.parse(localStorage.getItem('users')) || [];

   const handleSubmit = async (e) => {
    e.preventDefault();

    switch (true) {
      case email === '':
        alert('Поле email не заполнено');
        break;

      case !email.includes('@') || !email.includes('.'):
        alert('Email должен содержать "@" и точку');
        break;

      case password === '':
        alert('Поле пароля не заполнено');
        break;

      case password.length < 6:
        alert('Пароль должен быть не менее 6 символов');
        break;

        case users.some(user => user.email === email && user.password === password):
            alert('This user already exist')
        return;

      default:
        alert('Успешная регистрация!');
        setSuccess(true)
        setLoad(true)
        users.push({ email, password })
        localStorage.setItem('users', JSON.stringify(users))
        setEmail('')
        setPassword('')
        console.log(users)
        break;
    }

      try{
      const res = await register({email, password})
      const {token, user} = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', user.role)
      setSuccess(true)
      navigate('/main')
    }catch(err){
      console.error(err)
      setError(err.responce?.data?.mesagge || 'Registration error')
    }finally {
    setLoad(false);
    setEmail('');
    setPassword('');
  }

};

  
  



    return(
        <div className="content">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Registration</h1>
                <input type="email" 
                placeholder='email'
                 className="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} />

                <input type="password"
                 placeholder='password'
                  className="password"
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)}/>

                <input type="submit"
                 className="subm-btn"
                  style={{cursor: (email.length === 0 || password.length === 0) 
                    ? 'not-allowed' 
                    : 'pointer'}} 
                  disabled={email.length === 0 || password.length === 0 || load === true}
                  /> 
            </form>
        </div>
    )
}
export default Registration