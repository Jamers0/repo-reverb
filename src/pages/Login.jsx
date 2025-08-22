import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.username) {
      setStep(2);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica de autenticação mockada
    if (formData.password) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-pw-green rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">SGL</span>
            </div>
            <div className="w-16 h-12 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">KL</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Acesso ao Sistema' : 'Digite sua senha'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 ? 'Digite seu código de usuário' : `Usuário: ${formData.username}`}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step === 1 ? handleNextStep : handleLogin}>
          <div className="space-y-4">
            {step === 1 ? (
              <Input
                id="username"
                name="username"
                type="text"
                label="Código do Usuário"
                placeholder="Digite seu código"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            ) : (
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute top-6 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full">
              {step === 1 ? 'Continuar' : 'Entrar'}
            </Button>
          </div>

          {step === 1 && (
            <div className="flex items-center justify-between text-sm">
              <a href="#" className="font-medium text-pw-green hover:text-pw-green/80">
                Esqueceu seu código?
              </a>
              <a href="#" className="font-medium text-pw-green hover:text-pw-green/80">
                Criar conta
              </a>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-pw-green hover:text-pw-green/80"
              >
                ← Voltar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
