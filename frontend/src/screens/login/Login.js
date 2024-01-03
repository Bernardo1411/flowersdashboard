import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';
import CleanButton from '../../components/cleanButton/CleanButton';
import userAPI from '../../API/userAPI';

import './Login.css';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      try {
        const userData = { email, password };
        const response = await userAPI.signinUser(userData);

        toast.success('Login realizado com sucesso!');
        sessionStorage.setItem('token', response.token);
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.response.data.error);
      }
    } else if (mode === 'cadastrar') {
      try {
        const userData = {
          email, password, name, confirmPassword,
        };
        await userAPI.signupUser(userData);

        toast.success('Cadastro realizado com sucesso!');
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="login_div-conteiner">
      <div className="login_div-leftcontainer">
        <img
          src="/assets/images/logo.webp"
          alt="logo"
          style={{
            marginBottom: '24px',
          }}
        />
        <form onSubmit={handleSubmit} className="login_form">
          <div className="login_div-input">
            <img
              src="/assets/images/person.png"
              alt="person"
            />
            <input
              className="login_input"
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              required
            />
          </div>
          {mode === 'cadastrar' && (
            <div className="login_div-input">
              <input
                style={{
                  marginLeft: '24px',
                }}
                className="login_input"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                required
              />
            </div>
          )}
          <div className="login_div-input">
            <img
              src="/assets/images/lock.png"
              alt="lock"
            />
            <input
              className="login_input"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Senha"
              required
            />
            <CleanButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <img alt="eye" src="/assets/images/eye-off.png" />
                : <img alt="eye" src="/assets/images/eye-on.png" />}
            </CleanButton>
          </div>
          {mode === 'cadastrar' && (
          <div className="login_div-input">
            <img
              src="/assets/images/lock.png"
              alt="lock"
            />
            <input
              className="login_input"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirmar Senha"
              required
            />
            <CleanButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <img alt="eye" src="/assets/images/eye-off.png" />
                : <img alt="eye" src="/assets/images/eye-on.png" />}
            </CleanButton>
          </div>
          )}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '332px',
            marginBottom: '34px',
          }}
          >
            {mode === 'login' ? (
              <CleanButton
                onClick={() => {
                  setMode('cadastrar');
                  setEmail('');
                  setPassword('');
                }}
              >
                <p
                  style={{
                    color: '#1F5207',
                    fontFamily: 'sans-serif',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    cursor: 'pointer',
                  }}
                >
                  Cadastrar-se
                </p>
              </CleanButton>
            ) : (
              <CleanButton
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                type="button"
                onClick={() => {
                  setMode('login');
                  setName('');
                  setEmail('');
                  setPassword('');
                }}
              >
                <p
                  style={{
                    color: '#1F5207',
                    fontFamily: 'sans-serif',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    cursor: 'pointer',
                  }}
                >
                  Voltar para Login
                </p>
              </CleanButton>
            )}
          </div>
          <div className="button_div-login">
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e)}
              style={{ marginBottom: '16px' }}
            >
              {mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </Button>
            <p className="p_form-login">Ainda não tem uma conta? Entre em contato com o suporte</p>
          </div>
        </form>
      </div>
      <div className="login_div-rightcontainer">
        <img
          src="/assets/images/background_flowers800.webp"
          alt="Background flowers"
          srcSet="
            /assets/images/background_flowers800.webp 2000w,
            /assets/images/background_flowers1200.webp 2400w,
            /assets/images/background_flowers.webp 2300w
          "
          className="background-image"
        />
      </div>
    </div>
  );
}

export default Login;
