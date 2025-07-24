import { useState } from 'react'
import '../styles/registration.css'
import { useNavigate } from 'react-router-dom';

import { register } from '../axios/register';

function Registration(){
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Зачем тебе на фронтенде получать всех юзеров? Ниже оставил подробный коментарий по этой переменной
    const users = JSON.parse(localStorage.getItem('users')) || [];

   async function handleSubmit (e) {
    e.preventDefault();

    // Для кейсов - когда много различных проверок - создать компонент Input.jsx, который будет содержать логику и из родителя пропсами передавать value инута
    // Тогда ты сможешь во всех родительских компонентах использовать Input.jsx - просто и удобно, вся логика в одном месте
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

      case username === '':
        alert('Username должен быть заполнен')
        break

      case password.length < 6:
        alert('Пароль должен быть не менее 6 символов');
        break;
        // New comment
        // Эту проверку делает Backend, он проверяет в базе юзеров и возвращает статус-код в ответе
        // Если юзера не будет в базе, то бэк тебе вернет ответ
        // Поищи как обрабатывать логику вида if (err.status == код ошибки) - показать текст ошибки юзеру или наоборот - сделать редирект на нужную страницу
        case users.some(user => user.email === email && user.password === password):
            alert('This user already exist')
        return;

      default:
        alert('Успешная регистрация!');
        // Тут происходит смешение бизнесс-логики (куда редиректить юзера - отвечает за это Router)
        // А еще валидация input - за которую отвечает только сам Input.jsx
        // Проще вынести Input.jsx  в отдельный компонент, а на уровне компонента Registration использовать axios-запросы к бэкенду
        users.push({ email, password, username, age })
        // зачем хранить юзеров в LS? зачем мне как юзеру в LS информация обо всех юзерах? если юзеров будет 1000+ в какой-то момент не хватит объема памяти в LS
        localStorage.setItem('users', JSON.stringify(users))
        setEmail('')
        setPassword('')
        setUsername('')
        setAge('');
        console.log(users)
        break;
    }

    try {
      const res = await register({username, password, age, email})
      const {token, user} = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', user.role)
      setSuccess(true)
      navigate('/main')
    } catch(error) {
      console.error(error)
      setError(error.responce?.data?.mesagge || 'Registration error')
    }
  };


    return(
        <div className="content">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Registration</h1>
                <input type="username"
                 placeholder='username'
                  className="username"
                   value={username} 
                   onChange={(e) => setUsername(e.target.value)}/>

                <input type="email" 
                placeholder='email'
                 className="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} />
                {/* Попробуй настроить prettier, чтобы он весь код форматировал в нужный формат - улучшаем читаемость кода для глаз */}
                <input type="password"
                 placeholder='password'
                  className="password"
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)}/>

                <input type="number"
                 placeholder='your age'
                  className="age"
                   value={age} 
                   onChange={(e) => setAge(e.target.value)}/>

                <input type="submit"
                 className="subm-btn"
                  style={{cursor: (email.length === 0 || password.length === 0) 
                    ? 'not-allowed' 
                    : 'pointer'}} 
                  disabled={email.length === 0 || password.length === 0}
                  />
                  {error && <p>{error}</p>}
                  {success && <p>{success}</p>}
            </form>
        </div>
    )
}
export default Registration